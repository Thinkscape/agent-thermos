import { describe, expect, test } from "bun:test";
import {
	renderClaudeAgent,
	renderClaudeRunCommand,
	renderClaudeShimCommand,
	renderCodexThermosSkill,
	renderPiAgent,
} from "../src/render.ts";

describe("renderers", () => {
	test("renders Codex $thermos skill", () => {
		const skill = renderCodexThermosSkill();
		expect(skill).toContain("name: thermos");
		expect(skill).toContain("$thermos");
		expect(skill).toContain("thermo-nuclear-review-subagent");
	});

	test("renders Claude plugin command and shim variants", () => {
		expect(renderClaudeRunCommand()).toContain("Usage: `/thermos:run");
		expect(renderClaudeShimCommand()).toContain("Usage: `/thermos ");
	});

	test("renders Claude agents", () => {
		expect(renderClaudeAgent("deep")).toContain("name: thermo-nuclear-review-subagent");
		expect(renderClaudeAgent("quality")).toContain("code-judo");
	});

	test("renders Pi provider agents", () => {
		expect(renderPiAgent("deep", "nico")).toContain("systemPromptMode: replace");
		expect(renderPiAgent("quality", "gotgenes")).toContain("max_turns: 20");
		expect(renderPiAgent("quality", "tintinweb")).toContain("tools: read, grep");
	});
});
