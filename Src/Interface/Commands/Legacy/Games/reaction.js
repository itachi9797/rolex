const App = require('../../../../Structures/Core/App');
const wait = require('node:timers/promises').setTimeout;

module.exports = new App({
	name: 'reaction',
	description: 'Let\'s see who gets the correct reaction first!',
	aliases: ['react'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const selection = ['☕', '🍵', '🍶', '🍾', '🍷', '🍸'];
		const botSelection = selection[Math.floor(Math.random() * selection.length)];
		const msg = await ctx.message.reply({
			embeds: [{
				title: 'Reaction Time',
				description: 'After 1 - 8 seconds, I will reveal the correct emoji. Click on it as fast as you can!',
				color: 16705372,
			}],
		});
		await Promise.all([
			msg.react('☕'),
			msg.react('🍵'),
			msg.react('🍶'),
			msg.react('🍾'),
			msg.react('🍷'),
			msg.react('🍸'),
		]);
		await wait(Math.floor(Math.random() * 7000) + 1000);
		try {
			await msg.edit({
				embeds: [{
					title: 'Reaction Time',
					description: 'Get ready! Revealing emoji.',
					color: 16705372,
				}],
			});
		}
		catch (e) {
			return;
		}
		await wait(Math.floor(Math.random() * 2000) + 1000);
		try {
			await msg.edit({
				embeds: [{
					title: 'Reaction Time',
					description: `The correct emoji is ${botSelection}`,
					color: 16705372,
				}],
			});
		}
		catch (e) {
			return;
		}

		const filter = (reaction, user) => {
			return reaction.emoji.name === botSelection && !user?.bot && reaction.timestamp === Date.now().timestamp;
		};

		const start = process.hrtime();

		const collector = msg.createReactionCollector({
			filter,
			time: 20000,
			max: 1,
		});

		collector.on('collect', (reaction, user) => {
			const end = process.hrtime(start);
			try {
				msg.edit({
					embeds: [{
						title: 'Reaction Time',
						description: `<@${user?.id}> reacted to the message in \`${end[0]}\` seconds.`,
						color: 16705372,
					}],
				});
			}
			catch (e) {
				return;
			}
		});
		collector.on('end', collected => {
			if (collected.size === 0) {
				try {
					msg.edit({
						embeds: [{
							title: 'Reaction Time',
							description: 'No one reacted to the message in time.',
							color: 16705372,
						}],
					});
				}
				catch (e) {
					return;
				}
			}
		});
	},
});