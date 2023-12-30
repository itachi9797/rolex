const Component = require('../../Structures/Core/Component');
const db = require('../../Database/Schemas/loggings');
const { PermissionsBitField } = require('discord.js');

module.exports = new Component({
	name: 'guildMemberAdd',
	/**
     * @param {Rolex} client
     */
	run: async (client, member) => {

		db.findOne({
			Guild: member?.guild.id,
		}).then(async (data) => {

			if (data) {

				const join_log = member?.guild.channels.cache.get(data.member);
				if (!join_log) return;

				if (!join_log.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !join_log.permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

				await join_log.send({
					embeds: [{
						author: {
							name: member?.user?.globalName || member?.user?.username,
							icon_url: `${member?.user?.displayAvatarURL({ size: 2048 })}`,
						},
						description: `**A member has joined the server**\n\n ${member?.user?.globalName || member?.user?.username} (ID: ${member?.user?.id})\n👤 Account created at <t:${Math.floor(member?.user?.createdTimestamp / 1000)}:F>`,
						color: 3066993,
						thumbnail: {
							url: member?.user?.displayAvatarURL({ size: 2048 }),
						},
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