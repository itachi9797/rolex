function tickCheck(array, maxChars) {
	let value = '';

	if (array.length === 0) {
		value = null;
	} else {
		const successEmoji = process.env.SUCCESS_EMOJI || '✅';
		value = `${successEmoji}: ` + array.map(element => {
			return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase().replace(/_/g, ' ');
		}).join(`\n${successEmoji}: `);

		if (value.length > maxChars) {
			value = value.replace(new RegExp(`${successEmoji}`, 'g'), '✅');
			if (value.length > maxChars) {
				const truncatedFeatures = value.slice(0, maxChars);
				const lastLineBreakIndex = truncatedFeatures.lastIndexOf('\n');
				value = truncatedFeatures.substring(0, lastLineBreakIndex) + ' (And More...)';
			}
		}
	}
	return value;
}

module.exports = { tickCheck };