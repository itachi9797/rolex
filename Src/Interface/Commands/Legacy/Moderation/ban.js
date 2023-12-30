const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'ban',
	description: 'Ban a member in the server!',
	aliases: ['hackban', 'fuckban', 'fuckyou', 'fuckoff'],

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
				content: `${process.env.FAILURE_EMOJI} | Why don't you just leave?`,
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

			if (ctx.message.guild.members.cache.get(user?.id)) {

				if (user?.id === ctx.message.guild.ownerId || (owner_data && owner_data.additional_owners.includes(user?.id))) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You can't punish an owner.`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				if (ctx.message.member?.user?.id !== ctx.message.guild.ownerId && ctx.message.member?.roles.highest.position <= ctx.message.guild.members.cache.get(user?.id).roles.highest.position) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You cannot do this action on this user due to role hierarchy.`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				if (ctx.message.guild.members.cache.get(user?.id).roles.highest.position >= ctx.message.guild.members.me.roles.highest.position) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | The user has higher or equal position to me.`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				await ctx.message.guild.members.ban(user?.id, {
					reason: `${reason} - (${ctx.message.author?.id})`,
				});

				ctx.message.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully banned ${user?.globalName || user?.username}!`,
				}).then(async (msg) => {
					await user?.send({
						content: `You were banned from ${ctx.message.guild.name}!\nReason: ${reason}`,
					}).catch(() => {
						return msg.edit({
							content: `${process.env.SUCCESS_EMOJI} | Successfully banned ${user?.globalName || user?.username}! | I couldn't DM the user?.`,
						});
					});
				});
			}
			else {
				await ctx.message.guild.members.ban(user?.id, {
					reason: `${reason} - (${ctx.message.author?.id})`,
				});

				ctx.message.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully banned ${user?.globalName || user?.username}!`,
				});
			}
		}
	},
});