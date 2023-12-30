const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'unmute',
	description: 'Unmutes a member in the server!',
	aliases: ['unshut', 'umute'],
	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {
		let member;
		if (ctx.message.mentions) {
			if (ctx.message.content.match(/<@(\d+)>/) !== null && ctx.message.content.match(/<@(\d+)>/)[0] === ctx.message.content.split(' ')[1]) {
				try {
					member = await ctx.message.guild.members.fetch(ctx.message.content.match(/<@(\d+)>/)[1]);
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
					member = await ctx.message.guild.members.fetch(ctx.message.mentions.members.first().id);
				}
				catch (e) {
					return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
			}
			else if (ctx.message.content.split(' ')[1]) {
				try {
					member = await ctx.message.guild.members.fetch(ctx.message.content.split(' ')[1]);
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
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		}
		else if (ctx.message.content.split(' ')[1]) {
			try {
				member = await ctx.message.guild.members.fetch(ctx.message.content.split(' ')[1]);
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
			return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const reason = ctx.message.content.split(' ').slice(2).join(' ') || 'No reason provided';

		if (member?.user?.id === ctx.message.author?.id) {
			ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI}} | How tf you can unmute yourself?`,
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

			if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.ModerateMembers) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You do not have \`Moderate Members\` permissions!`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			if (!ctx.message.guild.members.cache.get(member?.id)) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | The member is not in the server!`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			if (ctx.message.member?.user?.id !== ctx.message.guild.ownerId && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id)) && ctx.message.member?.roles.highest.position <= member?.roles.highest.position) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You cannot do this action on this user due to role hierarchy.`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | I do not have \`Moderate Members\` permissions!`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			if (ctx.message.guild.members.me.roles.highest.position <= member?.roles.highest.position) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | The user has higher or equal position to me.`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			await member?.timeout(null, `${reason} - (${ctx.message.author?.id})`);
			ctx.message.reply({
				content: `${process.env.SUCCESS_EMOJI} | Successfully unmuted ${member?.user?.globalName || member?.user?.username}!`,
			}).then(async (msg) => {
				await member?.user?.send({
					content: `Your were unmuted in ${ctx.message.guild.name}!\nReason: ${reason}`,
				}).catch(() => {
					return msg.edit({
						content: `${process.env.SUCCESS_EMOJI} | Successfully unmuted ${member?.user?.globalName || member?.user?.username}! | I couldn't DM the user?.`,
					});
				});
			});
		}
	},
});