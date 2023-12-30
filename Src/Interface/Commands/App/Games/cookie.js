const App = require('../../../../Structures/Core/App');
const wait = require('node:timers/promises').setTimeout;

module.exports = new App({
	name: 'cookie',
	description: 'First one to eat the cookie wins!',
	usage: 'cookie',
	aliases: ['eatcookie', 'eat', 'biscuit'],

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
				description: 'First one to eat the cookie wins!',
				color: 16705372,
			}],
			fetchReply: true
		});

		await wait(500);
		try {
			await msg.edit({
				embeds: [{
					description: '3',
					color: 16705372,
				}],
				fetchReply: true
			});
		}
		catch (e) {
			return;
		}

		await wait(100);
		try {
			await msg.edit({
				embeds: [{
					description: '3',
					color: 16705372,
				}],
				fetchReply: true
			});
		}
		catch (e) {
			return;
		}

		await wait(100);
		try {
			await msg.edit({
				embeds: [{
					description: '1',
					color: 16705372,
				}],
				fetchReply: true
			});
		}
		catch (e) {
			return;
		}

		await wait(100);
		try {
			await msg.edit({
				embeds: [{
					description: 'Eat the cookie!',
					color: 16705372,
				}],
				fetchReply: true
			});
		}
		catch (e) {
			return;
		}
		await msg.react('🍪');

		const filter = (reaction, user) => {
			return reaction.emoji.name === '🍪' && !user?.bot && reaction.timestamp === Date.now().timestamp;
		};

		const collector = msg.createReactionCollector({
			filter,
			max: 1,
			time: 20000,
		});

		collector.on('collect', (reaction, user) => {
			try {
				msg.edit({
					embeds: [{
						description: `<@${user?.id}> has eaten the cookie!`,
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
					return msg.edit({
						embeds: [{
							description: 'No one ate the cookie!',
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
