const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'roleall',
	description: 'Gives a role to all members of the server',
	usage: 'roleall <humans | bots> <role>',
	userPermissions: ['Manage Roles'],
	options: [{
		name: 'humans',
		description: 'Gives a role to all humans in the server',
		type: 1,
		options: [{
			name: 'role',
			description: 'The role to give to all members',
			type: 8,
			required: true,
		}],
	},
	{
		name: 'bots',
		description: 'Gives a role to all bots in the server',
		type: 1,
		options: [{
			name: 'role',
			description: 'The role to give to all members',
			type: 8,
			required: true,
		}],
	},
	],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.interaction.guild.id,
		});
		if (!ctx.interaction.member?.permissions.has(PermissionsBitField.Flags.ManageRoles) && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Roles\` permissions!`,
				ephemeral: true,
			});
		}
		if (ctx.interaction.member?.id !== ctx.interaction.guild.ownerId && ctx.interaction.member?.roles.highest.position <= ctx.interaction.guild.members.me.roles.highest.position && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You must be above me to use this command.`,
				ephemeral: true,
			});
		}
		const role = ctx.interaction.options.getRole('role');
		if (ctx.interaction.guild.ownerId !== ctx.interaction.member?.id && role.position >= ctx.interaction.member?.roles.highest.position && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You cannot give that role to members as it is higher than your highest role!`,
				ephemeral: true,
			});
		}
		if (role.id === ctx.interaction.guild.roles.everyone.id) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You cannot give that role to members as it is the \`@everyone\` role!`,
				ephemeral: true,
			});
		}

		if (role.managed) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You cannot give that role to members as it is managed by an integration!`,
				ephemeral: true,
			});
		}

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

		if (dangerousPermissions.some((p) => role.permissions.has(p))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You cannot give that role to members as it has moderation permissions!`,
				ephemeral: true,
			});
		}
		if (!ctx.interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | I do not have \`Manage Roles\` permissions!`,
				ephemeral: true,
			});
		}
		if (role.position >= ctx.interaction.guild.members.me.roles.highest.position) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | I cannot give that role to members as it is higher than my highest role!`,
				ephemeral: true,
			});
		}

		const members = ctx.interaction.options.getSubcommand() === 'humans' ? ctx.interaction.guild.members.cache.filter((m) => !m.user?.bot) : ctx.interaction.guild.members.cache.filter((m) => m.user?.bot);
		await ctx.interaction.reply({
			content: `Giving \`${role.name}\` role to all ${ctx.interaction.options.getSubcommand()}...`,
		});
		const membersWithoutRole = members.filter((m) => !m.roles.cache.has(role.id));
		const promises = [];
		membersWithoutRole.forEach((m) => promises.push(m.roles.add(role)));
		for (const promise of promises) {
			if (!ctx.interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
				return ctx.interaction.editReply({
					content: `${process.env.FAILURE_EMOJI} | I can no longer give that role to members as I do not have \`Manage Roles\` permissions!`,
				});
			}
			if (role.position >= ctx.interaction.guild.members.me.roles.highest.position) {
				return ctx.interaction.editReply({
					content: `${process.env.FAILURE_EMOJI} | I can no longer give that role to members as it is higher than my highest role!`,
				});
			}
			if (dangerousPermissions.some((p) => role.permissions.has(p))) {
				return ctx.interaction.editReply({
					content: `${process.env.FAILURE_EMOJI} | I will no longer give that role to members as it has moderation permissions!`,
				});
			}
			await promise;
		}

		try {
			await ctx.interaction.editReply({
				content: `${process.env.SUCCESS_EMOJI} | Gave \`${role.name}\` role to all ${ctx.interaction.options.getSubcommand()}`,
			});
		}
		catch (e) {
			return;
		}
	},
});