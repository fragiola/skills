// Checks every skill in `skills/` against the Agent Skills format
// (https://agentskills.io/specification) and this repository's rules
// (AGENTS.md). Zero dependencies: runs on Node 24 type stripping.
//
//   node scripts/check-skills.ts [root]
//
// Exits 1 and prints one line per problem: `<file>: [<rule>] <message>`.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export type Rule =
    | "skill-file"
    | "frontmatter"
    | "name"
    | "description"
    | "length"
    | "link"
    | "orphan"
    | "kebab-case"
    | "evals";

export type Problem = { file: string; rule: Rule; message: string };

export const MAX_SKILL_LINES = 500;
export const MAX_NAME_LENGTH = 64;
export const MAX_DESCRIPTION_LENGTH = 1024;

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Names a tool or a convention requires, exempt from kebab-case. */
const REQUIRED_NAMES = new Set([
    "SKILL.md",
    "README.md",
    "AGENTS.md",
    "CLAUDE.md",
    "LICENSE",
    "package.json",
]);

/** Folders never walked by the name check. */
const SKIPPED_FOLDERS = new Set([".git", "node_modules", ".worktrees"]);

/** Every problem in the repository at `root`, in a stable order. */
export function checkRepository(root: string): Problem[] {
    const problems: Problem[] = [...checkNames(root)];
    const skillsDir = join(root, "skills");
    if (!existsSync(skillsDir)) {
        return problems;
    }
    for (const name of readdirSync(skillsDir).sort()) {
        const dir = join(skillsDir, name);
        if (statSync(dir).isDirectory()) {
            problems.push(...checkSkill(root, dir));
        }
    }
    return problems;
}

/** The problems of one skill folder. */
export function checkSkill(root: string, dir: string): Problem[] {
    const problems: Problem[] = [];
    const folder = dir.split(sep).at(-1) ?? "";
    const skillFile = join(dir, "SKILL.md");
    const at = (file: string) => relative(root, file);

    if (!existsSync(skillFile)) {
        return [
            { file: at(dir), rule: "skill-file", message: "missing SKILL.md" },
        ];
    }

    const text = readFileSync(skillFile, "utf8");
    const frontmatter = parseFrontmatter(text);
    if (!frontmatter) {
        problems.push({
            file: at(skillFile),
            rule: "frontmatter",
            message: "missing YAML frontmatter between --- lines",
        });
    } else {
        problems.push(...checkName(at(skillFile), folder, frontmatter.name));
        problems.push(
            ...checkDescription(at(skillFile), frontmatter.description),
        );
    }

    const lines = text.split("\n").length - (text.endsWith("\n") ? 1 : 0);
    if (lines > MAX_SKILL_LINES) {
        problems.push({
            file: at(skillFile),
            rule: "length",
            message: `${lines} lines, the limit is ${MAX_SKILL_LINES}`,
        });
    }

    const pages = listFiles(dir).filter((file) => file.endsWith(".md"));
    for (const page of pages) {
        for (const target of markdownLinks(readFileSync(page, "utf8"))) {
            const resolved = resolve(dirname(page), target);
            if (!resolved.startsWith(dir + sep) || !existsSync(resolved)) {
                problems.push({
                    file: at(page),
                    rule: "link",
                    message: `broken link: ${target}`,
                });
            }
        }
    }

    const linked = new Set(
        markdownLinks(text).map((target) => resolve(dir, target)),
    );
    for (const page of pages) {
        if (page !== skillFile && !linked.has(page)) {
            problems.push({
                file: at(page),
                rule: "orphan",
                message: "not linked from SKILL.md",
            });
        }
    }

    const evals = join(dir, "evals", "evals.json");
    if (existsSync(evals)) {
        problems.push(...checkEvals(at(evals), folder, evals));
    }

    return problems;
}

function checkName(
    file: string,
    folder: string,
    name: string | undefined,
): Problem[] {
    const problem = (message: string): Problem[] => [
        { file, rule: "name", message },
    ];
    if (!name) return problem("missing `name`");
    if (name.length > MAX_NAME_LENGTH) {
        return problem(`\`name\` is longer than ${MAX_NAME_LENGTH} characters`);
    }
    if (!NAME_PATTERN.test(name)) {
        return problem(
            `\`name\` "${name}" must be lowercase a-z, 0-9 and single hyphens`,
        );
    }
    if (name !== folder) {
        return problem(`\`name\` "${name}" must match the folder "${folder}"`);
    }
    return [];
}

function checkDescription(
    file: string,
    description: string | undefined,
): Problem[] {
    if (!description) {
        return [{ file, rule: "description", message: "missing `description`" }];
    }
    if (/^[>|][+-]?$/.test(description)) {
        return [
            {
                file,
                rule: "description",
                message: "`description` must be on one line (no `>` or `|` block)",
            },
        ];
    }
    if (description.length > MAX_DESCRIPTION_LENGTH) {
        return [
            {
                file,
                rule: "description",
                message: `\`description\` has ${description.length} characters, the limit is ${MAX_DESCRIPTION_LENGTH}`,
            },
        ];
    }
    return [];
}

function checkEvals(file: string, folder: string, path: string): Problem[] {
    let data: unknown;
    try {
        data = JSON.parse(readFileSync(path, "utf8"));
    } catch {
        return [{ file, rule: "evals", message: "not valid JSON" }];
    }
    const skillName =
        typeof data === "object" && data !== null && "skill_name" in data
            ? data.skill_name
            : undefined;
    if (skillName !== folder) {
        return [
            {
                file,
                rule: "evals",
                message: `\`skill_name\` must be "${folder}"`,
            },
        ];
    }
    return [];
}

/** Every file and folder name under `root` is kebab-case or required by a tool. */
function checkNames(root: string): Problem[] {
    const problems: Problem[] = [];
    const walk = (dir: string) => {
        for (const entry of readdirSync(dir).sort()) {
            const path = join(dir, entry);
            const isDir = statSync(path).isDirectory();
            if (isDir && SKIPPED_FOLDERS.has(entry)) continue;
            if (!isKebabCase(entry)) {
                problems.push({
                    file: relative(root, path),
                    rule: "kebab-case",
                    message: `"${entry}" is not kebab-case`,
                });
            }
            if (isDir) walk(path);
        }
    };
    walk(root);
    return problems;
}

function isKebabCase(entry: string): boolean {
    if (REQUIRED_NAMES.has(entry)) return true;
    // Dotfiles (.github, .gitignore) are tool names; check what follows the dot.
    const name = entry.startsWith(".") ? entry.slice(1) : entry;
    // Suffixes stay: `check-skills.test.ts` → `check-skills`.
    const stem = name.split(".")[0] ?? "";
    return NAME_PATTERN.test(stem);
}

/** The top-level scalar fields of a YAML frontmatter, or null when there is none. */
export function parseFrontmatter(
    text: string,
): Record<string, string> | null {
    const match = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/.exec(text);
    if (!match?.[1]) return null;
    const fields: Record<string, string> = {};
    for (const line of match[1].split(/\r?\n/)) {
        // Nested maps (metadata) are indented; only top-level scalars matter here.
        const field = /^([a-z][\w-]*):\s*(.*)$/.exec(line);
        if (!field?.[1]) continue;
        fields[field[1]] = unquote((field[2] ?? "").trim());
    }
    return fields;
}

function unquote(value: string): string {
    const quoted = /^(["'])(.*)\1$/.exec(value);
    return quoted?.[2] ?? value;
}

/** The relative link targets of a Markdown text, outside code. */
export function markdownLinks(text: string): string[] {
    const prose = text
        .replace(/^(```|~~~)[\s\S]*?^\1/gm, "")
        .replace(/`[^`\n]*`/g, "");
    const targets: string[] = [];
    for (const match of prose.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
        const target = (match[1] ?? "").split("#")[0] ?? "";
        if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
        targets.push(decodeURI(target));
    }
    return targets;
}

function listFiles(dir: string): string[] {
    return readdirSync(dir, { recursive: true, encoding: "utf8" })
        .map((entry) => join(dir, entry))
        .filter((path) => statSync(path).isFile())
        .sort();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const root = resolve(process.argv[2] ?? ".");
    const problems = checkRepository(root);
    for (const { file, rule, message } of problems) {
        process.stderr.write(`${file}: [${rule}] ${message}\n`);
    }
    if (problems.length > 0) {
        process.stderr.write(`\n${problems.length} problem(s).\n`);
        process.exit(1);
    }
    process.stdout.write("All skills are valid.\n");
}
