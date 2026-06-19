#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";

const command = `---
description: Run deep correctness/security and strict code-quality reviews of the current branch.
argument-hint: [base-ref | PR URL | scope]
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git show:*), Bash(git rev-parse:*), Bash(gh pr view:*), Bash(glab mr view:*)
---

# Thermos

Usage: \`/thermos [base-ref | PR URL | scope]\`

Run the Thermos double review workflow. Prefer the installed plugin agents:

- \`thermos:thermo-nuclear-review-subagent\`
- \`thermos:thermo-nuclear-code-quality-review-subagent\`

Gather \`git diff <base>...HEAD\`, changed-file paths, and relevant file contents. Launch both agents in parallel with the same labeled context, then synthesize prioritized, deduped findings.
`;

function usage() {
	console.log(`claude-thermos

Usage:
  claude-thermos install-command [--scope project|user] [--cwd <path>] [--dry-run]

Installs a standalone Claude Code /thermos command shim. The plugin-native command remains /thermos:run.`);
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
	usage();
	process.exit(0);
}

if (args[0] !== "install-command") {
	usage();
	process.exit(args.length === 0 ? 0 : 1);
}

let scope = "project";
let cwd = process.cwd();
let dryRun = false;

for (let i = 1; i < args.length; i++) {
	const arg = args[i];
	if (arg === "--scope") {
		scope = args[++i] ?? scope;
	} else if (arg === "--cwd") {
		cwd = resolve(args[++i] ?? cwd);
	} else if (arg === "--dry-run") {
		dryRun = true;
	} else {
		throw new Error(`Unknown argument: ${arg}`);
	}
}

if (scope !== "project" && scope !== "user") {
	throw new Error(`--scope must be "project" or "user", got ${scope}`);
}

const targetDir = scope === "project" ? resolve(cwd, ".claude", "commands") : resolve(homedir(), ".claude", "commands");
const targetFile = resolve(targetDir, "thermos.md");

if (!dryRun) {
	mkdirSync(targetDir, { recursive: true });
	writeFileSync(targetFile, command);
}

console.log(`${dryRun ? "Would install" : "Installed"} /thermos shim at ${targetFile}`);
