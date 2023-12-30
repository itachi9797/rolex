const Component = require('../../Structures/Core/Component');
const db = require('../../Database/Schemas/loggings');
const { PermissionsBitField } = require('discord.js');

module.exports = new Component({
	name: 'guildMemberRemove',
	/**
     * @param {Rolex} client
     */
	run: async (client, member) => {

		db.findOne({
			Guild: member?.guild.id,
		}).then(async (data) => {

			if (data) {

				const leave_logs = member?.guild.channels.cache.get(data.member);
				if (!leave_logs) return;

				if (!leave_logs.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !leave_logs.permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

				await leave_logs.send({
					embeds: [{
						author: {
							name: `${member?.user?.globalName || member?.user?.username}`,
							icon_url: `${member?.user?.displayAvatarURL({ size: 2048 })}`,
						},
						description: `**A member is no longer in the server**\n\n ${member?.user?.globalName || member?.user?.username} (ID: ${member?.user?.id})\n👤 Account created at <t:${Math.floor(member?.user?.createdTimestamp / 1000)}:F>`,
						color: 15158332,
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