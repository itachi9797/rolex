const App = require('../../../../Structures/Core/App');
const fs = require('fs');
const PrefixSchema = require('../../../../Database/Schemas/guildprefix');
const { EmbedBuilder } = require('discord.js');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');

module.exports = new App({
	name: 'help',
	description: 'Get information on the bot commands and categories',
	usage: 'help [command]',
	aliases: ['h'],
	options: [{
		name: 'command',
		description: 'Provide the command you want to get more information on!',
		type: 3,
		required: false,
	}],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const command_name = ctx.interaction.options.getString('command');

		const prefix_scheme = await PrefixSchema.findOne({
			Guild: ctx.interaction.guild.id,
		});

		let prefix = prefix_scheme ? prefix_scheme.prefix : process.env.PREFIX;

		if (!command_name) {
			let owner;
			if (ctx.client.users.cache.get(ctx.client.owners[0]) !== undefined) {
				owner = ctx.client.users.cache.get(ctx.client.owners[0]);
			}
			else {
				owner = await ctx.client.users.fetch(ctx.client.owners[0]);
			}

			const slashCommands = ctx.client.slashCommands;

			let i = slashCommands.size;
			slashCommands.forEach((cmd) => {
				if (cmd.options) {
					let found = false;
					for (const option of cmd.options) {
						if (option.choices) {
							for (const choice of option.choices) {
								i++;
							}
							found = true;
						} else if (option.type === 1) {
							i++;
							found = true;
						}
					}
					if (found) i--;
				}
			});

			const select = generateCustomID();

			const start = generateCustomID();

			const prev = generateCustomID();

			const stop = generateCustomID();

			const next = generateCustomID();

			const end = generateCustomID();

			let home_embed = [{
				author: {
					name: owner.globalName || owner.username,
					icon_url: owner.displayAvatarURL({ size: 2048 }),
				},
				description: `- Total commands: ${i}\n- Type \`${prefix}help <command>\` for more info on a command`,
				fields: [
					{
						name: '__Primary__',
						value: '<:Security:968780008602599444> Antinuke\n<:Moderation:968780386882695178> Moderation\n<a:giveaways:1099213761467924480> Giveaways\n<a:welcome:1020270145597362247> Welcomer\n<:automod:1090896262905212989> AutoMod',
						inline: true,
					},
					{
						name: '__Add-ons__',
						value: '<:loggings:1051012702044160021> Logging\n🖼️ Media\n<:games:1090890955550380082> Games\n<a:utility:1090890047382880286> Utility\n<:voice:968786121578393630>VC Roles',
						inline: true,
					},
					{
						name: '__Links__',
						value: `- Click **[here](https://discord.com/api/oauth2/authorize?client_id=921680086829260821&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.gg%2FPpjXzymPHY&response_type=code&scope=guilds%20bot%20applications.commands)** to add me!\n- Join **[Support Server](https://discord.gg/PpjXzymPHY)** for help.`,
						inline: false,
					}
				],
				footer: {
					text: `Desired by ${ctx.interaction.user?.username}`,
					icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
				},
				color: 16705372,
				thumbnail: {
					url: ctx.client.user?.displayAvatarURL({ size: 2048 }),
				},
				timestamp: new Date(),
			}];

			const msg = await ctx.interaction.reply({
				fetchReply: true,
				allowedMentions: { repliedUser: false },
				contents: `Hey ${ctx.client.owners.includes(ctx.interaction.user?.id) ? 'Developer' : `<@${ctx.interaction.user.id}>`}, here is the list of commands for you to choose from!`,
				embeds: home_embed,
				components: [
					{
						type: 1,
						components: [{
							type: 3,
							placeholder: 'Select a category to view',
							min_values: 1,
							max_values: 1,
							custom_id: select,
							options: [
								{
									label: 'Home',
									description: 'Go to the home page of the help menu',
									value: 'home',
									emoji: {
										'name': '🏠',
										'id': null,
									},
								},
								{
									label: 'Antinuke',
									description: 'Get information on the Antinuke command',
									value: 'antinuke',
									emoji: {
										'name': 'Security',
										'id': '968780008602599444',
									},
								},
								{
									label: 'Moderation',
									description: 'Get information on the moderation commands',
									value: 'moderation',
									emoji: {
										'name': 'Moderation',
										'id': '968780386882695178',
									},
								},
								{
									label: 'Logging',
									description: 'Get information on the logging commands',
									value: 'loggings',
									emoji: {
										'name': 'loggings',
										'id': '1051012702044160021',
									},
								},
								{
									label: 'Giveaways',
									description: 'Get information on the giveaway commands',
									value: 'giveaways',
									emoji: {
										'name': 'giveaways',
										'id': '1099213761467924480',
									},
								},
								{
									label: 'Welcomer',
									description: 'Get information on the greet commands',
									value: 'welcomer',
									emoji: {
										'name': 'welcome',
										'id': '1020270145597362247',
									},
								},
								{
									label: 'AutoMod',
									description: 'Get information on the automod commands',
									value: 'automod',
									emoji: {
										'name': 'automod',
										'id': '1090896262905212989',
									},
								},
								{
									label: 'Media',
									description: 'Get information on the media commands',
									value: 'media',
									emoji: {
										'name': '🖼️',
										'id': null,
									},
								},
								{
									label: 'Games',
									description: 'Get information on the games commands',
									value: 'games',
									emoji: {
										'name': 'games',
										'id': '1090890955550380082',
									},
								},
								{
									label: 'Utility',
									description: 'Get information on the utility commands',
									value: 'utility',
									emoji: {
										'name': 'utility',
										'id': '1090890047382880286',
									},
								},
								{
									label: 'VC Roles',
									description: 'Get information on the vc roles commands',
									value: 'vcroles',
									emoji: {
										'name': 'voice',
										'id': '968786121578393630',
									},
								},
							],
						}],
					},
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
					}
				],
			});

			let page = 0;
			let total_pages = msg.components[0].components[0].options.length - 1;

			const collector = msg.createMessageComponentCollector({
				time: 120000,
			});

			collector.on('collect', async (i) => {
				if (i.user?.id !== ctx.interaction.user?.id) {
					return i.reply({
						content: `${process.env.FAILURE_EMOJI} | You are not allowed to use this button!`,
						ephemeral: true,
					});
				}

				await i.deferUpdate();
				await collector.resetTimer();

				if (i.customId === select) page = msg.components[0].components[0].options.findIndex((option) => option.value === i.values[0]);
				else if (i.customId === start) page = 0;
				else if (i.customId === prev) page -= 1;
				else if (i.customId === stop) return collector.stop();
				else if (i.customId === next) page += 1;
				else if (i.customId === end) page = total_pages;

				if (page === 0) {
					await msg?.edit({
						contents: `Hey ${ctx.client.owners.includes(ctx.interaction.user?.id) ? 'Developer' : `<@${ctx.interaction.user.id}>`}, here is the list of commands for you to choose from!`,
						embeds: home_embed,
						components: [
							{
								type: 1,
								components: msg.components[0].components.map((component) => {
									return component.data;
								})
							},
							{
								type: 1,
								components: msg.components[1].components.map((component, index) => {
									if (index === 0 || index === 1) {
										component.data.disabled = true;
									} else {
										component.data.disabled = false;
									}
									return component.data;
								})
							}
						]
					});
				} else {
					const subCommands = [];
					const category_name = msg.components[0].components[0].options[page].value.charAt(0).toUpperCase() + msg.components[0].components[0].options[page].value.slice(1);
					const directory = fs.readdirSync(`./Src/Interface/Commands/App/${category_name}`).filter((files) => files.endsWith('.js')).map((file) => `${require(`../../App/${category_name}/${file}`).name}`);

					for (const command of directory) {
						const foundCommand = slashCommands.find((cmd) => cmd.name === command);
						if (foundCommand.options) {
							let found = false;
							for (const option of foundCommand.options) {
								if (option.choices) {
									const choicesNames = option.choices.map(choice => choice.name);
									for (const choiceName of choicesNames) {
										subCommands.push(`\`${foundCommand.name} ${choiceName}\``.toLowerCase());
									}
									found = true;
								} else if (option.type === 1) {
									subCommands.push(`\`${foundCommand.name} ${option.name}\``.toLowerCase());
									found = true;
								}
							}
							if (!found) {
								subCommands.push(`\`${foundCommand.name}\``.toLowerCase());
							}
						} else {
							subCommands.push(`\`${foundCommand.name}\``.toLowerCase());
						}
					}

					await msg?.edit({
						content: null,
						embeds: [{
							title: `${msg.components[0].components[0].options[page].emoji.id ? ctx.client.emojis.cache.get(msg.components[0].components[0].options[page].emoji.id) : msg.components[0].components[0].options[page].emoji.name} __${msg.components[0].components[0].options[page].label} (${subCommands.length})__`,
							description: `>>> ${subCommands.join(', ')}`,
							footer: {
								text: `Developed by ${owner.globalName || owner.username}`,
								iconURL: owner.displayAvatarURL({ size: 2048 }),
							},
							color: 16705372,
							timestamp: new Date(),
						}],
						components: [
							{
								type: 1,
								components: msg.components[0].components.map((component) => {
									return component.data;
								})
							},
							{
								type: 1,
								components: msg.components[1].components.map((component, index) => {
									if ((index === 0 || index === 1) && page === 0) {
										component.data.disabled = true;
									} else if ((index === 3 || index === 4) && page === total_pages) {
										component.data.disabled = true;
									} else {
										component.data.disabled = false;
									}
									return component.data;
								})
							}
						]
					});
				}
			});

			collector.on('end', async (collected, reason) => {
				await msg?.edit({
					components: [
						{
							type: 1,
							components: [{
								type: 3,
								placeholder: 'This select menu has expired!',
								max_values: 1,
								min_values: 1,
								custom_id: select,
								disabled: true,
								options: msg.components[0].components[0].options,
							}],
						},
						{
							type: 1,
							components: msg.components[1].components.map((component) => {
								component.data.disabled = true;
								return component.data;
							})
						}
					]
				});
			});
		} else {
			let cmd = ctx.client.slashCommands.get(command_name?.toLowerCase()) || ctx.client.slashCommands.get(command_name) || ctx.client.slashCommands.find(c => c.aliases && c.aliases.includes(command_name?.toLowerCase()));

			if (cmd?.aliases?.includes(command_name?.toLowerCase())) {
				cmd = ctx.client.slashCommands.get(cmd.name);
			}

			if (!cmd) {
				const cmds = ctx.client.slashCommands.filter(c => c.name.startsWith(command_name.charAt(0)) && c.name.endsWith(command_name.charAt(command_name.length - 1)));
				if (cmds.size === 0) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | No command found with the name \`${command_name}\``,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				return ctx.interaction.reply({
					embeds: [{
						description: `Could not find the \`${command_name}\` command`,
						color: 16705372,
						fields: [{
							name: 'Did you possibly mean:',
							value: cmds.map((r) => r).map((r, i) => `\`[${i + 1}]\` ${r.name}`).join('\n'),
							inline: false,
						}],
					}],
				});
			}

			const embed = new EmbedBuilder()
				.setAuthor({
					name: `${cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1)}`,
					iconURL: ctx.client.user?.displayAvatarURL({ size: 2048 }),
				})
				.setColor(16705372)
				.setFooter({
					text: `Desired by ${ctx.interaction.user?.username}`,
					iconURL: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
				});

			if (cmd?.type === 2) {
				embed
					.setDescription('__**USER CONTEXT MENU**__\n\nRight-click on a user, go to Apps, and choose a command directed towards a specific user?.\nAn example image is given below.')
					.setImage('https://support.discord.com/hc/article_attachments/8425006586647/context_menu.png');
				return ctx.interaction.reply({
					embeds: [embed],
					components: [{
						type: 1,
						components: [
							{
								type: 2,
								label: 'User Context Menu',
								url: 'https://support.discord.com/hc/en-us/articles/8420602109207-Message-Content-Privileged-Intent-Launch-Will-it-affect-me-#h_01GBAXTZ1KR7ZPT7XAZMCDM3EQ',
								style: 5,
							},
						],
					}],
				});
			}
			else if (cmd?.type === 3) {
				embed
					.setDescription('__**MESSAGE CONTEXT MENU**__\n\nRight-click on a message, go to Apps, and choose a command directed towards a specific message.\nAn example image is given below.')
					.setImage('https://support.discord.com/hc/article_attachments/8425006607639/d912a955d79aada8839222b2a12e4633.png');
				return ctx.interaction.reply({
					embeds: [embed],
					components: [{
						type: 1,
						components: [
							{
								type: 2,
								label: 'Message Context Menu',
								url: 'https://support.discord.com/hc/en-us/articles/8420602109207-Message-Content-Privileged-Intent-Launch-Will-it-affect-me-#h_01GBAXTSE93H2VVVZKHK15X5RW',
								style: 5,
							},
						],
					}],
				});
			}

			embed
				.setDescription(`> ${cmd.description}\n\nNote: \`[]\` is optional argument and \`<>\` is required argument`)
				.addFields({
					name: 'Usage',
					value: `\`${cmd.usage}\``,
					inline: false,
				});
			if (cmd.userPermissions) {
				embed.addFields({
					name: 'Usable by',
					value: `\`${cmd.userPermissions}\``,
					inline: false,
				});
			}
			if (cmd.aliases) {
				embed.addFields({
					name: 'Aliases',
					value: `\`${cmd.aliases.join(', ')}\``,
					inline: false,
				});
			}

			ctx.interaction.reply({
				embeds: [embed],
			});
		}
	},
});
