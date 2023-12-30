const Component = require('../../Structures/Core/Component');
const db = require('../../Database/Schemas/loggings');
const { PermissionsBitField } = require('discord.js');

module.exports = new Component({
	name: 'messageDelete',
	/**
     * @param {Rolex} client
     * @param {Discord.Message} message
     */
	run: async (client, message) => {
		db.findOne({
			Guild: message.guild.id,
		}).then(async (data) => {

			if (data) {
				const msg_log = message.guild.channels.cache.get(data.message);
				if (!msg_log) return;
				if (message.webhookId !== null) return;
				if (message.author?.bot) return;

				if (message.author?.id === undefined) return;

				if (!message.content && !message.attachments) return;

				if (!msg_log.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !msg_log.permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

				if (message.content && message.attachments) {
					await msg_log.send({
						embeds: [{
							author: {
								name: message.author?.globalName !== null ? message.author?.globalName : message.author?.username,
								icon_url: message.author?.displayAvatarURL({ size: 2048 }),
							},
							description: `🚮 Message sent by <@${message.author?.id}> was deleted in <#${message.channel?.id}>`,
							fields: [{
								name: 'Content',
								value: message.content.length > 1000 ? message.content.slice(0, 1000) + '.....' : message.content,
							}],
							image: {
								url: message.attachments.map(e => e.url)[0],
							},
							color: 15158332,
							timestamp: new Date(Date.now()).toISOString(),
							footer: {
								text: `Powered by ${client.user?.globalName || client.user?.username}`,
								icon_url: client.user?.displayAvatarURL({ size: 2048 }),
							},
						}],
					}).catch();
				}
				else if (message.content) {
					await msg_log.send({
						embeds: [{
							author: {
								name: message.author?.username,
								icon_url: message.author?.displayAvatarURL({ size: 2048 }),
							},
							description: `🚮 Message sent by <@${message.author?.id}> was deleted in <#${message.channel?.id}>`,
							fields: [{
								name: 'Content',
								value: message.content,
							}],
							color: 15158332,
							timestamp: new Date(Date.now()).toISOString(),
							footer: {
								text: `Powered by ${client.user?.globalName || client.user?.username}`,
								icon_url: client.user?.displayAvatarURL({ size: 2048 }),
							},
						}],
					}).catch();
				}
				else if (message.attachments) {
					await msg_log.send({
						embeds: [{
							author: {
								name: message.author?.username,
								icon_url: message.author?.displayAvatarURL({ size: 2048 }),
							},
							description: `🚮 Message sent by <@${message.author?.id}> was deleted in <#${message.channel?.id}>`,
							image: {
								url: message.attachments.map(e => e.url)[0],
							},
							color: 15158332,
							timestamp: new Date(Date.now()).toISOString(),
							footer: {
								text: `Powered by ${client.user?.globalName || client.user?.username}`,
								icon_url: client.user?.displayAvatarURL({ size: 2048 }),
							},
						}],
					}).catch();
				}
				else return;
			}
			else return;
		});
	},
});