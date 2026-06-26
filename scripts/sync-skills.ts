import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const sharedSkills = ["thermo-nuclear-review", "thermo-nuclear-code-quality-review"];
const codexPackageDir = "packages/codex-thermos";
const piPackageDir = "packages/pi-thermos";

for (const skill of sharedSkills) {
	const source = join(root, "packages/core/skills", skill, "SKILL.md");
	const piTarget = join(root, piPackageDir, "skills", skill, "SKILL.md");
	const codexReferenceTarget = join(root, codexPackageDir, "skills", "thermos", "references", `${skill}.md`);

	mkdirSync(dirname(piTarget), { recursive: true });
	copyFileSync(source, piTarget);

	mkdirSync(dirname(codexReferenceTarget), { recursive: true });
	copyFileSync(source, codexReferenceTarget);

	rmSync(join(root, codexPackageDir, "skills", skill), { recursive: true, force: true });
}

console.log(`Synced ${sharedSkills.length} shared skills into Pi skills and Codex Thermos references.`);
