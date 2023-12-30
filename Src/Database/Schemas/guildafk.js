const { Schema, model } = require('mongoose');

const guildafk = new Schema({
	Guild: {
		type: String,
		required: true,
	},
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

module.exports = model('Guildafk', guildafk);