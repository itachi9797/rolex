const { Schema, model } = require('mongoose');

const GuildPrefix = new Schema({
	prefix: {
		type: String,
		required: false,
	},
	Guild: {
		type: String,
		required: true,
	},
});

module.exports = model('guildprefix', GuildPrefix);