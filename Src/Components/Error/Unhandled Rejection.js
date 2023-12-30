const Component = require('../../Structures/Core/Component');
const { inspect } = require('util');

module.exports = new Component({
	name: 'unhandledRejection',
	/**
     * @param {Rolex} client
     */
	run: async (client, reason, p) => {
		console.log('——————————[Unhandled Rejection/Catch]——————————\n', reason, p);
		if (client.channels.cache.get(process.env.ERROR_LOG) === undefined) return;
		client.channels.cache.get(process.env.ERROR_LOG).send({
			embeds: [{
				title: 'Unhandled Rejection/Catch',
				description: `**Reason**\n\`\`\`js\n${inspect(reason, { depth: 0 })}\`\`\``,
				fields: [{
					name: 'Origin',
					value: `\`\`\`js\n${inspect(p, { depth: 0 })}\`\`\``,
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