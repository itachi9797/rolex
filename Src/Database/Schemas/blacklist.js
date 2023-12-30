const { Schema, model } = require('mongoose');

const blacklist = new Schema({
	User: {
		type: String,
		required: false,
	},
	reason: {
		type: String,
		required: false,
	},
});

module.exports = model('Blacklist', blacklist);