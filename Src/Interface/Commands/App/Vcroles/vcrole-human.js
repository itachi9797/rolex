const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Schema = require('../../../../Database/Schemas/vc-role');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'vcrole-human',
	description: 'Add or remove a role from the list of roles given to humans when they join a VC.',
	usage: 'vcrole-human <add | remove> <role>',
	userPermissions: ['Manage Server'],
	options: [{
		name: 'add',
		description: 'Add a role to the list of roles that are given to humans when they join a VC.',
		type: 1,
		options: [{
			name: 'role',
			description: 'The role to add to the list of roles that are given to humans when they join a VC.',
			type: 8,
			required: true,
		}],
	},
	{
		name: 'remove',
		description: 'Remove a role from the list of roles that are given to humans when they join a VC.',
		type: 1,
		options: [{
			name: 'role',
			description: 'The role to remove from the list of roles that are given to humans when they join a VC.',
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
		if (!ctx.interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Server\` permissions!`,
				ephemeral: true,
			});
		}
		if (ctx.interaction.member?.id !== ctx.interaction.guild.ownerId && ctx.interaction.member?.roles.highest.position <= ctx.interaction.guild.members.me.roles.highest.position && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You must be above me to use this command.`,
				ephemeral: true,
			});
		}
		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {
			if (!data) {
				data = new Schema({
					Guild: ctx.interaction.guild.id,
					humanrole: [],
					botrole: [],
				});
			}
			if (ctx.interaction.options.getSubcommand() === 'add') {
				const role = ctx.interaction.options.getRole('role');
				if (role.id === ctx.interaction.guild.roles.everyone.id) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | You can't add the \`@everyone\` role to the autoroles list.`,
						ephemeral: true,
					});
				}
				if (data.humanrole.includes(role.id)) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | That role is already in the list of roles that are given to humans when they join a VC!`,
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
						content: `${process.env.FAILURE_EMOJI} | You cannot set this role as a vcrole as it has moderation permissions!`,
						ephemeral: true,
					});
				}
				if (data.humanrole.length >= 10) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | You can't add more than 10 roles to the list of roles that are given to humans when they join a VC!`,
						ephemeral: true,
					});
				}
				data.humanrole.push(role.id);
				await data.save();
				await ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully added the role to the list of roles that are given to humans when they join a VC!`,
				});
			}
			else if (ctx.interaction.options.getSubcommand() === 'remove') {
				const role = ctx.interaction.options.getRole('role');
				if (!data.humanrole.includes(role.id)) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | That role is not in the list of roles that are given to humans when they join a VC!`,
						ephemeral: true,
					});
				}
				data.humanrole = data.humanrole.filter(r => r !== role.id);
				await data.save();
				await ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully removed the role from the list of roles that are given to humans when they join a VC!`,
				});
			}
		});
	},
});