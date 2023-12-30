const { Schema, model } = require('mongoose');

const Ignore = new Schema({
	channel: {
		type: Array,
		required: false,
	},
	Guild: {
		type: String,
		required: true,
	},
});

module.exports = model('ignore', Ignore);