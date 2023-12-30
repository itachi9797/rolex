const App = require('../../../../Structures/Core/App');
const Owners = require('../../../../Database/Schemas/owners');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'gstart',
	description: 'Starts a giveaway!',
	usage: '(/): gstart <duration> <winners> <prize> [required_role] [channel] [host] [color] [reaction] [thumbnail] [image]\n\n(Legacy): gstart <duration> <winners> <prize>',
	userPermissions: ['Manage Server'],
	options: [{
		name: 'duration',
		description: 'The duration of the giveaway',
		type: 3,
		required: true,
	},
	{
		name: 'winners',
		description: 'The amount of winners',
		type: 4,
		required: true,
	},
	{
		name: 'prize',
		description: 'The prize of the giveaway',
		type: 3,
		required: true,
	},
	{
		name: 'required_role',
		description: 'Required role to enter the giveaway',
		type: 8,
		required: false,
	},
	{
		name: 'channel',
		description: 'The channel to start the giveaway in',
		type: 7,
		required: false,
		channel_types: [0],
	},
	{
		name: 'host',
		description: 'The host of the giveaway',
		type: 6,
		required: false,
	},
	{
		name: 'color',
		description: 'The color of the giveaway embed',
		type: 3,
		required: false,
	},
	{
		name: 'reaction',
		description: 'The reaction of the giveaway',
		type: 3,
		required: false,
	},
	{
		name: 'thumbnail',
		description: 'The thumbnail of the giveaway',
		type: 3,
		required: false,
	},
	{
		name: 'image',
		description: 'The image of the giveaway',
		type: 3,
		required: false,
	},
	],
	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.interaction.guild.id,
		});

		const giveawayRole = ctx.interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'giveaways');

		if (!ctx.interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id)) && !ctx.interaction.member?.roles.cache.has(giveawayRole?.id)) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You need the \`Manage Server\` permissions or Giveaways role to start a giveaway!`,
				ephemeral: true,
			});
		}

		const channel = ctx.interaction.options.getChannel('channel') || ctx.interaction.channel;

		if (channel?.type !== 0) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You can start giveaways only in text channels!`,
				ephemeral: true,
			});
		}

		if (!channel?.permissionsFor(ctx.client.user).has(PermissionsBitField.Flags.SendMessages) || !channel?.permissionsFor(ctx.client.user).has(PermissionsBitField.Flags.EmbedLinks) || !channel?.permissionsFor(ctx.client.user).has(PermissionsBitField.Flags.AddReactions)) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | I don't have \`Send Messages\`, \`Embed Links\` or \`Add Reaction\` permissions in that channel!`,
				ephemeral: true,
			});
		}

		const duration = ctx.interaction.options.getString('duration');
		const winnerCount = ctx.interaction.options.getInteger('winners');
		const prize = ctx.interaction.options.getString('prize');
		const hostedBy = ctx.interaction.options.getUser('host') || ctx.interaction.user;
		const thumbnail = ctx.interaction.options.getString('thumbnail') || null;
		const image = ctx.interaction.options.getString('image') || null;
		const color = ctx.interaction.options.getString('color') || null;
		const reaction = ctx.interaction.options.getString('reaction') || '<a:giveaways:1099213761467924480>';
		const role = ctx.interaction.options.getRole('required_role') || ctx.interaction.guild.roles.everyone;

		if (duration.length > 10) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | The duration cannot be longer than 10 characters.`,
				ephemeral: true,
			});
		}

		if (winnerCount <= 0) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | The winner count must be a positive number.`,
				ephemeral: true,
			});
		}

		if (winnerCount > 25) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | The winner count cannot be more than 25.`,
				ephemeral: true,
			});
		}

		if (prize.length > 200) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | The prize cannot be longer than 200 characters.`,
				ephemeral: true,
			});
		}

		if (role.managed) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | The role is managed by an integration.`,
				ephemeral: true,
			});
		}

		if (hostedBy.bot) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | The host cannot be a bot.`,
				ephemeral: true,
			});
		}

		if (thumbnail) {
			try {
				new URL(thumbnail);
			}
			catch (e) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | The thumbnail must be a valid url.`,
					ephemeral: true,
				});
			}
		}

		if (image) {
			try {
				new URL(image);
			}
			catch (e) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | The image must be a valid url.`,
					ephemeral: true,
				});
			}
		}

		if (color) {
			if (!color.startsWith('#')) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | The color must be a valid hex code.`,
					ephemeral: true,
				});
			}
			if (!color.replace('#', '').match(/[0-9A-Fa-f]{6}/g)) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | The color must be a valid hex code.`,
					ephemeral: true,
				});
			}
			const colorInt = parseInt(color.replace('#', ''), 16);

			if (colorInt < 0 || colorInt > 16777215) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | The color must be a valid hex code.`,
					ephemeral: true,
				});
			}
		}

		if (reaction.startsWith('<a:') && reaction.endsWith('>')) {
			const emoji = ctx.client.emojis.cache.get(reaction.split(':')[2].replace('>', ''));
			if (!emoji) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | The reaction must be a valid emoji.`,
					ephemeral: true,
				});
			}
		}
		else if (reaction.startsWith('<:') && reaction.endsWith('>')) {
			const emoji = ctx.client.emojis.cache.get(reaction.split(':')[2].replace('>', ''));
			if (!emoji) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | The reaction must be a valid emoji.`,
					ephemeral: true,
				});
			}
		}
		else if (!reaction.match(/[\u2700-\u27BF]|(?:\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F])/g)) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | The reaction must be a valid emoji.`,
				ephemeral: true,
			});
		}

		const multipliers = {
			ms: 1,
			s: 1000,
			m: 60 * 1000,
			h: 60 * 60 * 1000,
			d: 24 * 60 * 60 * 1000,
		};

		const timeUnit = duration.slice(-1);
		if (!multipliers[timeUnit]) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | Invalid time unit! Please use one of the following: \`ms\`, \`s\`, \`m\`, \`h\`, \`d\``,
				ephemeral: true,
			});
		}

		const timeValue = parseInt(duration.slice(0, -1));
		if (isNaN(timeValue)) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | Invalid time value! Please enter a valid time`,
				ephemeral: true,
			});
		}

		const timeInMs = timeValue * multipliers[timeUnit];

		if (hostedBy.id !== ctx.interaction.user?.id) {
			const msg = await ctx.interaction.reply({
				fetchReply: true,
				content: `Hey <@${hostedBy.id}>,`,
				embeds: [{
					color: 0x2F3136,
					description: `<@${ctx.interaction.user?.id}> wants to start a giveaway and selected you as the host of the giveaway! Are you sure you want to start a giveaway?\n\n__**Giveaway Details:**__\n •  Prize: ${prize}\n •  Channel: <#${channel?.id}>\n •  Duration: <t:${Math.floor(Date.now() / 1000) + (timeInMs / 1000)}:R>\n •  Winners: ${winnerCount}`,
					footer: {
						text: 'This confirmation will automatically cancel in 1 minute if you don\'t respond!',
					},
				}],
				components: [{
					type: 1,
					components: [{
						type: 2,
						style: 3,
						label: 'Yes',
						custom_id: 'gconfirmyes',
						emoji: {
							name: 'tick',
							id: '968773535914922014',
						},
					}, {
						type: 2,
						style: 4,
						label: 'No',
						custom_id: 'gconfirmno',
						emoji: {
							name: 'cross',
							id: '968773791943626762',
						},
					}],
				}],
			});

			const collector = msg.createMessageComponentCollector({
				time: 60000,
			});

			collector.on('collect', async (i) => {
				if (i.user?.id !== hostedBy.id) {
					return i.reply({
						content: `${process.env.FAILURE_EMOJI} | Only the giveaway host can respond to this confirmation!`,
						ephemeral: true,
					});
				}

				if (i.customId === 'gconfirmyes') {
					collector.stop();
					const winMessageEmbed = new EmbedBuilder()
						.setTitle('Giveaway Ended')
						.setDescription('<a:giveaways:1099213761467924480> Congratulations! You won **{this.prize}**!!\nPlease contact {this.hostedBy} to claim your prize.')
						.setColor(3092790);

					let hostedtext;
					if (role.id === ctx.interaction.guild.roles.everyone.id) {
						hostedtext = `Hosted by: {this.hostedBy}\n\n[Invite Me](${process.env.BOT_INVITE})`;
					}
					else {
						hostedtext = `Hosted by: {this.hostedBy}\n\n📣 Must have <@&${role.id}> role to enter!\n\n[Invite Me](${process.env.BOT_INVITE})`;
					}

					ctx.client.giveawaysManager
						.start(channel, {
							duration: timeInMs,
							winnerCount,
							prize,
							hostedBy: hostedBy,
							thumbnail: thumbnail,
							embedColor: color,
							reaction,
							image: image,
							exemptMembers: new Function(
								'member',
								'giveaway',
								`return !member?.roles.cache.has('${role.id}')`,
							),

							messages: {
								giveaway: '🎉 **Giveaway Started**',
								giveawayEnded: '🎉 **Giveaway Ended**',
								timeRemaining: 'Time remaining: **{duration}**!',
								inviteToParticipate: 'React with {this.reaction} to participate!\n',
								drawing: 'Drawing: {timestamp}',
								embedFooter: '{this.winnerCount} winner(s)',
								noWinner: 'Giveaway cancelled, no valid participations.',
								winMessage: {
									content: 'Congratulations, {winners}!',
									embed: winMessageEmbed,
									replyToGiveaway: true,
								},
								winners: 'Winner(s):',
								hostedBy: hostedtext,
								endedAt: 'Ended at',
								units: {
									seconds: 'seconds',
									minutes: 'minutes',
									hours: 'hours',
									days: 'days',
									pluralS: false,
								},
							},
						}).then((data) => {
							ctx.interaction.editReply({
								content: null,
								embeds: [{
									title: 'Giveaway Started',
									description: `The giveaway for ${data.prize} has been created in <#${data.channelId}>\n\n[Click Me to Jump there](https://discord.com/channels/${data.guildId}/${data.channelId}/${data.messageId})!`,
									color: 16705372,
								}],
								components: [],
							}).then(() => {
								setTimeout(() => {
									ctx.interaction.deleteReply();
								}, 15000);
							});
						});
				}
				else if (i.customId === 'gconfirmno') {
					collector.stop();
					return ctx.interaction.editReply({
						content: null,
						embeds: [{
							title: 'Giveaway Cancelled!',
							color: 0x2F3136,
							description: `Hey <@${ctx.interaction.user?.id}>,\n\n<@${hostedBy.id}> cancelled the giveaway of ${prize} in <#${channel?.id}>!`,
						}],
						components: [],
					});
				}
			});

			collector.on('end', async (collected, reason) => {
				if (reason === 'time') {
					return ctx.interaction.editReply({
						content: null,
						embeds: [{
							title: 'Giveaway Cancelled!',
							color: 0x2F3136,
							description: `Hey <@${ctx.interaction.user?.id}>,\n\n\`${hostedBy.globalName !== null ? hostedBy.globalName : hostedBy.username}\` didn't repond in time :((!`,
						}],
						components: [{
							type: 1,
							components: [{
								type: 2,
								style: 3,
								label: 'Yes',
								custom_id: 'gconfirmyes',
								emoji: {
									name: 'tick',
									id: '968773535914922014',
								},
								disabled: true,
							}, {
								type: 2,
								style: 4,
								label: 'No',
								custom_id: 'gconfirmno',
								emoji: {
									name: 'cross',
									id: '968773791943626762',
								},
								disabled: true,
							}],
						}],
					});
				}
			});
		}
		else {
			const winMessageEmbed = new EmbedBuilder()
				.setTitle('Giveaway Ended')
				.setDescription('<a:giveaways:1099213761467924480> Congratulations! You won **{this.prize}**!!\nPlease contact {this.hostedBy} to claim your prize.')
				.setColor(3092790);

			let hostedtext;
			if (role.id === ctx.interaction.guild.roles.everyone.id) {
				hostedtext = `Hosted by: {this.hostedBy}\n\n[Invite Me](${process.env.BOT_INVITE})`;
			}
			else {
				hostedtext = `Hosted by: {this.hostedBy}\n\n📣 Must have <@&${role.id}> role to enter!\n\n[Invite Me](${process.env.BOT_INVITE})`;
			}

			ctx.client.giveawaysManager
				.start(channel, {
					duration: timeInMs,
					winnerCount,
					prize,
					hostedBy: hostedBy,
					thumbnail: thumbnail,
					embedColor: color,
					reaction,
					image: image,
					exemptMembers: new Function(
						'member',
						'giveaway',
						`return !member?.roles.cache.has('${role.id}')`,
					),

					messages: {
						giveaway: '🎉 **Giveaway Started**',
						giveawayEnded: '🎉 **Giveaway Ended**',
						timeRemaining: 'Time remaining: **{duration}**!',
						inviteToParticipate: 'React with {this.reaction} to participate!\n',
						drawing: 'Drawing: {timestamp}',
						embedFooter: '{this.winnerCount} winner(s)',
						noWinner: 'Giveaway cancelled, no valid participations.',
						winMessage: {
							content: 'Congratulations, {winners}!',
							embed: winMessageEmbed,
							replyToGiveaway: true,
						},
						winners: 'Winner(s):',
						hostedBy: hostedtext,
						endedAt: 'Ended at',
						units: {
							seconds: 'seconds',
							minutes: 'minutes',
							hours: 'hours',
							days: 'days',
							pluralS: false,
						},
					},
				}).then((data) => {
					ctx.interaction.reply({
						embeds: [{
							title: 'Giveaway Started',
							description: `The giveaway for ${data.prize} has been created in <#${data.channelId}>\n\n[Click Me to Jump there](https://discord.com/channels/${data.guildId}/${data.channelId}/${data.messageId})!`,
							color: 16705372,
						}],
						ephemeral: true,
					});
				});
		}
	},
});
