const App = require('../../../../Structures/Core/App');
const wait = require('node:timers/promises').setTimeout;

module.exports = new App({
	name: 'ping',
	description: 'Shows latency for the bot',
	usage: 'ping',
	aliases: ['pong'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		await ctx.interaction.reply({
			content: 'Pinging...',
		});
		const currentNano = process.hrtime();
		await (require('mongoose')).connection.db.command({
			ping: 1,
		});
		const time = process.hrtime(currentNano);
		const dbPing = ((time[0] * 1e9 + time[1]) / 1e6).toFixed(2);

		await wait(300);
		ctx.interaction.editReply({
			content: `Pong🏓 : **${ctx.client.ws.ping}ms** | Database: **${dbPing}ms**`,
		});
		await wait(1000);
		ctx.interaction.editReply({
			content: `Pong🏓 : **${ctx.client.ws.ping}ms** | Database: **${dbPing}ms**\nYes I'm still alive, now stop pinging me!`,
		});
	},
});