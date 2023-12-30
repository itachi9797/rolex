const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'role',
	description: 'Gives a role to a member',
	usage: 'role <member> <role>',
	userPermissions: ['Manage Roles'],
	options: [{
		name: 'member',
		description: 'The member you want to give a role to!',
		required: true,
		type: 6,
	},
	{
		name: 'role',
		description: 'The role you want to give to the member!',
		required: true,
		type: 8,
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

		const member = ctx.interaction.options.getMember('member');
		const role = ctx.interaction.options.getRole('role');
		if (ctx.interaction.guild.ownerId !== ctx.interaction.member?.id && role.position >= ctx.interaction.member?.roles.highest.position && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You cannot give/remove that role to members as it is higher than your highest role!`,
				ephemeral: true,
			});
		}
		if (role.id === ctx.interaction.guild.roles.everyone.id) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You cannot give/remove that role to members as it is the \`@everyone\` role!`,
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

		if (member?.roles.cache.has(role.id)) {
			await member?.roles.remove(role);
			return ctx.interaction.reply({
				content: `${process.env.SUCCESS_EMOJI} | Succesfully removed \`${role.name}\` from ${member?.user?.globalName || member?.user?.username}!`,
			});
		}
		else {
			await member?.roles.add(role);
			return ctx.interaction.reply({
				content: `${process.env.SUCCESS_EMOJI} | Succesfully gave ${member?.user?.globalName || member?.user?.username} the ${role.name} role!`,
			});
		}

	},
});