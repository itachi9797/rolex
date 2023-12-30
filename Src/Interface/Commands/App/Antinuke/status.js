const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/antinuke');
const Owners = require('../../../../Database/Schemas/owners');
const { EmbedBuilder } = require('discord.js');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');

module.exports = new App({
	name: 'status',
	description: 'Shows current antinuke status for the server!',
	usage: 'status',
	userPermissions: ['Server Owner'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.interaction.guild.id,
		});

		if (ctx.interaction.user?.id !== ctx.interaction.guild.ownerId && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.user?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`,
				ephemeral: true,
			});
		}

		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {
			if (!data) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | Antinuke is disabled for this server!`,
					ephemeral: true,
				});
			}
			let i = 0;
			const embeds = [
				`\`1\` | Anti Ban | ${data.antiban ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`2\` | Anti Kick | ${data.antikick ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`3\` | Anti Bot Add | ${data.antibot ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`4\` | Anti Server Update | ${data.antiserver ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`5\` | Anti Prune | ${data.antiprune ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\n**Punishment:** ${data.punishment}\n**Total Whitelisted Users:** ${data.whitelist.length}`,
				`\`6\` | Anti Channel Create | ${data.antiChannelCreate ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`7\` | Anti Channel Delete | ${data.antiChannelDelete ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`8\` | Anti Channel Update | ${data.antiChannelUpdate ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`9\` | Anti Role Create | ${data.antiRoleCreate ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`10\` | Anti Role Delete | ${data.antiRoleDelete ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\n**Punishment:** ${data.punishment}\n**Total Whitelisted Users:** ${data.whitelist.length}`,
				`\`11\` | Anti Role Update | ${data.antiRoleUpdate ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`12\` | Anti Webhook Create | ${data.antiwebhookCreate ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`13\` | Anti Webhook Delete | ${data.antiwebhookDelete ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`14\` | Anti Webhook Update | ${data.antiwebhookUpdate ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`15\` | Anti Member Roles Update | ${data.antimember ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\n**Punishment:** ${data.punishment}\n**Total Whitelisted Users:** ${data.whitelist.length}`,
				`\`16\` | Anti Vanity Update | ${data.antiVanitySteal ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`17\` | Anti Unban | ${data.antiunban ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`18\` | Anti Expression Delete | ${data.antiEmojiDelete ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`19\` | Anti Invite Delete | ${data.antiInviteDelete ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\`20\` | Anti Everyone/Here Ping | ${data.antiEveryone ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}\n\n**Punishment:** ${data.punishment}\n**Total Whitelisted Users:** ${data.whitelist.length}`,
			];
			const emb = new EmbedBuilder()
				.setTitle("Total AntiNuke features : 20")
				.setDescription(embeds[i])
				.setFooter({
					text: `${ctx.client.user?.globalName || ctx.client.user?.username} • Page ${i + 1}/${embeds.length}`,
					icon_url: ctx.client.user?.displayAvatarURL({ size: 2048 }),
				})
				.setColor(16705372)
				.setThumbnail(ctx.client.user?.displayAvatarURL({ size: 2048 }));

			const start = generateCustomID();

			const prev = generateCustomID();

			const stop = generateCustomID();

			const next = generateCustomID();

			const end = generateCustomID();

			const message = await ctx.interaction.reply({
				fetchReply: true,
				embeds: [emb],
				components: [
					{
						type: 1,
						components: [
							{
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
								custom_id: prev,
								disabled: true,
							},
							{
								type: 2,
								emoji: {
									name: 'stop',
									id: '996000402338226196',
								},
								style: 2,
								custom_id: stop,
							},
							{
								type: 2,
								emoji: {
									name: 'arrow_forward',
									id: '996005619767181323',
								},
								style: 2,
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
							},
						],
					},
				],
			});

			const collector = message.createMessageComponentCollector({
				componentType: 2,
				time: 120000,
			});

			collector.on('collect', async (int) => {
				await int.deferUpdate();
				if (int.user?.id !== ctx.interaction.user?.id) {
					return int.reply({
						content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
						ephemeral: true,
					});
				}
				switch (int.customId) {
					case start:
						i = 0;
						break;
					case prev:
						i = i > 0 ? --i : embeds.length - 1;
						break;
					case stop:
						return collector.stop();
					case next:
						i = i + 1 < embeds.length ? ++i : 0;
						break;
					case end:
						i = embeds.length - 1;
						break;
				}
				emb
					.setTitle("Total AntiNuke features : 20")
					.setDescription(embeds[i])
					.setFooter({
						text: `${ctx.client.user?.globalName || ctx.client.user?.username} • Page ${i + 1}/${embeds.length}`,
						icon_url: ctx.client.user?.displayAvatarURL({ size: 2048 }),
					})
					.setColor(16705372)
					.setThumbnail(ctx.client.user?.displayAvatarURL({ size: 2048 }));
					
				message.edit({
					embeds: [emb],
					components: [
						{
							type: 1,
							components: message.components[0].components.map((component, index) => { 
								if (index === 0 || index === 1) {
									component.data.disabled = i === 0;
								} else if (index === 3 || index === 4) {
									component.data.disabled = i === embeds.length - 1;
								}
								return component.data;
							}),
						},
					],
				});
				collector.resetTimer();
			});

			collector.on('end', async (collected, reason) => {
				message.edit({
					components: [
						{
							type: 1,
							components: message.components[0].components.map((component) => {
								component.data.disabled = true;
								return component.data;
							})
						},
					],
				});
			});
		});
	},
});