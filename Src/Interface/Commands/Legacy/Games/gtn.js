const App = require('../../../../Structures/Core/App');

module.exports = new App({
	name: 'gtn',
	description: 'Guess the number!!',
	aliases: ['guessthenumber'],
	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const number = Math.floor(Math.random() * 100);
		let tries = 1;
		ctx.message.reply({
			content: 'Guess a number between 1 and 100. You have 10 tries. Good luck! :D',
		});
		const filter = (m) => m.author?.id === ctx.message.author?.id;
		const collector = ctx.message.channel?.createMessageCollector({
			filter,
			time: 30000,
		});
		collector?.on('collect', (m) => {
			if (tries >= 10) return collector.stop('max');
			if (isNaN(m.content)) {
				ctx.message.channel?.send({
					content: 'Please type a number.',
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
			if (m.content > number) {
				ctx.message.channel?.send({
					content: 'Your number is too big. Try a smaller number. You have ' + (10 - tries) + ' tries left.',
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
				collector.resetTimer();
			}
			if (m.content < number) {
				ctx.message.channel?.send({
					content: 'Your number is too small. Try a bigger number. You have ' + (10 - tries) + ' tries left.',
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
				collector.resetTimer();
			}
			if (m.content == number) {
				collector.stop('win');
			}
			if (!isNaN(m.content)) tries++;
		});
		collector?.on('end', (collected, reason) => {
			if (reason === 'max') {
				return ctx.message.channel?.send({
					content: 'You have reached the maximum tries. The number was ' + number + '.',
				});
			}
			if (reason === 'win') {
				return ctx.message.channel?.send({
					content: 'You have won! The number was ' + number + '. You have used ' + tries + ' tries.',
				});
			}
			if (reason === 'time') {
				return ctx.message.channel?.send({
					content: 'You have run out of time. The number was ' + number + '.',
				});
			}
		});
	},
});
