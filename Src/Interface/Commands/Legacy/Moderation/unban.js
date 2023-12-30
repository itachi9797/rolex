const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'unban',
	description: 'Bans a member in the server!',

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		let user;
		if (ctx.message.mentions) {
			if (ctx.message.content.match(/<@(\d+)>/) !== null && ctx.message.content.match(/<@(\d+)>/)[0] === ctx.message.content.split(' ')[1]) {
				try {
					user = await ctx.client.users.fetch(ctx.message.content.match(/<@(\d+)>/)[1]);
				}
				catch (e) {
					return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
			}
			else if (ctx.message.mentions.members.first() && ctx.message.mentions.members.first() === ctx.message.content.split(' ')[1]) {
				try {
					user = await ctx.client.users.fetch(ctx.message.mentions.members.first().id);
				}
				catch (e) {
					return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
			}
			else {
				try {
					user = await ctx.client.users.fetch(ctx.message.content.split(' ')[1]);
				}
				catch (e) {
					return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
			}
		}
		else {
			try {
				user = await ctx.client.users.fetch(ctx.message.content.split(' ')[1]);
			}
			catch (e) {
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		}

		const reason = ctx.message.content.split(' ').slice(2).join(' ') || 'No reason provided';

		if (user?.id === ctx.message.author?.id) {
			ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | How tf you can unban yourself?`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}
		else {
			const owner_data = await Owners.findOne({
				Guild: ctx.message.guild.id,
			});
			if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.BanMembers) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You do not have \`Ban Members\` permissions!`,

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

			if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | I do not have \`Ban Members\` permissions!`,

				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			ctx.message.guild.bans.fetch().then(async (bans) => {
				const bUser = bans.find(b => b.user?.id == user?.id);
				if (!bUser) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | The given user is not banned`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				await ctx.message.guild.bans.remove(user?.id, `${reason} - (${ctx.message.author?.id})`);

				ctx.message.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully unbanned ${user?.globalName || user?.username}!`,
				});
			});
		}
	},
});