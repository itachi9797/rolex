const { Schema, model } = require('mongoose');

const globalafk = new Schema({
	User: {
		type: String,
		required: true,
	},
	reason: {
		type: String,
		required: false,
	},
	timestamp: {
		type: Number,
		required: true,
	},
});

module.exports = model('Globalafk', globalafk);