const https = require('https');

async function httpRequest(options) {
	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			let responseData = '';

			res.on('data', (chunk) => {
				responseData += chunk;
			});

			res.on('end', () => {
				resolve(responseData);
			});
		});

		req.on('error', (error) => {
			reject(error);
		});

		if (options.data) {
			req.write(JSON.stringify(options.data));
		}
		req.end();
	});
}

module.exports = { httpRequest };