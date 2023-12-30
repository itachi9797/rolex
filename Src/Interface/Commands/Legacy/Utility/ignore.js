const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/ignore');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');

module.exports = new App({
	name: 'ignore',
	description: 'Ignores command in a specific channel.',

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

		const ops = ctx.message.content.split(' ').slice(1).shift();

		if (!ops) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Please provide a option! Available options: \`Channel\`, \`Show\`, \`Reset\``,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		await Schema.findOne({
			Guild: ctx.message.guild.id,
		}).then(async (data) => {
			switch (ops.toLowerCase()) {
				case 'channel':
					const channel = ctx.message.mentions.channels.first() || ctx.message.guild.channels.cache.get(ctx.message.content.split(' ')[2]);
					if (!channel) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | You must provide a valid channel!`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}

					if (channel?.type !== 0) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | You can only set a text channel as the welcomer channel!`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}

					if (!data) {
						data = new Schema({
							Guild: ctx.message.guild.id,
							channel: [],
						});
						data.channel?.push(channel?.id);
						await data.save();
						await ctx.message.reply({
							content: `${process.env.SUCCESS_EMOJI} | Successfully ignored <#${channel?.id}> for using commands!`,
						});
					}
					else if (data.channel?.includes(channel?.id)) {
						if (data.channel?.filter((x) => x !== channel?.id).length === 0) {
							return Schema.findOneAndDelete({
								Guild: ctx.message.guild.id,
							});
						}
						else {
							data.channel = data.channel?.filter((x) => x !== channel?.id);
							await data.save();
						}
						await ctx.message.reply({
							content: `${process.env.SUCCESS_EMOJI} | Successfully unignored <#${channel?.id}> for using commands!`,
						});
					}
					else {
						if (channel?.type !== 0) {
							return ctx.message.reply({
								content: `${process.env.FAILURE_EMOJI} | You can only add text channels to ignored channel channels!`,
							}).then(message => {
								setTimeout(() => {
									message.delete();
								}, 15000);
							});
						}
						data.channel?.push(channel?.id);
						await data.save();
						await ctx.message.reply({
							content: `${process.env.SUCCESS_EMOJI} | Successfully ignored <#${channel?.id}> for using commands!`,
						});
					}
					break;
				case 'show':
					if (!data) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | This server has no ignored channels!`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}

					if (data.channel?.length === 0) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | This server has no ignored channels!`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}

					let i0 = 0;
					let i1 = 10;

					let description;
					description = data.channel
						? data.channel
						.map((r) => r)
						.map((r, i) =>
							`\`${i + 1}\` | <#${r}>`)
						.slice(i0, i1)
						.join('\n') : null;

					const emb = new EmbedBuilder()
						.setTitle(`Total Ignored Channels : ${data.channel?.length}`)
						.setColor(16705372)
						.setDescription(description);

					if (data.channel?.length <= 10) {
						return ctx.message.reply({
							embeds: [emb],
						});
					}

					const start = generateCustomID();

					const prev = generateCustomID();

					const stop = generateCustomID();

					const next = generateCustomID();

					const end = generateCustomID();
			
					const msg = await ctx.message.reply({
						embeds: [emb],
						components: [{
							type: 1,
							components: [{
								type: 2,
								emoji: {
									name: 'previous',
									id: '996000399943274506',
								},
								style: 2,
								custom_id: start,
								disabled: true,
							},
							{
								type: 2,
								emoji: {
									name: 'arrow_backward',
									id: '996005616147513406',
								},
								style: 2,
								disabled: true,
								custom_id: prev,
							},
							{
								type: 2,
								emoji: {
									name: 'stop',
									id: '996000402338226196',
								},
								style: 2,
								disabled: false,
								custom_id: stop,
							},
							{
								type: 2,
								emoji: {
									name: 'arrow_forward',
									id: '996005619767181323',
								},
								style: 2,
								disabled: false,
								custom_id: next,
							},
							{
								type: 2,
								emoji: {
									name: 'next',
									id: '996000397196005386',
								},
								style: 2,
								custom_id: end,
								disabled: false,
							},
							],
						}],
					});

					const collector = msg.createMessageComponentCollector({
						time: 120000,
					});

					collector.on('collect', async (i) => {
						await i.deferUpdate();

						if (i.user.id !== ctx.message.author.id) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | You cannot control this pagination!`,
								ephemeral: true,
							});
						}

						switch (i.customId) {
							case start:
								i0 = 0;
								i1 = 10;
								break;
							case prev:
								i0 = i0 - 10;
								i1 = i1 - 10;
								break;
							case stop:
								return collector.stop();
							case next:
								i0 = i0 + 10;
								i1 = i1 + 10;
								break;
							case end:
								i0 = data.channel?.length - 10;
								i1 = data.channel?.length;
								break;
						}

						description = data.channel
							? data.channel
							.map((r) => r)
							.map((r, i) =>
								`\`${i + 1}\` | <#${r}>`)
							.slice(i0, i1)
							.join('\n') : null;

						emb.setDescription(description);

						ctx.message.reply({
							embeds: [emb],
							components: [{
								type: 1,
								components: msg.components[0].components.map((x, y) => {
									if (y === 0 || y === 1) {
										x.data.disabled = (i0 === 0) ? true : false;
									}
									else if (y === 3 || y === 4) {
										x.data.disabled = (i0 + 10 >= data.channel?.length) ? true : false;
									}
									return x.data;
								}),
							}],
						});
					});

					collector.on('end', async (collected, reason) => {
						ctx.message.reply({
							components: msg.components[0].components.map((x) => {
								x.data.disabled = true;
								return x.data;
							}),
						});							
					});
					break;
				case 'reset':
					if (!data) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | This server has no ignored channels!`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					await data.deleteOne();
					ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | Reset was done successfully!`,
					});
					break;
				default:
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | Please provide a valid option! Available options: \`Channel\`, \`Show\`, \`Reset\``,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
			}
		});
	},
});
