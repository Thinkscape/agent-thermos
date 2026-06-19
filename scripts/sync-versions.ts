import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const manifests = [
	{
		packageJson: "packages/codex-thermos/package.json",
		manifest: "packages/codex-thermos/.codex-plugin/plugin.json",
	},
	{
		packageJson: "packages/claude-thermos/package.json",
		manifest: "packages/claude-thermos/.claude-plugin/plugin.json",
	},
];

for (const { packageJson, manifest } of manifests) {
	const pkg = JSON.parse(readFileSync(join(root, packageJson), "utf8")) as { version?: string };
	if (!pkg.version) throw new Error(`${packageJson} is missing version`);

	const manifestPath = join(root, manifest);
	const source = readFileSync(manifestPath, "utf8");
	const updated = source.replace(/("version":\s*")[^"]+(")/, `$1${pkg.version}$2`);
	if (updated === source && !source.includes(`"version": "${pkg.version}"`)) {
		throw new Error(`${manifest} is missing a version field`);
	}
	writeFileSync(manifestPath, updated);
}

console.log(`Synced ${manifests.length} plugin manifest versions from package.json.`);
