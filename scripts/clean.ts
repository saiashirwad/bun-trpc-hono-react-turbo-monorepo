import { log } from "@clack/prompts";
import fs from "node:fs";
import path from "node:path";

async function findTsBuildInfoFiles(dir: string): Promise<string[]> {
	const files: string[] = [];

	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (
			entry.isDirectory() &&
			!entry.name.startsWith(".") &&
			entry.name !== "node_modules"
		) {
			files.push(...(await findTsBuildInfoFiles(fullPath)));
		} else if (entry.name.endsWith(".tsbuildinfo")) {
			files.push(fullPath);
		}
	}

	return files;
}

async function main() {
	const rootDir = process.cwd();
	log.info("Finding .tsbuildinfo files...");

	const buildInfoFiles = await findTsBuildInfoFiles(rootDir);

	if (buildInfoFiles.length === 0) {
		log.info("No .tsbuildinfo files found");
		return;
	}

	log.step(`Found ${buildInfoFiles.length} .tsbuildinfo files:`);
	buildInfoFiles.forEach((file) => {
		console.log(`  - ${path.relative(rootDir, file)}`);
	});

	try {
		for (const file of buildInfoFiles) {
			await fs.promises.unlink(file);
		}
		log.success("All .tsbuildinfo files deleted");
	} catch (error) {
		log.error("Error deleting files:");
		log.error(String(error));
		process.exit(1);
	}
}

main().catch((error) => {
	log.error("Fatal error:");
	log.error(String(error));
	process.exit(1);
});
