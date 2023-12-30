const App = require('../../../../Structures/Core/App');
const { ChannelType, version } = require('discord.js');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');
const { formatBytes } = require('../../../../Structures/Utils/Functions/formatBytes');
const { cpu } = require('../../../../Structures/Utils/Functions/cpu');
const os = require('os');

module.exports = new App({
	name: 'botinfo',
	description: 'Shows information on the bot',
	aliases: ['botstats', 'stats', 'bi'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		await ctx.message.channel?.sendTyping();
		let owner;
		if (ctx.client.users.cache.get(ctx.client.owners[0]) !== undefined) {
			owner = ctx.client.users.cache.get(ctx.client.owners[0]);
		}
		else {
			owner = await ctx.client.users.fetch(ctx.client.owners[0]);
		}

		const one = generateCustomID();

		const two = generateCustomID();

		const three = generateCustomID();

		const four = generateCustomID();

		const slashCommands = ctx.client.slashCommands;

		let totalCommands = slashCommands.size;
		slashCommands.forEach((cmd) => {
			if (cmd.options) {
				let found = false;
				for (const option of cmd.options) {
					if (option.choices) {
						for (const choice of option.choices) {
							totalCommands++;
						}
						found = true;
					} else if (option.type === 1) {
						totalCommands++;
						found = true;
					}
				}
				if (found) totalCommands--;
			}
		});

		const msg = await ctx.message.reply({
			embeds: [{
				author: {
					name: owner.globalName || owner.username,
					icon_url: owner.displayAvatarURL({ size: 2048 }),
				},
				title: 'Official Support Server',
				url: `${process.env.SUPPORT_SERVER}`,
				fields: [{
					name: '__Botinfo__',
					value: `**Uptime:** ${Math.floor(ctx.client.uptime / 86400000)} Day(s), ${Math.floor(ctx.client.uptime / 3600000) % 24} Hour(s), ${Math.floor(ctx.client.uptime / 60000) % 60} Minute(s), ${Math.floor(ctx.client.uptime / 1000) % 60} Second(s)\n**Approx. Guilds:** ${(await ctx.client.application.fetch()).approximateGuildCount}\n**Users:** Total ${ctx.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString()} | ${ctx.client.users.cache.size.toLocaleString()} Cached\n**Ping:** ${ctx.client.ws.ping}\n**Commands:** ${totalCommands}`,
					inline: false,
				},
				{
					name: '__Channels__',
					value: `<:text:968785487764545587> ${ctx.client.channels.cache.filter(e => e.type === ChannelType.GuildText).size} | <:voice:968786121578393630> ${ctx.client.channels.cache.filter(e => e.type === ChannelType.GuildVoice).size} | <:stage:968786792910319626> ${ctx.client.channels.cache.filter(e => e.type === ChannelType.GuildStageVoice).size}`,
					inline: false,
				},
				],
				thumbnail: {
					url: ctx.client.user.displayAvatarURL({ size: 2048 }),
				},
				color: 16705372,
			}],
			components: [{
				type: 1,
				components: [{
					type: 2,
					label: 'Bot Info',
					emoji: {
						id: '968783105139802152',
						name: 'bot_info',
					},
					custom_id: one,
					style: 3,
					disabled: true,
				},
				{
					type: 2,
					label: 'System Info',
					emoji: {
						id: '968784236049997834',
						name: 'system',
					},
					custom_id: two,
					style: 2,
				},
				{
					type: 2,
					label: 'Module Info',
					emoji: {
						id: '968784866344861736',
						name: 'modules',
					},
					custom_id: three,
					style: 2,
				},
				{
					type: 2,
					label: 'Affiliates',
					emoji: {
						id: '969270590110331010',
						name: 'Discord_Partnered_Server_Owner',
					},
					custom_id: four,
					style: 2,
				}
				],
			}],
		});

		const processor = cpu();

		const collector = msg.createMessageComponentCollector({
			time: 120000,
		});
		
		collector.on('collect', async (i) => {
			if (i.isButton()) {
				if (i.user?.id !== ctx.message.author?.id) {
					return i.reply({
						content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
						ephemeral: true,
					});
				}

				await i.deferUpdate();
				switch (i.customId) {
					case one:
						await msg.edit({
							embeds: [{
								author: {
									name: owner.globalName || owner.username,
									icon_url: owner.displayAvatarURL({ size: 2048 }),
								},
								title: 'Official Support Server',
								url: `${process.env.SUPPORT_SERVER}`,
								fields: [{
									name: '__Botinfo__',
									value: `**Uptime:** ${Math.floor(ctx.client.uptime / 86400000)} Day(s), ${Math.floor(ctx.client.uptime / 3600000) % 24} Hour(s), ${Math.floor(ctx.client.uptime / 60000) % 60} Minute(s), ${Math.floor(ctx.client.uptime / 1000) % 60} Second(s)\n**Approx. Guilds:** ${(await ctx.client.application.fetch()).approximateGuildCount}\n**Users:** Total ${ctx.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString()} | ${ctx.client.users.cache.size.toLocaleString()} Cached\n**Ping:** ${ctx.client.ws.ping}\n**Commands:** ${totalCommands}`,
									inline: false,
								},
								{
									name: '__Channels__',
									value: `<:text:968785487764545587> ${ctx.client.channels.cache.filter(e => e.type === ChannelType.GuildText).size} | <:voice:968786121578393630> ${ctx.client.channels.cache.filter(e => e.type === ChannelType.GuildVoice).size} | <:stage:968786792910319626> ${ctx.client.channels.cache.filter(e => e.type === ChannelType.GuildStageVoice).size}`,
									inline: false,
								},
								],
								thumbnail: {
									url: ctx.client.user.displayAvatarURL({ size: 2048 }),
								},
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: msg.components[0].components.map((component, index) => {
									if (index === 0) {
										component.data.style = 3;
										component.data.disabled = true;
									} else {
										component.data.style = 2;
										component.data.disabled = false;
									}
									return component.data;
								})
							}],
						});
						break;
					case two:
						await msg.edit({
							embeds: [{
								author: {
									name: owner.globalName || owner.username,
									icon_url: owner.displayAvatarURL({ size: 2048 }),
								},
								title: 'Official Support Server',
								url: `${process.env.SUPPORT_SERVER}`,
								fields: [{
									name: '__Cpu Info__',
									value: `**Cpu Model:** ${processor.model}\n**Cpu Speed:** ${processor.speed}MHz\n**Cpu Cores:** ${processor.cores}\n**Cpu Usage:** ${Math.round(processor.usage)}%\n**Cpu Free:** ${Math.round(processor.free)}%`,
									inline: false,
								},
								{
									name: '__Memory Info__',
									value: `**Total Memory:** ${formatBytes(os.totalmem())}\n**Used Memory:** ${formatBytes(process.memoryUsage().heapUsed)}\n**Free Memory:** ${formatBytes(os.totalmem() - process.memoryUsage().heapUsed)}`,
									inline: false,
								},
								],
								thumbnail: {
									url: ctx.client.user.displayAvatarURL({ size: 2048 }),
								},
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: msg.components[0].components.map((component, index) => {
									if (index === 1) {
										component.data.style = 3;
										component.data.disabled = true;
									} else {
										component.data.style = 2;
										component.data.disabled = false;
									}
									return component.data;
								})
							}],
						});
						break;
					case three:
						await msg.edit({
							embeds: [{
								author: {
									name: owner.globalName || owner.username,
									icon_url: owner.displayAvatarURL({ size: 2048 }),
								},
								title: 'Official Support Server',
								url: `${process.env.SUPPORT_SERVER}`,
								fields: [{
									name: '__Module Info__',
									value: `**Discord Api Wrapper:** v${version} (Discord.JS)\n**NodeJS Version:** ${process.version}\n**Database:** v${require('../../../../../package.json').dependencies['mongoose'].slice(1)} (MongoDB)\n**Platform:** ${os.platform()}\n**Host Name:** ${os.hostname()}\n**Architecture**: ${os.arch()}`,
									inline: false,
								}],
								thumbnail: {
									url: ctx.client.user.displayAvatarURL({ size: 2048 }),
								},
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: msg.components[0].components.map((component, index) => {
									if (index === 2) {
										component.data.style = 3;
										component.data.disabled = true;
									} else {
										component.data.style = 2;
										component.data.disabled = false;
									}
									return component.data;
								})
							}],
						});
						break;
					case four:
						await msg.edit({
							embeds: [{
								author: {
									name: owner.globalName || owner.username,
									icon_url: owner.displayAvatarURL({ size: 2048 }),
								},
								title: 'Official Support Server',
								url: `${process.env.SUPPORT_SERVER}`,
								description: 'Servers or organisations that are affiliated with the bot:',
								fields: [{
									name: '__Organizations__',
									value: "- <:1st_Services:1143871253489397771> **1sT - Services**\n	- [Discord Server](https://discord.gg/1st-dev-services-952570101784281139)",
									inline: false,
								}],
								thumbnail: {
									url: ctx.client.user.displayAvatarURL({ size: 2048 }),
								},
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: msg.components[0].components.map((component, index) => {
									if (index === 3) {
										component.data.style = 3;
										component.data.disabled = true;
									} else {
										component.data.style = 2;
										component.data.disabled = false;
									}
									return component.data;
								})
							}],
						});
						break;
				}
				collector.resetTimer();
			}
		});

		collector.on('end', async (collected, reason) => {
			if (reason === 'time') {
				await msg.edit({
					components: [{
						type: 1,
						components: msg.components[0].components.map((component) => {
							component.data.disabled = true;
							return component.data;
						})
				    }]
				});
			}
		});
	},
});