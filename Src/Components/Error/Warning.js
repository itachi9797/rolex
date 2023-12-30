const Component = require('../../Structures/Core/Component');
const { inspect } = require('util');

module.exports = new Component({
	name: 'warning',
	/**
     * @param {Rolex} client
     */
	run: async (client, warn) => {
		console.log('——————————[Warning/Catch]——————————\n', warn);
		if (client.channels.cache.get(process.env.ERROR_LOG) === undefined) return;
		client.channels.cache.get(process.env.ERROR_LOG).send({
			embeds: [{
				title: 'Warning/Catch',
				description: `**Warn**\n\`\`\`js\n${inspect(warn, { depth: 0 })}\`\`\``,
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
					url: 'https://nodejs.org/api/process.html#event-unhandledrejection',
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