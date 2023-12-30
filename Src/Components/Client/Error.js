const Component = require('../../Structures/Core/Component');
const { inspect } = require('util');

module.exports = new Component({
	name: 'error',
	/**
     * @param {Rolex} client
     */
	run: async (client, error) => {
		console.log('——————————[Discord.js Error/Catch]——————————\n', error);
		if (client.channels.cache.get(process.env.ERROR_LOG) === undefined) return;
		client.channels.cache.get(process.env.ERROR_LOG).send({
			embeds: [{
				title: 'Discord.js Error/Catch',
				description: `**Error**\n\`\`\`js\n${inspect(error, { depth: 0 })}\`\`\``,
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
					url: 'https://discordjs.guide/popular-topics/errors.html#api-errors',
					style: 5,
				},
				{
					type: 2,
					label: 'DJS Support',
					url: 'https://discord.gg/djs',
					style: 5,
				},
				],
			}],
		});
	},
});