const { Schema, model } = require('mongoose');

const noprefix = new Schema({
	User: {
		type: String,
		required: true,
	},
});

module.exports = model('Noprefix', noprefix);