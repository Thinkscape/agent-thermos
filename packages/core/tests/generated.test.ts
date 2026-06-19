import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
	renderClaudeAgent,
	renderClaudeRunCommand,
	renderClaudeShimCommand,
	renderCodexThermosSkill,
	renderPiAgent,
} from "../src/render.ts";

const root = resolve(import.meta.dir, "../../..");
const piProviders = ["nico", "gotgenes", "tintinweb"] as const;
const agentFiles = [
	["deep", "thermo-nuclear-review-subagent.md"],
	["quality", "thermo-nuclear-code-quality-review-subagent.md"],
] as const;
const sharedSkills = ["thermo-nuclear-review", "thermo-nuclear-code-quality-review"] as const;
const sharedSkillPackages = ["packages/codex-thermos", "packages/claude-thermos", "packages/pi-thermos"] as const;

function read(path: string): string {
	return readFileSync(join(root, path), "utf8");
}

function expectGeneratedFile(path: string, expected: string) {
	expect(read(path).trimEnd()).toBe(expected.trimEnd());
}

describe("generated package files", () => {
	test("Codex package exposes thermos plugin and $thermos skill", () => {
		const manifest = JSON.parse(read("packages/codex-thermos/.codex-plugin/plugin.json")) as {
			name: string;
			interface: { displayName: string; logo: string };
		};
		expect(manifest.name).toBe("thermos");
		expect(manifest.interface.displayName).toBe("Thermos");
		expect(manifest.interface.logo).toBe("./assets/logo.png");
		expectGeneratedFile("packages/codex-thermos/skills/thermos/SKILL.md", renderCodexThermosSkill());
	});

	test("Claude package exposes thermos plugin, run command, and agents", () => {
		const manifest = JSON.parse(read("packages/claude-thermos/.claude-plugin/plugin.json")) as {
			name: string;
			commands: string[];
			agents: string[];
		};
		expect(manifest.name).toBe("thermos");
		expect(manifest.commands).toContain("./commands/run.md");
		expect(manifest.agents).toContain("./agents/thermo-nuclear-review-subagent.md");
		expect(manifest.agents).toContain("./agents/thermo-nuclear-code-quality-review-subagent.md");
		expectGeneratedFile("packages/claude-thermos/commands/run.md", renderClaudeRunCommand());
		expectGeneratedFile("packages/claude-thermos/commands/thermos.md", renderClaudeShimCommand());
		expectGeneratedFile("packages/claude-thermos/agents/thermo-nuclear-review-subagent.md", renderClaudeAgent("deep"));
		expectGeneratedFile(
			"packages/claude-thermos/agents/thermo-nuclear-code-quality-review-subagent.md",
			renderClaudeAgent("quality"),
		);
	});

	test("Pi package includes generated provider agent templates", () => {
		for (const provider of piProviders) {
			for (const [kind, file] of agentFiles) {
				expectGeneratedFile(`packages/pi-thermos/agents/${provider}/${file}`, renderPiAgent(kind, provider));
			}
		}
	});

	test("host packages copy shared rubric skills from core", () => {
		for (const skill of sharedSkills) {
			const expected = read(`packages/core/skills/${skill}/SKILL.md`);
			for (const pkg of sharedSkillPackages) {
				expectGeneratedFile(`${pkg}/skills/${skill}/SKILL.md`, expected);
			}
		}
	});

	test("asset references point to committed files", () => {
		for (const dir of [
			"assets",
			"packages/codex-thermos/assets",
			"packages/claude-thermos/assets",
			"packages/pi-thermos/assets",
		]) {
			expect(existsSync(join(root, dir, "logo.png"))).toBe(true);
			expect(existsSync(join(root, dir, "icon.png"))).toBe(true);
		}
	});
});
