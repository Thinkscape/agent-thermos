import { accessSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const packages = [
	{
		name: "@thinkscape/codex-thermos",
		dir: "packages/codex-thermos",
		required: [
			"package.json",
			"README.md",
			".codex-plugin/plugin.json",
			"skills/thermos/SKILL.md",
			"skills/thermo-nuclear-review/SKILL.md",
			"skills/thermo-nuclear-code-quality-review/SKILL.md",
			"assets/logo.png",
		],
	},
	{
		name: "@thinkscape/claude-thermos",
		dir: "packages/claude-thermos",
		required: [
			"package.json",
			"README.md",
			".claude-plugin/plugin.json",
			"commands/run.md",
			"commands/thermos.md",
			"bin/claude-thermos.js",
			"skills/thermo-nuclear-review/SKILL.md",
			"skills/thermo-nuclear-code-quality-review/SKILL.md",
			"assets/logo.png",
		],
	},
	{
		name: "@thinkscape/pi-thermos",
		dir: "packages/pi-thermos",
		required: [
			"package.json",
			"README.md",
			"src/providers.ts",
			"bin/pi-thermos.js",
			"skills/thermo-nuclear-review/SKILL.md",
			"skills/thermo-nuclear-code-quality-review/SKILL.md",
			"assets/logo.png",
		],
	},
];

for (const pkg of packages) {
	const pkgJson = JSON.parse(readFileSync(join(root, pkg.dir, "package.json"), "utf8")) as { name?: string };
	if (pkgJson.name !== pkg.name) {
		throw new Error(`${pkg.dir}/package.json has name ${pkgJson.name}; expected ${pkg.name}`);
	}

	for (const file of pkg.required) {
		accessSync(join(root, pkg.dir, file));
	}
}

console.log(`Validated package contents for ${packages.length} public packages.`);
