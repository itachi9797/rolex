const { Schema, model } = require('mongoose');

const badge = new Schema({
	User: {
		type: String,
		required: false,
	},
	Badges: {
		type: Array,
		required: false,
	},
});

module.exports = model('Badges', badge);