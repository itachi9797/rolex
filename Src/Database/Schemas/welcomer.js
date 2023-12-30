const { Schema, model } = require('mongoose');

const greet = new Schema({
	content: {
		type: String,
		required: false,
	},
	embed: {
		type: Boolean,
		required: true,
		default: false,
	},
	title: {
		type: String,
		required: false,
	},
	color: {
		type: String,
		required: false,
	},
	image: {
		type: String,
		required: false,
	},
	thumbnail: {
		type: String,
		required: false,
	},
	description: {
		type: String,
		required: false,
	},
	footer_text: {
		type: String,
		required: false,
	},
	footer_icon_url: {
		type: String,
		required: false,
	},
	author_name: {
		type: String,
		required: false,
	},
	author_icon_url: {
		type: String,
		required: false,
	},
	channel: {
		type: String,
		required: true,
	},
	screening: {
		type: Boolean,
		required: false,
		default: false,
	},
	Guild: {
		type: String,
		required: true,
	},
});

module.exports = model('welcomer', greet);