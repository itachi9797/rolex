const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/ignore');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');

module.exports = new App({
	name: 'ignore',
	description: 'Ignores command in a specific channel.',
	usage: 'ignore <channel>',
	userPermissions: ['Manage Server'],
	options: [
		{
			name: 'channel',
			description: 'The channel you want to ignore!',
			type: 1,
			options: [{
				name: 'channel',
				description: 'The channel you want to ignore!',
				required: true,
				type: 7,
				channel_types: [0],
			}],
		},
		{
			name: 'show',
			description: 'Shows the list of ignored channels!',
			type: 1,
		},
		{
			name: 'reset',
			description: 'Resets the ignore list so that no channel is ignored!',
			type: 1,
		},
	],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.interaction.guild.id,
		});
		if (!ctx.interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Server\` permissions!`,
				ephemeral: true,
			});
		}

		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {
			switch (ctx.interaction.options.getSubcommand()) {
				case 'channel':
					const channel = ctx.interaction.options.getChannel('channel');

					if (!data) {
						data = new Schema({
							Guild: ctx.interaction.guild.id,
							channel: [],
						});
						data.channel?.push(channel?.id);
						await data.save();
						await ctx.interaction.reply({
							content: `${process.env.SUCCESS_EMOJI} | Successfully ignored <#${channel?.id}> for using commands!`,
						});
					}
					else if (data.channel?.includes(channel?.id)) {
						if (data.channel?.filter((x) => x !== channel?.id).length === 0) {
							return Schema.findOneAndDelete({
								Guild: ctx.interaction.guild.id,
							});
						}
						else {
							data.channel = data.channel?.filter((x) => x !== channel?.id);
							await data.save();
						}
						await ctx.interaction.reply({
							content: `${process.env.SUCCESS_EMOJI} | Successfully unignored <#${channel?.id}> for using commands!`,
						});
					}
					else {
						if (channel?.type !== 0) {
							return ctx.interaction.reply({
								content: `${process.env.FAILURE_EMOJI} | You can only add text channels to ignored channel channels!`,
								ephemeral: true,
							});
						}
						data.channel?.push(channel?.id);
						await data.save();
						await ctx.interaction.reply({
							content: `${process.env.SUCCESS_EMOJI} | Successfully ignored <#${channel?.id}> for using commands!`,
						});
					}
					break;
				case 'show':
					if (!data) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | This server has no ignored channels!`,
							ephemeral: true,
						});
					}

					if (data.channel?.length === 0) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | This server has no ignored channels!`,
							ephemeral: true,
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
						return ctx.interaction.reply({
							fetchReply: true,
							embeds: [emb]
						});
					}

					const start = generateCustomID();

					const prev = generateCustomID();

					const stop = generateCustomID();

					const next = generateCustomID();

					const end = generateCustomID();
			
					const msg = await ctx.interaction.reply({
						fetchReply: true,
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

						if (i.user.id !== ctx.interaction.user.id) {
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

						ctx.interaction.reply({
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
						ctx.interaction.reply({
							components: msg.components[0].components.map((x) => {
								x.data.disabled = true;
								return x.data;
							}),
						});							
					});
					break;
				case 'reset':
					if (!data) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | This server has no ignored channels!`,
							ephemeral: true,
						});
					}
					await data.deleteOne();
					ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Reset was done successfully!`,
					});
					break;
			}
		});
	},
});
