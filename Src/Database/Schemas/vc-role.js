const { Schema, model } = require('mongoose');

const vcrole = new Schema({
	humanrole: {
		type: Array,
		required: true,
	},
	botrole: {
		type: Array,
		required: true,
	},
	Guild: {
		type: String,
		required: true,
	},
});

module.exports = model('vc-role', vcrole);