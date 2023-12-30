const Component = require('../../Structures/Core/Component');
const db = require('../../Database/Schemas/loggings');
const { PermissionsBitField } = require('discord.js');

module.exports = new Component({
	name: 'messageUpdate',
	/**
     * @param {Rolex} client
     * @param {Discord.Message} message
     */
	run: async (client, oldMessage, newMessage) => {

		db.findOne({
			Guild: newMessage.guild.id,
		}).then(async (data) => {

			if (data) {
				const msg_log = newMessage.guild.channels.cache.get(data.message);
				if (!msg_log) return;
				if (!msg_log.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !msg_log.permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;
				if (oldMessage.author === undefined) return;
				if (!oldMessage.content) return;
				if (oldMessage.content === newMessage.content) return;
				if (oldMessage.webhookId !== null) return;
				if (oldMessage.author?.bot) return;
				if (!newMessage.content) return;
				await msg_log.send({
					embeds: [{
						author: {
							name: newMessage.author?.globalName !== null ? newMessage.author?.globalName : newMessage.author?.username,
							icon_url: newMessage.author?.displayAvatarURL({ size: 2048 }),
						},
						description: `📝 Message sent by <@${newMessage.author?.id}> was edited in <#${newMessage.channel?.id}> [Jump to message](${newMessage.url})`,
						fields: [{
							name: 'Old Content',
							value: `\`\`\`${oldMessage.content.length > 1000 ? oldMessage.content.slice(0, 1000) + '.....' : oldMessage.content}\`\`\``,
						},
						{
							name: 'New Content',
							value: `\`\`\`${newMessage.content.length > 1000 ? newMessage.content.slice(0, 1000) + '.....' : newMessage.content}\`\`\``,
						},
						],
						color: 16705372,
						timestamp: new Date(Date.now()).toISOString(),
						footer: {
							text: `Powered by ${client.user?.globalName || client.user?.username}`,
							icon_url: client.user?.displayAvatarURL({ size: 2048 }),
						},
					}],
				}).catch();

			}
			else return;
		});
	},
});