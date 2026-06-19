#!/usr/bin/env node
import { copyFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const providers = new Set(["auto", "nico", "gotgenes", "tintinweb"]);
const agentFiles = ["thermo-nuclear-review-subagent.md", "thermo-nuclear-code-quality-review-subagent.md"];

function usage() {
	console.log(`pi-thermos

Usage:
  pi-thermos install-agents [--scope project|user] [--provider auto|nico|gotgenes|tintinweb] [--cwd <path>] [--dry-run]

Installs Thermos agent definitions for supported Pi subagents providers.`);
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
	usage();
	process.exit(0);
}

if (args[0] !== "install-agents") {
	usage();
	process.exit(args.length === 0 ? 0 : 1);
}

let scope = "project";
let provider = "auto";
let cwd = process.cwd();
let dryRun = false;

for (let i = 1; i < args.length; i++) {
	const arg = args[i];
	if (arg === "--scope") scope = args[++i] ?? scope;
	else if (arg === "--provider") provider = args[++i] ?? provider;
	else if (arg === "--cwd") cwd = resolve(args[++i] ?? cwd);
	else if (arg === "--dry-run") dryRun = true;
	else throw new Error(`Unknown argument: ${arg}`);
}

if (scope !== "project" && scope !== "user") throw new Error(`--scope must be "project" or "user", got ${scope}`);
if (!providers.has(provider)) throw new Error(`Unsupported provider ${provider}`);

const actualProvider = provider === "auto" ? "nico" : provider;
const targetDir = scope === "project" ? resolve(cwd, ".pi", "agents") : resolve(homedir(), ".pi", "agent", "agents");

if (!dryRun) mkdirSync(targetDir, { recursive: true });

for (const file of agentFiles) {
	const source = resolve(packageRoot, "agents", actualProvider, file);
	const target = resolve(targetDir, file);
	if (!dryRun) copyFileSync(source, target);
	console.log(`${dryRun ? "Would install" : "Installed"} ${target}`);
}
