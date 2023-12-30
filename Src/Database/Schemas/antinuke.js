const { Schema, model } = require('mongoose');

const antinuke = new Schema({
	antiban: {
		type: Boolean,
		required: false,
	},
	antibot: {
		type: Boolean,
		required: false,
	},
	antikick: {
		type: Boolean,
		required: false,
	},
	antiChannelCreate: {
		type: Boolean,
		required: false,
	},
	antiChannelDelete: {
		type: Boolean,
		required: false,
	},
	antiChannelUpdate: {
		type: Boolean,
		required: false,
	},
	antiRoleCreate: {
		type: Boolean,
		required: false,
	},
	antiRoleDelete: {
		type: Boolean,
		required: false,
	},
	antiRoleUpdate: {
		type: Boolean,
		required: false,
	},
	antiserver: {
		type: Boolean,
		required: false,
	},
	antiwebhookCreate: {
		type: Boolean,
		required: false,
	},
	antiwebhookDelete: {
		type: Boolean,
		required: false,
	},
	antiwebhookUpdate: {
		type: Boolean,
		required: false,
	},
	antiprune: {
		type: Boolean,
		required: false,
	},
	antiVanitySteal: {
		type: Boolean,
		required: false,
	},
	antimember: {
		type: Boolean,
		required: false,
	},
	antiunban: {
		type: Boolean,
		required: false,
	},
	antiEmojiDelete: {
		type: Boolean,
		required: false,
	},
	antiInviteDelete: {
		type: Boolean,
		required: false,
	},
	antiEveryone: {
		type: Boolean,
		required: false,
	},
	punishment: {
		type: String,
		required: false,
		default: 'Ban',
	},
	whitelist: {
		type: Array,
		required: false,
	},
	Guild: {
		type: String,
		required: true,
	},
});

module.exports = model('Antinuke', antinuke);