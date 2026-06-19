import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const repoRoot = resolve(import.meta.dir, "../../..");

describe("@thinkscape/codex-thermos integration", () => {
	test("has a valid Codex plugin manifest", () => {
		const manifest = JSON.parse(readFileSync(join(root, ".codex-plugin/plugin.json"), "utf8")) as {
			name: string;
			skills: string;
			interface: { displayName: string; logo: string; composerIcon: string };
		};
		expect(manifest.name).toBe("thermos");
		expect(manifest.skills).toBe("./skills/");
		expect(manifest.interface.displayName).toBe("Thermos");
		expect(existsSync(join(root, manifest.interface.logo))).toBe(true);
		expect(existsSync(join(root, manifest.interface.composerIcon))).toBe(true);
	});

	test("exposes $thermos skill", () => {
		const skill = readFileSync(join(root, "skills/thermos/SKILL.md"), "utf8");
		const metadata = readFileSync(join(root, "skills/thermos/agents/openai.yaml"), "utf8");
		expect(skill).toContain("name: thermos");
		expect(skill).toContain("$thermos");
		expect(metadata).toContain("allow_implicit_invocation");
	});

	test("is listed in the repo Codex marketplace", () => {
		const marketplace = JSON.parse(readFileSync(join(repoRoot, ".agents/plugins/marketplace.json"), "utf8")) as {
			plugins: Array<{ name: string; source: { path: string } }>;
		};
		const entry = marketplace.plugins.find((plugin) => plugin.name === "thermos");
		expect(entry?.source.path).toBe("./packages/codex-thermos");
	});
});
