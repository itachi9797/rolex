const Component = require('../../Structures/Core/Component');
const db = require('../../Database/Schemas/antinuke');
const Owners = require('../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new Component({
	name: 'messageCreate',
	/**
     * @param {Rolex} client
     */
	run: async (client, message) => {

		if (message.author?.id === message.guild.ownerId) return;

		if (message.mentions.everyone !== true) return;

		if (message.author?.id === client.user?.id) return;

		const owner_data = await Owners.findOne({
			Guild: message.guild.id,
		});

		if (owner_data && owner_data.additional_owners.includes(message.author?.id)) return;

		await db.findOne({
			Guild: message.guild.id,
		}).then(async (data) => {
			if (data) {
				if (data.whitelist.includes(message.author?.id)) return;

				let author;
				if (message.member) {
					author = message.member;
				}
				else {
					try {
						author = await message.guild.members.fetch(message.author?.id);
					}
					catch {
						author = undefined;
					}
				}
				switch (data.antiEveryone) {
					case true:
						if (message.webhookId !== null) {
							if (message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) {
								try {
									(await message.guild.fetchWebhooks()).filter(e => e.id === message.webhookId).first().delete();
								}
								catch {
									undefined;
								}
							}
							if (message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
								try {
									message.delete();
									return;
								}
								catch {
									return;
								}
							}
						}

						switch (data.punishment.toLowerCase()) {
							case 'ban':
								if (author?.bannable) {
									try {
										await author?.ban({
											reason: 'Anti Everyone/here | Not Whitelisted',
										});
									}
									catch {
										return;
									}
								}

								if (message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
									try {
										message.delete();
									}
									catch {
										return;
									}
								}
								break;
							case 'kick':
								if (author?.kickable) {
									try {
										await author?.kick('Anti Everyone/here | Not Whitelisted');
									}
									catch {
										return;
									}
								}

								if (message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
									try {
										message.delete();
									}
									catch {
										return;
									}
								}
								break;
						}
						break;
					case false:
						return;
					default:
						return;
				}
			}
			else return;
		});
	},
});