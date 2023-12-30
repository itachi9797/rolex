const App = require('../../../../Structures/Core/App');
const wait = require('node:timers/promises').setTimeout;

module.exports = new App({
	name: 'ping',
	description: 'Shows latency for the bot',
	aliases: ['pong'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const msg = await ctx.message.reply({
			content: 'Pinging...',
		});

		const currentNano = process.hrtime();
		await (require('mongoose')).connection.db.command({
			ping: 1,
		});
		const time = process.hrtime(currentNano);
		const dbPing = ((time[0] * 1e9 + time[1]) / 1e6).toFixed(2);

		await wait(300);
		msg.edit({
			content: `Pong🏓 : **${ctx.client.ws.ping}ms** | Database: **${dbPing}ms**`,
		});
		await wait(1000);
		msg.edit({
			content: `Pong🏓 : **${ctx.client.ws.ping}ms** | Database: **${dbPing}ms**\nYes I'm still alive, now stop pinging me!`,
		});
	},
});