const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/autoroles');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'autoroles-human',
	description: 'Add or remove a role from the autoroles list.',
	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const subCommand = ctx.message.content.split(' ').slice(1).shift()?.toLowerCase();

		if (!subCommand) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Please specify a valid option! Available options: \`add\`, \`remove\`.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const role = ctx.message.mentions.roles.first() || ctx.message.guild.roles.cache.get(ctx.message.content.split(' ').slice(2)[0]) || ctx.message.guild.roles.cache.find(r => r.name.toLowerCase() === ctx.message.content.split(' ').slice(2).join(' ').toLowerCase()) || ctx.message.guild.roles.cache.find(r => r.name.toLowerCase().includes(ctx.message.content.split(' ').slice(2).join(' ').toLowerCase()));

		if (!role) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must provide a valid role!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});
		if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Server\` permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (ctx.message.member?.id !== ctx.message.guild.ownerId && ctx.message.member?.roles.highest.position <= ctx.message.guild.members.me.roles.highest.position && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must be above me to use this command.`,

			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}
		if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I don't have the \`Manage Roles\` permission.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}
		if (role.position >= ctx.message.guild.members.me.roles.highest.position) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I can't add that role to members because it's higher than my highest role.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}
		if (subCommand === 'add') {
			if (role.id === ctx.message.guild.roles.everyone.id) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You can't add the \`@everyone\` role to the autoroles list.`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
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
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You cannot set this role as an autorole as it has moderation permissions!`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			if (role.managed) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You cannot set this role as an autorole as it is managed by an integration!`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
			await Schema.findOne({
				Guild: ctx.message.guild.id,
			}).then(async (data) => {
				if (data) {
					if (data.humans.includes(role.id)) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | That role is already in the autoroles list.`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					if (data.humans.length >= 10) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | You can't add more than 10 roles to the autoroles list.`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					data.humans.push(role.id);
					await data.save();
					ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | Successfully added \`${role.name}\` to the autoroles list.`,
					});
				}
				else {
					const newData = new Schema({
						Guild: ctx.message.guild.id,
						humans: [role.id],
					});
					newData.save();
					ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | Successfully added \`${role.name}\` to the autoroles list.`,
					});
				}
			});
		}
		else if (subCommand === 'remove') {
			await Schema.findOne({
				Guild: ctx.message.guild.id,
			}).then(async (data) => {

				if (data) {
					if (!data.humans.includes(role.id)) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | That role is not in the autoroles list.`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					if (data.bots.length === 0 && data.humans.length === 1) {
						await data.deleteOne();
						return ctx.message.reply({
							content: `${process.env.SUCCESS_EMOJI} | Successfully removed \`${role.name}\` from the autoroles list.`,
						});
					}
					const index = data.humans.indexOf(role.id);
					data.humans.splice(index, 1);
					await data.save();
					ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | Successfully removed \`${role.name}\` from the autoroles list.`,
					});
				}
				else {
					ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | There is no autoroles configuration.`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
			});
		}
		else {
			ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Please specify a valid option! Available options: \`add\`, \`remove\``,

			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}
	},
});