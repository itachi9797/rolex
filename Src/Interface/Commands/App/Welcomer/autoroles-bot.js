const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/autoroles');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'autoroles-bot',
	description: 'Add or remove a role from the autoroles list.',
	usage: 'autoroles-bots <add/remove> <role>',
	userPermissions: ['Manage Server'],
	options: [{
		name: 'add',
		type: 1,
		description: 'Add a role to the autoroles list.',
		options: [{
			name: 'role',
			description: 'The role to add to the autoroles list.',
			type: 8,
			required: true,
		}],
	},
	{
		name: 'remove',
		type: 1,
		description: 'Remove a role from the autoroles list.',
		options: [{
			name: 'role',
			description: 'The role to remove from the autoroles list.',
			type: 8,
			required: true,
		}],
	},
	],
	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const role = ctx.interaction.options.getRole('role');
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

		if (!ctx.interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | I don't have the \`Manage Roles\` permission.`,
				ephemeral: true,
			});
		}
		if (role.position >= ctx.interaction.guild.members.me.roles.highest.position) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | I can't add that role to members because it's higher than my highest role.`,
				ephemeral: true,
			});
		}
		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {

			if (ctx.interaction.options.getSubcommand() === 'add') {
				if (role.id === ctx.interaction.guild.roles.everyone.id) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | You can't add the \`@everyone\` role to the autoroles list.`,
						ephemeral: true,
					});
				}

				if (!data) {
					data = new Schema({
						Guild: ctx.interaction.guild.id,
						bots: [],
					});
				}
				if (data.bots.includes(role.id)) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | That role is already in the autoroles list.`,
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
						content: `${process.env.FAILURE_EMOJI} | You cannot set this role as an autorole as it has moderation permissions!`,
						ephemeral: true,
					});
				}

				if (role.managed) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | You cannot set this role as an autorole as it is managed by an integration!`,
						ephemeral: true,
					});
				}

				if (data.bots.length >= 10) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | You can't add more than 10 roles to the autoroles list.`,
						ephemeral: true,
					});
				}
				data.bots.push(role.id);
				await data.save();
				ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Added \`${role.name}\` to the autoroles list.`,
				});
			}
			else if (ctx.interaction.options.getSubcommand() === 'remove') {
				if (!data) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | That role isn't in the autoroles list.`,
						ephemeral: true,
					});
				}
				if (!data.bots.includes(role.id)) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | That role isn't in the autoroles list.`,
						ephemeral: true,
					});
				}
				if (data.humans.length === 0 && data.bots.length === 1) {
					await data.deleteOne();
					return ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Removed \`${role.name}\` from the autoroles list.`,
					});
				}
				const index = data.bots.indexOf(role.id);
				data.bots.splice(index, 1);
				await data.save();
				ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Removed \`${role.name}\` from the autoroles list.`,
				});
			}
			else {
				ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | That subcommand doesn't exist.`,
					ephemeral: true,
				});
			}
		});
	},
});