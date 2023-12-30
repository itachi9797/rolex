const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'mute',
	description: 'Mutes a member in the server!',
	aliases: ['m', 'silence', 'shutup', 'stfu', 'timeout', 'tmute', 'tempmute'],
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

		let time = '28d';
		let reason;
		const thirdWord = ctx.message.content.split(' ')[2];

		if (thirdWord && /^\d+[smhd]$/.test(thirdWord)) {
			time = thirdWord;
			reason = ctx.message.content.split(' ').slice(3).join(' ') || 'No reason provided';
		}
		else {
			reason = ctx.message.content.split(' ').slice(2).join(' ') || 'No reason provided';
		}

		if (member?.id === ctx.message.author?.id) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Why don't you just keep quiet instead of punishing yourself?`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

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

		if (member?.user?.id === ctx.message.guild.ownerId || (owner_data && owner_data.additional_owners.includes(member?.user?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You can't punish an owner.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You can't punish an administrator.`,
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

		const multipliers = {
			ms: 1,
			s: 1000,
			m: 60 * 1000,
			h: 60 * 60 * 1000,
			d: 24 * 60 * 60 * 1000,
		};

		const timeUnit = time.slice(-1);
		if (!multipliers[timeUnit]) {
			return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Invalid time unit! Please use one of the following: \`ms\`, \`s\`, \`m\`, \`h\`, \`d\``).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const timeValue = parseInt(time.slice(0, -1));
		if (isNaN(timeValue)) {
			return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Invalid time value! Please enter a valid time`).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const timeInMs = timeValue * multipliers[timeUnit];

		if (timeInMs > 2419200000) {
			return ctx.message.reply(`${process.env.FAILURE_EMOJI} | You can't mute someone for more than 28 days! It's too rude..`).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		await member?.timeout(timeInMs, `${reason} - (${ctx.message.author?.id})`);
		ctx.message.reply({
			content: `${process.env.SUCCESS_EMOJI} | Successfully muted ${member?.user?.globalName || member?.user?.username}!`,
		}).then(async (msg) => {
			await member?.user?.send({
				content: `You were muted in ${ctx.message.guild.name}!\nReason: ${reason}`,
			}).catch(() => {
				return msg.edit({
					content: `${process.env.SUCCESS_EMOJI} | Successfully muted ${member?.user?.globalName || member?.user?.username} for ${time}! | I couldn't DM the user?.`,
				});
			});
		});
	},
});