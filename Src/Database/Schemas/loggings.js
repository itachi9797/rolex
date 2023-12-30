const { Schema, model } = require('mongoose');

const logs = new Schema({
	channel: {
		type: String,
		required: false,
	},
	member: {
		type: String,
		required: false,
	},
	mod: {
		type: String,
		required: false,
	},
	message: {
		type: String,
		required: false,
	},
	role: {
		type: String,
		required: false,
	},
	server: {
		type: String,
		required: false,
	},
	Guild: {
		type: String,
		required: true,
	},
});

module.exports = model('loggings', logs);