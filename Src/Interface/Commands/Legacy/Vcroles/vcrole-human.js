const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Schema = require('../../../../Database/Schemas/vc-role');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'vcrole-human',
	description: 'Add or remove a role from the list of roles given to humans when they join a VC.',
	aliases: ['vc-human'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
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
		await Schema.findOne({
			Guild: ctx.message.guild.id,
		}).then(async (data) => {
			if (!data) {
				data = new Schema({
					Guild: ctx.message.guild.id,
					humanrole: [],
					botrole: [],
				});
			}

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

			if (subCommand === 'add') {
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

				if (role.id === ctx.message.guild.roles.everyone.id) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You can't add the \`@everyone\` role to the autoroles list.`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
				if (data.humanrole.includes(role.id)) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | That role is already in the list of roles that are given to humans when they join a VC!`,
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
						content: `${process.env.FAILURE_EMOJI} | You cannot set this role as a vcrole as it has moderation permissions!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				if (data.humanrole.length >= 10) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You can't add more than 10 roles to the list of roles that are given to humans when they join a VC!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
				data.humanrole.push(role.id);
				await data.save();
				await ctx.message.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully added the role to the list of roles that are given to humans when they join a VC!`,
				});
			}
			else if (subCommand === 'remove') {
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

				if (!data.humanrole.includes(role.id)) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | That role is not in the list of roles that are given to humans when they join a VC!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
				data.humanrole = data.humanrole.filter(r => r !== role.id);
				await data.save();
				await ctx.message.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully removed the role from the list of roles that are given to humans when they join a VC!`,
				});
			}
			else {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | Please specify a valid option! Available options: \`add\`, \`remove\`.`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		});
	},

});