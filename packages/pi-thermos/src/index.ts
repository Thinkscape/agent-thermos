import { buildThermosPayload, detectPiSubagentsProvider, type PiThermosProvider, type ToolLike } from "./providers.ts";

interface CommandContextLike {
	ui?: {
		notify?: (message: string, type?: "info" | "warning" | "error") => void;
	};
}

interface RegisteredCommandLike {
	description?: string;
	argumentHint?: string;
	handler: (args?: string, ctx?: CommandContextLike) => Promise<void> | void;
}

interface PiLike {
	tools?: ToolLike[];
	getAllTools?: () => ToolLike[];
	registerCommand?: (name: string, command: RegisteredCommandLike) => void;
	sendUserMessage?: (content: string, options?: { deliverAs?: "steer" | "followUp" }) => void;
	registerTool?: (tool: unknown) => void;
}

export default function thermosExtension(pi: PiLike = {}) {
	pi.registerCommand?.("thermos", {
		description: "Run deep correctness/security and strict code-quality reviews of the current branch.",
		argumentHint: "[base ref, PR URL, or file scope]",
		async handler(args = "", ctx = {}) {
			const detection = detectPiSubagentsProvider({ tools: getPiTools(pi) });
			if (!detection.provider) {
				ctx.ui?.notify?.(`Thermos could not detect a supported Pi subagents provider: ${detection.reason}`, "error");
				return;
			}

			const prompt = buildThermosPrompt(detection.provider, args.trim() || "current branch");
			if (!pi.sendUserMessage) {
				ctx.ui?.notify?.("Thermos generated a provider prompt, but this Pi runtime cannot submit it.", "warning");
				return;
			}

			pi.sendUserMessage(prompt);
		},
	});

	return { name: "thermos", detection: detectPiSubagentsProvider({ tools: pi.tools ?? [] }) };
}

function getPiTools(pi: PiLike): ToolLike[] {
	return pi.getAllTools?.() ?? pi.tools ?? [];
}

export function buildThermosPrompt(provider: PiThermosProvider, scope: string): string {
	const payload = buildThermosPayload(provider, scope);
	const calls = payload.calls
		.map((call, index) => `${index + 1}. Call \`${call.tool}\` with:\n${JSON.stringify(call.args, null, 2)}`)
		.join("\n\n");

	return `Run Thermos against this scope:

${scope}

Use the ${provider} Pi subagent provider. Follow the parent workflow before launching review agents:

1. Determine the review scope from the user request, PR, current branch, or relevant changed files.
2. Gather the diff and any file/context excerpts needed for reviewers to evaluate the change without guessing.
3. Put the same scoped evidence into each tool call below by replacing the placeholder sections in its prompt/task:
   - \`### Git / diff output\`
   - \`### Changed file contents\`
   - \`### User scope / intent\`
4. Launch both Thermos review agents, wait for their results, then synthesize a single prioritized review with file references and evidence.
5. If individual background summaries are already visible to the user, do not restate them wholesale. Surface the unified verdict, the highest-signal findings, and any remaining uncertainty.

${calls}`;
}

export { buildThermosPayload, detectPiSubagentsProvider };
