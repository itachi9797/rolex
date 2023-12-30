const Component = require('../../Structures/Core/Component');
const { inspect } = require('util');

module.exports = new Component({
	name: 'uncaughtExceptionMonitor',
	/**
     * @param {Rolex} client
     */
	run: async (client, err, origin) => {
		console.log('——————————[Uncaught Exception Monitor/Catch]——————————\n', err, origin);
		if (client.channels.cache.get(process.env.ERROR_LOG) === undefined) return;
		client.channels.cache.get(process.env.ERROR_LOG).send({
			embeds: [{
				title: 'Uncaught Exception Monitor/Catch',
				description: `**Error**\n\`\`\`js\n${inspect(err, { depth: 0 })}\`\`\``,
				fields: [{
					name: 'Origin',
					value: `\`\`\`js\n${inspect(origin, { depth: 0 })}\`\`\``,
					inline: false,
				}],
				color: 16705372,
				footer: {
					text: `${client.user?.globalName || client.user?.username} Error Handling`,
					icon_url: client.user?.displayAvatarURL({ size: 2048 }),
				},
			}],
			components: [{
				type: 1,
				components: [{
					type: 2,
					label: 'Solution!',
					url: 'https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor',
					style: 5,
				},
				{
					type: 2,
					label: 'The Coding Den',
					url: 'https://discord.gg/code',
					style: 5,
				},
				],
			}],
		});
	},
});
