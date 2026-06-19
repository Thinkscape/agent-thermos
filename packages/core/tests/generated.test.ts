import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { renderClaudeRunCommand, renderCodexThermosSkill } from "../src/render.ts";

const root = resolve(import.meta.dir, "../../..");

function read(path: string): string {
	return readFileSync(join(root, path), "utf8");
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
		expect(read("packages/codex-thermos/skills/thermos/SKILL.md").trimEnd()).toBe(renderCodexThermosSkill().trimEnd());
	});

	test("Claude package exposes thermos plugin and run command", () => {
		const manifest = JSON.parse(read("packages/claude-thermos/.claude-plugin/plugin.json")) as {
			name: string;
			commands: string[];
		};
		expect(manifest.name).toBe("thermos");
		expect(manifest.commands).toContain("./commands/run.md");
		expect(read("packages/claude-thermos/commands/run.md").trimEnd()).toBe(renderClaudeRunCommand().trimEnd());
	});

	test("Pi package includes provider agent templates", () => {
		for (const provider of ["nico", "gotgenes", "tintinweb"]) {
			expect(existsSync(join(root, `packages/pi-thermos/agents/${provider}/thermo-nuclear-review-subagent.md`))).toBe(
				true,
			);
			expect(
				existsSync(join(root, `packages/pi-thermos/agents/${provider}/thermo-nuclear-code-quality-review-subagent.md`)),
			).toBe(true);
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
