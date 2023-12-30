const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'roleall',
	description: 'Gives a role to all members of the server',

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});
		if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.ManageRoles) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Roles\` permissions!`,
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

		const subcommand = ctx.message.content.split(' ').slice(1).shift()?.toLowerCase();

		if (!['humans', 'bots'].includes(subcommand)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must provide a valid option! Available options: \`humans\`, \`bots\``,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const role = ctx.message.mentions.roles.first() || ctx.message.guild.roles.cache.get(ctx.message.content.split(' ').slice(2)[0]) || ctx.message.guild.roles.cache.find(r => r.name.toLowerCase() === ctx.message.content.split(' ').slice(1).join(' ').toLowerCase()) || ctx.message.guild.roles.cache.find(r => r.name.toLowerCase().includes(ctx.message.content.split(' ').slice(2).join(' ').toLowerCase()));

		if (!role) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must provide a valid role!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (ctx.message.guild.ownerId !== ctx.message.member?.id && role.position >= ctx.message.member?.roles.highest.position && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You cannot give that role to members as it is higher than your highest role!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (role.id === ctx.message.guild.roles.everyone.id) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You cannot give that role to members as it is the \`@everyone\` role!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (role.managed) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You cannot give that role to members as it is managed by an integration!`,
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
				content: `${process.env.FAILURE_EMOJI} | You cannot give that role to members as it has moderation permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I do not have \`Manage Roles\` permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (role.position >= ctx.message.guild.members.me.roles.highest.position) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I cannot give that role to members as it is higher than my highest role!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const members = subcommand === 'humans' ? ctx.message.guild.members.cache.filter((m) => !m.user?.bot) : ctx.message.guild.members.cache.filter((m) => m.user?.bot);
		const msg = await ctx.message.reply({
			content: `Giving \`${role.name}\` role to all ${subcommand}...`,
		});
		const membersWithoutRole = members.filter((m) => !m.roles.cache.has(role.id));
		const promises = [];
		membersWithoutRole.forEach((m) => promises.push(m.roles.add(role)));
		for (const promise of promises) {
			if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
				return msg.edit({
					content: `${process.env.FAILURE_EMOJI} | I can no longer give that role to members as I do not have \`Manage Roles\` permissions!`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			if (role.position >= ctx.message.guild.members.me.roles.highest.position) {
				return msg.edit({
					content: `${process.env.FAILURE_EMOJI} | I can no longer give that role to members as it is higher than my highest role!`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			if (dangerousPermissions.some((p) => role.permissions.has(p))) {
				return msg.edit({
					content: `${process.env.FAILURE_EMOJI} | I will no longer give that role to members as it has moderation permissions!`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			await promise;
		}

		try {
			await msg.edit({
				content: `${process.env.SUCCESS_EMOJI} | Gave \`${role.name}\` role to all ${subcommand}`,
			});
		}
		catch (e) {
			return;
		}
	},
});