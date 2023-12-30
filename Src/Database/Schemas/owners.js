const { Schema, model } = require('mongoose');

const owners = new Schema({
	Guild: {
		type: String,
		required: true,
	},
	additional_owners: {
		type: Array,
		required: true,
	},
});

module.exports = model('Owners', owners);