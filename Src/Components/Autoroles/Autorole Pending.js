const Component = require('../../Structures/Core/Component');
const db = require('../../Database/Schemas/autoroles');
const { PermissionsBitField } = require('discord.js');

module.exports = new Component({
	name: 'guildMemberUpdate',
	/**
     * @param {Rolex} client
     */
	run: async (client, oldMember, newMember) => {
		if (oldMember?.pending === newMember?.pending) return;
		if (newMember?.user?.bot) return;
		if (!newMember?.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return;
		if (oldMember?.pending && !newMember?.pending) {

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
			await db.findOne({
				Guild: newMember?.guild.id,
			}).then(async (data) => {
				if (data) {
					for (const role of data.humans) {
						const roleToAdd = newMember?.guild.roles.cache.get(role);
						if (!roleToAdd) continue;
						if (newMember?.roles.cache.has(roleToAdd.id)) continue;
						if (roleToAdd.position >= newMember?.guild.members.me.roles.highest.position) continue;
						if (dangerousPermissions.some((p) => roleToAdd.permissions.has(p))) continue;
						await newMember?.roles.add(roleToAdd);
					}
				}
				else return;
			});
		}
		else return;
	},
});