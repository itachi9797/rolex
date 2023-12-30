const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

async function getCodeStats(directoryPath = './') {
	const stats = {
		files: 0,
		lines: 0,
		imports: 0,
		classes: 0,
		functions: 0,
		coroutines: 0,
		docstrings: 0,
	};

	const files = await promisify(fs.readdir)(directoryPath);

	for (const file of files) {
		if (file === 'node_modules') {
			continue;
		}

		const filePath = path.join(directoryPath, file);
		const fileStats = await promisify(fs.stat)(filePath);

		if (fileStats.isDirectory()) {
			const subdirectoryStats = await getCodeStats(filePath);
			stats.files += subdirectoryStats.files;
			stats.lines += subdirectoryStats.lines;
			stats.imports += subdirectoryStats.imports;
			stats.classes += subdirectoryStats.classes;
			stats.functions += subdirectoryStats.functions;
			stats.coroutines += subdirectoryStats.coroutines;
			stats.docstrings += subdirectoryStats.docstrings;
		}
		else if (fileStats.isFile() && file.endsWith('.js')) {
			stats.files++;
			const content = await fs.promises.readFile(filePath, 'utf-8');
			const lines = content.split('\n');

			for (const line of lines) {
				if (line.trim().includes('const') || line.trim().includes('import') || line.trim().includes('var') || line.trim().includes('let') || line.trim().includes('export') || line.trim().includes('from') || line.trim().includes('require') || line.trim().includes('module.exports') || line.trim().includes('export default')) {
					stats.imports++;
				}
				else if (line.trim().includes('class')) {
					stats.classes++;
				}
				else if (line.trim().includes('async function') || line.trim().includes('function')) {
					stats.functions++;
				}
				else if (line.trim().includes('async')) {
					stats.coroutines++;
				}
				else if (line.trim().includes('/*') || line.trim().includes('//')) {
					stats.docstrings++;
				}
			}

			stats.lines += lines.length;
		}
	}

	return stats;
}

module.exports = { getCodeStats };