const App = require('../../../../Structures/Core/App');
const Owners = require('../../../../Database/Schemas/owners');
const { EmbedBuilder } = require('discord.js');

module.exports = new App({
	name: 'owner',
	description: 'Adds/removes/resets/shows owners for the antinuke system!',
	aliases: ['owners'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		await Owners.findOne({
			Guild: ctx.message.guild.id,
		}).then(async (data) => {
			if (ctx.message.author?.id !== ctx.message.guild.ownerId && !(data && data.additional_owners.includes(ctx.message.author?.id))) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`,

				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			const subcommand = ctx.message.content.split(' ').slice(1).shift();

			if (!subcommand) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | Please provide a option! Available options: \`add\`, \`remove\`, \`reset\`, \`show\``,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			let user;

			if (subcommand.toLowerCase() !== 'add' && subcommand.toLowerCase() !== 'remove') {
				if (ctx.message.mentions) {
					if (ctx.message.content.match(/<@(\d+)>/) !== null && ctx.message.content.match(/<@(\d+)>/)[0] === ctx.message.content.split(' ').slice(2)[0]) {
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
					else if (ctx.message.mentions.members.first() && ctx.message.mentions.members.first() !== ctx.message.content.split(' ').slice(2)[0]) {
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
							user = await ctx.client.users.fetch(ctx.message.content.split(' ').slice(2)[0]);
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
						user = await ctx.client.users.fetch(ctx.message.content.split(' ').slice(2)[0]);
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

			switch (subcommand.toLowerCase()) {
				case 'add':
					if (ctx.message.author?.id !== ctx.message.guild.ownerId) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					if (!data) {
						data = new Owners({
							Guild: ctx.message.guild.id,
							additional_owners: [],
						});
					}

					if (user?.id === ctx.message.guild.ownerId) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | The server owner doesn't need to be added in the owner list!`,

						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					if (user?.id === ctx.client.user?.id) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | Why do you need to add me in the owner list?`,

						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					if (data.additional_owners.includes(user?.id)) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | This user is already in the owner list!`,

						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					if (data.additional_owners.length >= 5) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | You can only add 5 owners to the owner list!`,

						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					data.additional_owners.push(user?.id);
					await data.save();
					ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | Added **${user?.globalName || user?.username}** to the owner list!`,
					});
					break;
				case 'remove':
					if (ctx.message.author?.id !== ctx.message.guild.ownerId) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`,

						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}

					if (!data || !data.additional_owners.includes(user?.id)) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | This user is not in the owner list!`,

						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					if (data.additional_owners.length <= 1) {
						await data.deleteOne();
						return ctx.message.reply({
							content: `${process.env.SUCCESS_EMOJI} | Removed **${user?.globalName !== null ? user?.globalName : user?.username}** from the owner list!`,
						});
					}
					data.additional_owners = data.additional_owners.filter((x) => x !== user?.id);
					await data.save();
					ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | Removed **${user?.globalName !== null ? user?.globalName : user?.username}** from the owner list!`,
					});
					break;
				case 'reset':
					if (ctx.message.author?.id !== ctx.message.guild.ownerId) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`,

						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					await data.deleteOne();
					ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | Owner list was reset successfully!`,
					});
					break;
				case 'show':
					if (!data || !data.additional_owners.length) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | No additional owners found!`,

						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					const description = (await Promise.all(data.additional_owners
						.map((r) => r)
						.map(async (r, i) =>
							`\`${i + 1}\` | ${(ctx.client.users.cache.get(r) ? ctx.client.users.cache.get(r) : (await ctx.client.users.fetch(r))).globalName !== null ? ctx.client.users.cache.get(r).globalName : ctx.client.users.cache.get(r).username} | <@${r}>)`))).join('\n');
				
					const embed = new EmbedBuilder()
						.setColor(16705372)
						.setTitle(`Total Additional Owners: ${data.additional_owners.length}`)
						.setDescription(description);

					ctx.message.reply({
						embeds: [embed],
					});
					break;
				default:
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | Please provide a option! Available options: \`add\`, \`remove\`, \`reset\`, \`show\``,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
			}
		});
	},
});