const App = require('../../../../Structures/Core/App');

module.exports = new App({
	name: '10s',
	description: '10 seconds of fun',
	usage: '10s',

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const msg = await ctx.interaction.reply({
			embeds: [{
				author: {
					name: ctx.interaction.user?.username,
					icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
				},
				description: 'Click on the reaction after 10 seconds',
				color: 16705372,
			}],
			fetchReply: true
		});
		try {
			await msg.react('👍');
		}
		catch (e) {
			return;
		}

		const filter = (reaction, user) => {
			return reaction.emoji.name === '👍' && user?.id === ctx.interaction.user?.id;
		};
		const start = process.hrtime();
		const collector = msg.createReactionCollector({
			filter,
			max: 1,
			time: 20000,
		});

		collector.on('collect', (reaction, user) => {
			const end = process.hrtime(start);

			try {
				msg.edit({
					embeds: [{
						author: {
							name: ctx.interaction.user?.username,
							icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
						},
						description: 'You have reacted to the message in `' + end[0] + '` seconds.',
						color: 16705372,
					}],

				});
			}
			catch (e) {
				return;
			}
		});

		collector.on('end', (collected, reason) => {
			if (reason === 'time') {
				try {
					msg.reactions.removeAll();
				}
				catch (e) {
					return;
				}
				try {
					return ctx.interaction.channel?.send({
						content: `Hey <@${ctx.interaction.user?.id}>! It's been 20 seconds since you started a 10s game... I cancelled the game, but you can play again!`,
					});
				}
				catch (e) {
					return;
				}
			}
			else return;
		});
	},
});
