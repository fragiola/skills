import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, describe, test } from "node:test";
import {
    checkRepository,
    MAX_SKILL_LINES,
    markdownLinks,
    parseFrontmatter,
    type Rule,
} from "./check-skills.ts";

const roots: string[] = [];
after(() => {
    for (const root of roots) rmSync(root, { recursive: true, force: true });
});

const SKILL = `---
name: good-skill
description: A valid skill. Use when testing the checker.
---

# Good skill

See [the rules](rules/page.md) and [the evals](evals/evals.json).

\`\`\`md
[ignored](inside-code.md)
\`\`\`
`;

const VALID: Record<string, string> = {
    "README.md": "# Fixture\n",
    "skills/good-skill/SKILL.md": SKILL,
    "skills/good-skill/rules/page.md":
        "# Page\n\nBack to [the skill](../SKILL.md#good-skill).\n",
    "skills/good-skill/evals/evals.json": '{ "skill_name": "good-skill" }\n',
};

/** A repository made of the valid fixture, with `changes` applied (null deletes). */
function fixture(changes: Record<string, string | null> = {}): string {
    const root = mkdtempSync(join(tmpdir(), "check-skills-"));
    roots.push(root);
    const files: Record<string, string | null> = { ...VALID, ...changes };
    for (const [path, content] of Object.entries(files)) {
        if (content === null) continue;
        const file = join(root, path);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, content);
    }
    return root;
}

function rules(root: string): Rule[] {
    return checkRepository(root).map((problem) => problem.rule);
}

const skill = (frontmatter: string, body = "# Skill\n") =>
    `---\n${frontmatter}\n---\n\n${body}`;

describe("checkRepository", () => {
    test("a valid skill has no problems", () => {
        assert.deepEqual(checkRepository(fixture()), []);
    });

    test("a skill folder without SKILL.md", () => {
        assert.deepEqual(rules(fixture({ "skills/empty/notes.md": "x\n" })), [
            "skill-file",
        ]);
    });

    test("SKILL.md without frontmatter", () => {
        const root = fixture({
            "skills/good-skill/SKILL.md": SKILL.replace(/^---[\s\S]*?---\n/, ""),
        });
        assert.ok(rules(root).includes("frontmatter"));
    });

    test("a name that is not lowercase kebab-case", () => {
        const root = fixture({
            "skills/good-skill/SKILL.md": SKILL.replace(
                "name: good-skill",
                "name: Good--Skill",
            ),
        });
        assert.deepEqual(rules(root), ["name"]);
    });

    test("a name that does not match the folder", () => {
        const root = fixture({
            "skills/good-skill/SKILL.md": SKILL.replace(
                "name: good-skill",
                "name: other-skill",
            ),
        });
        assert.deepEqual(rules(root), ["name"]);
    });

    test("a missing or too long description", () => {
        const missing = fixture({
            "skills/good-skill/SKILL.md": SKILL.replace(/description:.*\n/, ""),
        });
        assert.deepEqual(rules(missing), ["description"]);
        const long = fixture({
            "skills/good-skill/SKILL.md": SKILL.replace(
                /description:.*\n/,
                `description: ${"x".repeat(1025)}\n`,
            ),
        });
        assert.deepEqual(rules(long), ["description"]);
        const block = fixture({
            "skills/good-skill/SKILL.md": SKILL.replace(
                /description:.*\n/,
                "description: >\n  A folded description.\n",
            ),
        });
        assert.deepEqual(rules(block), ["description"]);
    });

    test(`SKILL.md longer than ${MAX_SKILL_LINES} lines`, () => {
        const root = fixture({
            "skills/good-skill/SKILL.md": SKILL + "line\n".repeat(MAX_SKILL_LINES),
        });
        assert.deepEqual(rules(root), ["length"]);
    });

    test("a broken relative link, or one leaving the skill", () => {
        const broken = fixture({
            "skills/good-skill/rules/page.md": "See [missing](missing.md).\n",
        });
        assert.deepEqual(rules(broken), ["link"]);
        const outside = fixture({
            "skills/good-skill/rules/page.md": "See [readme](../../../README.md).\n",
        });
        assert.deepEqual(rules(outside), ["link"]);
    });

    test("a page not linked from SKILL.md", () => {
        const root = fixture({ "skills/good-skill/rules/lost.md": "# Lost\n" });
        assert.deepEqual(rules(root), ["orphan"]);
    });

    test("a file or folder name that is not kebab-case", () => {
        const root = fixture({
            "skills/good-skill/rules/page.md": null,
            "skills/good-skill/Rules/Page.md": "# Page\n",
            "skills/good-skill/SKILL.md": SKILL.replace(
                "rules/page.md",
                "Rules/Page.md",
            ),
        });
        assert.deepEqual(rules(root), ["kebab-case", "kebab-case"]);
    });

    test("dotfiles, suffixes and required names are allowed", () => {
        const root = fixture({
            ".github/workflows/ci.yml": "name: CI\n",
            "scripts/check-skills.test.ts": "\n",
            "AGENTS.md": "# Rules\n",
            LICENSE: "MIT\n",
        });
        assert.deepEqual(checkRepository(root), []);
    });

    test("evals that are not JSON or name another skill", () => {
        const invalid = fixture({ "skills/good-skill/evals/evals.json": "{" });
        assert.deepEqual(rules(invalid), ["evals"]);
        const other = fixture({
            "skills/good-skill/evals/evals.json": '{ "skill_name": "other" }',
        });
        assert.deepEqual(rules(other), ["evals"]);
    });

    test("each problem names its file", () => {
        const root = fixture({ "skills/good-skill/rules/lost.md": "# Lost\n" });
        assert.equal(
            checkRepository(root)[0]?.file,
            join("skills", "good-skill", "rules", "lost.md"),
        );
    });
});

describe("parseFrontmatter", () => {
    test("reads top-level scalars, unquoted, and skips nested maps", () => {
        assert.deepEqual(
            parseFrontmatter(
                skill(
                    'name: "a-skill"\ndescription: Does things.\nmetadata:\n  author: someone',
                ),
            ),
            { name: "a-skill", description: "Does things.", metadata: "" },
        );
    });

    test("returns null without frontmatter", () => {
        assert.equal(parseFrontmatter("# Title\n"), null);
    });
});

describe("markdownLinks", () => {
    test("keeps relative targets, drops anchors, URLs and code", () => {
        assert.deepEqual(
            markdownLinks(
                "[a](a.md#x) [b](https://x.dev) [c](#top) `[d](d.md)` [e](sub/e%20f.md)",
            ),
            ["a.md", "sub/e f.md"],
        );
    });
});
