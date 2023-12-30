const Component = require('../../Structures/Core/Component');
const db = require('../../Database/Schemas/vc-role');
const { PermissionsBitField } = require('discord.js');

module.exports = new Component({
	name: 'voiceStateUpdate',
	/**
     * @param {Rolex} client
     */
	run: async (client, oldState, newState) => {
		const member = newState.member;
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

		if (oldState.channel === null && newState.channel !== null) {
			const data = await db.findOne({
				Guild: newState.guild.id,
			});

			if (!data) return;

			if (member?.user?.bot) {
				if (data.botrole.length === 0) return;
				for (let i = 0; i < data.botrole.length; i++) {
					if (!member?.guild.roles.cache.get(data.botrole[i])) continue;
					if (member?.roles.cache.has(data.botrole[i])) continue;
					if (member?.guild.roles.cache.get(data.botrole[i]).position >= member?.guild.members.me.roles.highest.position) continue;
					if (dangerousPermissions.some((p) => member?.guild.roles.cache.get(data.botrole[i]).permissions.has(p))) continue;
					await member?.roles.add(data.botrole[i]);
				}
			}
			else {
				if (data.humanrole.length === 0) return;
				for (let i = 0; i < data.humanrole.length; i++) {
					if (!member?.guild.roles.cache.get(data.humanrole[i])) continue;
					if (member?.roles.cache.has(data.humanrole[i])) continue;
					if (member?.guild.roles.cache.get(data.humanrole[i]).position >= member?.guild.members.me.roles.highest.position) continue;
					if (dangerousPermissions.some((p) => member?.guild.roles.cache.get(data.humanrole[i]).permissions.has(p))) continue;
					await member?.roles.add(data.humanrole[i]);
				}
			}
		}
		else if (oldState.channel !== null && newState.channel === null) {
			const data = await db.findOne({
				Guild: newState.guild.id,
			});
			if (!data) return;
			if (!member?.guild.members.cache.has(member?.id)) return;

			if (member?.user?.bot) {
				if (data.botrole.length === 0) return;
				for (let i = 0; i < data.botrole.length; i++) {
					if (!member?.guild.roles.cache.get(data.botrole[i])) continue;
					if (!member?.roles.cache.has(data.botrole[i])) continue;
					if (member?.guild.roles.cache.get(data.botrole[i]).position >= member?.guild.members.me.roles.highest.position) continue;
					if (dangerousPermissions.some((p) => member?.guild.roles.cache.get(data.botrole[i]).permissions.has(p))) continue;
					await member?.roles.remove(data.botrole[i]);
				}
			}
			else {
				if (data.humanrole.length === 0) return;
				for (let i = 0; i < data.humanrole.length; i++) {
					if (!member?.guild.roles.cache.get(data.humanrole[i])) continue;
					if (!member?.roles.cache.has(data.humanrole[i])) continue;
					if (member?.guild.roles.cache.get(data.humanrole[i]).position >= member?.guild.members.me.roles.highest.position) continue;
					if (dangerousPermissions.some((p) => member?.guild.roles.cache.get(data.humanrole[i]).permissions.has(p))) continue;
					await member?.roles.remove(data.humanrole[i]);
				}
			}
		}
	},
});