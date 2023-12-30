const Component = require('../../Structures/Core/Component');
const db = require('../../Database/Schemas/autoroles');
const { PermissionsBitField } = require('discord.js');

module.exports = new Component({
	name: 'guildMemberAdd',
	/**
     * @param {Rolex} client
     */
	run: async (client, member) => {
		if (!member?.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return;

		const dangerousPermissions = [
			PermissionsBitField.Flags.Administrator,
			PermissionsBitField.Flags.BanMembers,
			PermissionsBitField.Flags.KickMembers,
			PermissionsBitField.Flags.ManageChannels,
			PermissionsBitField.Flags.ManageGuildExpressions,
			PermissionsBitField.Flags.ManageGuild,
			PermissionsBitField.Flags.ManageMessages,
			PermissionsBitField.Flags.ManageNicknames,
			PermissionsBitField.Flags.ManageRoles,
			PermissionsBitField.Flags.ManageWebhooks,
			PermissionsBitField.Flags.ManageThreads,
			PermissionsBitField.Flags.ManageEvents,
			PermissionsBitField.Flags.ModerateMembers,
			PermissionsBitField.Flags.MentionEveryone,
			PermissionsBitField.Flags.MoveMembers,
			PermissionsBitField.Flags.MuteMembers,
			PermissionsBitField.Flags.DeafenMembers,
			PermissionsBitField.Flags.ViewAuditLog,
			PermissionsBitField.Flags.ViewGuildInsights,
		];

		if (!member?.user?.bot && !member?.pending) {
			await db.findOne({
				Guild: member?.guild.id,
			}).then(async (data) => {
				if (data) {
					for (const role of data.humans) {
						const roleToAdd = member?.guild.roles.cache.get(role);
						if (!roleToAdd) continue;
						if (member?.roles.cache.has(roleToAdd.id)) continue;
						if (roleToAdd.position >= member?.guild.members.me.roles.highest.position) continue;
						if (dangerousPermissions.some((p) => roleToAdd.permissions.has(p))) continue;
						await member?.roles.add(roleToAdd);
					}
				}
				else return;
			});
		}
		if (member?.user?.bot) {
			await db.findOne({
				Guild: member?.guild.id,
			}).then(async (data) => {
				if (data) {
					for (const role of data.bots) {
						const roleToAdd = member?.guild.roles.cache.get(role);
						if (!roleToAdd) continue;
						if (member?.roles.cache.has(roleToAdd.id)) continue;
						if (roleToAdd.position >= member?.guild.members.me.roles.highest.position) continue;
						if (dangerousPermissions.some((p) => roleToAdd.permissions.has(p))) continue;
						await member?.roles.add(roleToAdd);
					}
				}
				else return;
			});
		}
	},
});