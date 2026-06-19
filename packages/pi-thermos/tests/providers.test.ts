import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { buildThermosPayload, detectPiSubagentsProvider } from "../src/providers.ts";

const root = resolve(import.meta.dir, "..");

describe("@thinkscape/pi-thermos provider detection", () => {
	test("detects package markers", () => {
		expect(detectPiSubagentsProvider({ packages: { "pi-subagents": true } }).provider).toBe("nico");
		expect(detectPiSubagentsProvider({ packages: { "@gotgenes/pi-subagents": true } }).provider).toBe("gotgenes");
		expect(detectPiSubagentsProvider({ packages: { "@tintinweb/pi-subagents": true } }).provider).toBe("tintinweb");
	});

	test("detects tool schemas", () => {
		expect(
			detectPiSubagentsProvider({
				tools: [{ name: "subagent", inputSchema: { properties: { tasks: {}, chain: {} } } }],
			}).provider,
		).toBe("nico");
		expect(
			detectPiSubagentsProvider({
				tools: [{ name: "subagent", inputSchema: { properties: { subagent_type: {}, prompt: {} } } }],
			}).provider,
		).toBe("gotgenes");
		expect(
			detectPiSubagentsProvider({
				tools: [{ name: "Agent", inputSchema: { properties: { subagent_type: {}, prompt: {} } } }],
			}).provider,
		).toBe("tintinweb");
	});

	test("builds dry-run payloads", () => {
		expect(buildThermosPayload("nico", "main").calls[0]?.args).toHaveProperty("tasks");
		expect(buildThermosPayload("gotgenes", "main").calls[0]?.tool).toBe("subagent");
		expect(buildThermosPayload("tintinweb", "main").calls[0]?.tool).toBe("Agent");
	});

	test("installs project agents without API keys", () => {
		const dir = mkdtempSync(join(tmpdir(), "pi-thermos-"));
		try {
			const result = Bun.spawnSync({
				cmd: [
					"node",
					join(root, "bin/pi-thermos.js"),
					"install-agents",
					"--scope",
					"project",
					"--provider",
					"gotgenes",
					"--cwd",
					dir,
				],
				stdout: "pipe",
				stderr: "pipe",
			});
			expect(result.exitCode).toBe(0);
			const agent = readFileSync(join(dir, ".pi/agents/thermo-nuclear-review-subagent.md"), "utf8");
			expect(agent).toContain("max_turns: 20");
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});
});
