import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");

describe("@thinkscape/claude-thermos integration", () => {
	test("has a valid Claude plugin manifest", () => {
		const manifest = JSON.parse(readFileSync(join(root, ".claude-plugin/plugin.json"), "utf8")) as {
			name: string;
			commands: string[];
			agents: string[];
		};
		expect(manifest.name).toBe("thermos");
		expect(manifest.commands).toContain("./commands/run.md");
		expect(manifest.agents).toContain("./agents/thermo-nuclear-review-subagent.md");
	});

	test("run command is concise and points to thermos agents", () => {
		const command = readFileSync(join(root, "commands/run.md"), "utf8");
		expect(command).toContain("description: Run deep correctness/security");
		expect(command).toContain("Usage: `/thermos:run");
		expect(command).toContain("thermos:thermo-nuclear-review-subagent");
	});

	test("installs standalone /thermos shim without API keys", () => {
		const dir = mkdtempSync(join(tmpdir(), "claude-thermos-"));
		try {
			const result = Bun.spawnSync({
				cmd: ["node", join(root, "bin/claude-thermos.js"), "install-command", "--scope", "project", "--cwd", dir],
				stdout: "pipe",
				stderr: "pipe",
			});
			expect(result.exitCode).toBe(0);
			const shim = readFileSync(join(dir, ".claude/commands/thermos.md"), "utf8");
			expect(shim).toContain("Usage: `/thermos");
			expect(shim).toContain("thermos:thermo-nuclear-code-quality-review-subagent");
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});
});
