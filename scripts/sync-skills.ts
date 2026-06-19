import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const sharedSkills = ["thermo-nuclear-review", "thermo-nuclear-code-quality-review"];
const packageDirs = ["packages/codex-thermos", "packages/claude-thermos", "packages/pi-thermos"];

for (const pkg of packageDirs) {
	for (const skill of sharedSkills) {
		const source = join(root, "packages/core/skills", skill, "SKILL.md");
		const target = join(root, pkg, "skills", skill, "SKILL.md");
		mkdirSync(dirname(target), { recursive: true });
		copyFileSync(source, target);
	}
}

console.log(`Synced ${sharedSkills.length} shared skills into ${packageDirs.length} packages.`);
