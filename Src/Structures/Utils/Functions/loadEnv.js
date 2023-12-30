const fs = require('fs');
const path = require('path');

function loadEnv() {
	const envPath = path.resolve('.env');

	try {
		const envContent = fs.readFileSync(envPath, 'utf8');
		const envLines = envContent.split('\n');

		for (const line of envLines) {
			const trimmedLine = line.trim();

			if (trimmedLine && !trimmedLine.startsWith('#')) {
				const [key, ...values] = trimmedLine.split('=');
				const value = values.join('=').trim().replace(/["']/g, '');
				const formattedKey = key.trim().replace(/["']/g, '');
				process.env[formattedKey] = value;
			}
		}
	}
	catch (error) {
		console.error('Error loading .env file:', error);
	}
}

module.exports = { loadEnv };