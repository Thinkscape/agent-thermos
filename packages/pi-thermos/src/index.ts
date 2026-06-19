import { buildThermosPayload, detectPiSubagentsProvider, type ToolLike } from "./providers.ts";

interface PiLike {
	tools?: ToolLike[];
	registerCommand?: (command: unknown) => void;
	registerTool?: (tool: unknown) => void;
}

export default function thermosExtension(pi: PiLike = {}) {
	const detection = detectPiSubagentsProvider({ tools: pi.tools ?? [] });

	const command = {
		name: "thermos",
		description: "Run deep correctness/security and strict code-quality reviews of the current branch.",
		async execute(args: { prompt?: string } = {}) {
			if (!detection.provider) {
				return `Thermos could not detect a supported Pi subagents provider: ${detection.reason}`;
			}
			return JSON.stringify(buildThermosPayload(detection.provider, args.prompt ?? "current branch"), null, 2);
		},
	};

	pi.registerCommand?.(command);
	return { name: "thermos", detection };
}

export { buildThermosPayload, detectPiSubagentsProvider };
