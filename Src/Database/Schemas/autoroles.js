const { Schema, model } = require('mongoose');

const autorole = new Schema({
	humans: {
		type: Array,
		required: false,
	},
	bots: {
		type: Array,
		required: false,
	},
	Guild: {
		type: String,
		required: true,
	},
});

module.exports = model('autoroles', autorole);