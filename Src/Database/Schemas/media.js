const { Schema, model } = require('mongoose');

const media = new Schema({
	Guild: {
		type: String,
		required: true,
	},
	channel: {
		type: Array,
		required: false,
	},
});

module.exports = model('pictures', media);