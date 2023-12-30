const Component = require('../../Structures/Core/Component');
const db = require('../../Database/Schemas/media');
const { PermissionsBitField } = require('discord.js');

module.exports = new Component({
	name: 'messageCreate',
	/**
     *
     * @param {Rolex} client
     * @param {Discord.Message} message
     */

	run: async (client, message) => {
		if (message.author?.bot) return;
		await db.findOne({
			Guild: message.guild.id,
		}).then(async (data) => {
			if (!data) return;
			if (data.channel?.includes(message.channel?.id)) {
				if (message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild)) return;
				if (message.attachments.size === 0) {
					message.delete();
					message.channel?.send({
						content: 'You can only send images in this channel!',
					}).then(msg => {
						setTimeout(() => {
							msg.delete();
						}, 15000);
					});
				}
			}
		});

	},
});