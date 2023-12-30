const App = require('../../../../Structures/Core/App');
const Owners = require('../../../../Database/Schemas/owners');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'gstart',
	description: 'Starts a giveaway!',
	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});

		const giveawayRole = ctx.message.guild.roles.cache.find(r => r.name.toLowerCase() === 'giveaways');

		if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id)) && !ctx.message.member?.roles.cache.has(giveawayRole?.id)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You need the \`Manage Server\` permissions or Giveaways role to start a giveaway!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const channel = ctx.message.channel;

		if (!channel?.permissionsFor(ctx.client.user).has(PermissionsBitField.Flags.SendMessages) || !channel?.permissionsFor(ctx.client.user).has(PermissionsBitField.Flags.EmbedLinks) || !channel?.permissionsFor(ctx.client.user).has(PermissionsBitField.Flags.AddReactions)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I don't have \`Send Messages\`, \`Embed Links\` or \`Add Reaction\` permissions in this channel!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const duration = ctx.message.content.split(' ').slice(1).shift();

		if (!duration) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You have to specify a valid duration! Use slash command for better experience and more features.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		let winnerCount = parseInt(ctx.message.content.split(' ').slice(2).shift());

		if (!winnerCount) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You have to specify a valid winner count! Use slash command for better experience and more features.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (winnerCount.toString().endsWith('w')) {
			winnerCount = winnerCount.toString().slice(0, -1);
		}

		const prize = ctx.message.content.split(' ').slice(3).join(' ');

		if (!prize) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You have to specify a prize! Use slash command for better experience and more features.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const hostedBy = ctx.message.author;
		const reaction = '<a:giveaways:1099213761467924480>';

		if (duration.length > 10) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | The duration cannot be longer than 10 characters.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (isNaN(winnerCount)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | The winner count must be a number.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (winnerCount <= 0) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | The winner count must be a positive number.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (winnerCount > 25) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | The winner count cannot be more than 25.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (prize.length > 200) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | The prize cannot be longer than 200 characters.`,
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

		const timeUnit = duration.slice(-1);
		if (!multipliers[timeUnit]) {
			return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Invalid time unit! Please use one of the following: \`ms\`, \`s\`, \`m\`, \`h\`, \`d\``).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const timeValue = parseInt(duration.slice(0, -1));
		if (isNaN(timeValue)) {
			return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Invalid time value! Please enter a valid time`).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const timeInMs = timeValue * multipliers[timeUnit];

		const winMessageEmbed = new EmbedBuilder()
			.setTitle('Giveaway Ended')
			.setDescription('<a:giveaways:1099213761467924480> Congratulations! You won **{this.prize}**!!\nPlease contact {this.hostedBy} to claim your prize.')
			.setColor(3092790);

		ctx.client.giveawaysManager
			.start(channel, {
				duration: timeInMs,
				winnerCount,
				prize,
				hostedBy: hostedBy,
				reaction,
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
					hostedBy: `Hosted by: {this.hostedBy}\n\n[Invite Me](${process.env.BOT_INVITE})`,
					winners: 'Winner(s):',
					endedAt: 'Ended at',
					units: {
						seconds: 'seconds',
						minutes: 'minutes',
						hours: 'hours',
						days: 'days',
						pluralS: false,
					},
				},
			}).then(async () => {
				try {
					await ctx.message?.react(ctx.client.emojis.cache.get('968773535914922014'));
				}
				catch {
					return;
				}
			});
	},
});
