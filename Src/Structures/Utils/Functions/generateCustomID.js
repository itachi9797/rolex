function generateCustomID() {
	const length = 9;
	const charset = 'rngY6D2mcUWfVXShsAMbpSbRRxmPnDsLn75avsBd44swqxTCbAjBUCaAaEPXZd7jT9Hvz53B7uMvsjny7fDkqmb8NR';
	let retVal = '';
	for (let i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

module.exports = { generateCustomID };