const App = require('../../../../Structures/Core/App');
const { inspect } = require('util');
const { version } = require('discord.js');

module.exports = new App({
	name: 'eval',
	description: 'Evaluates a code',
	usage: 'eval <code>',
	aliases: ['evaluate', 'e', 'run'],
	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const client = ctx.client;
		const message = ctx.message;

		if (!client.owners.includes(message.author?.id)) return;
		const code = message.content.split(' ').slice(1).join(' ');

		if (!code) {
			return message.reply({
				content: `Eval v2.0.0, discord.js \`${version}\`, \`Node.js ${process.version}\` on \`${require('os').platform()}\`\nProcess started at <t:${Math.floor(client.readyTimestamp / 1000)}:R>, bot was ready at <t:${Math.floor(client.readyAt / 1000)}:R>.\n\nUsing ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB at this process.\nRunning on PID ${process.pid}\n\nThis bot is ${client.shard ? '' : 'not '}sharded and can see ${client.guilds.cache.size} guild(s) and ${client.users.cache.size} user(s).\n\`GuildPresences\` intent is ${client.options.intents.has('GuildPresences') ? 'enabled' : 'disabled'}, \`GuildMembers\` intent is ${client.options.intents.has('GuildMembers') ? 'enabled' : 'disabled'} and \`MessageContent\` intent is ${client.options.intents.has('GuildMessages') ? 'enabled' : 'disabled'}.\nAverage websocket latency: ${client.ws.ping}ms`,
			});
		}

		let output;
		try {
			output = await eval(code);
		}
		catch (e) {
			return ctx.message.reply({ content: `\`\`\`js\n${e}\n\`\`\`` });
		}

		if (output instanceof Promise || (Boolean(output) && typeof output.then === 'function' && typeof output.catch === 'function')) output = await output;
		output = inspect(output, {
			depth: 0,
			maxArrayLength: null,
		});

		output = process.env.TOP_GG_TOKEN ? output.replace(new RegExp(ctx.client.token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[Client Access Token]').replace(new RegExp(process.env.MONGO_STRING.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[MongoDB Access Token]').replace(new RegExp(process.env.TOP_GG_TOKEN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[Top.gg Access Token]') : output.replace(new RegExp(ctx.client.token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[Client Access Token]').replace(new RegExp(process.env.MONGO_STRING.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[MongoDB Access Token]');

		if (output.length > 1500) {
			const msg = await ctx.message.reply({
				content: `\`\`\`js\n${output.substring(0, 1500)}\n\`\`\` \n Page 1/${Math.ceil(output.length / 1500)}`,
				components: [{
					type: 1,
					components: [
						{
							type: 2,
							style: 2,
							custom_id: 'evalprev',
							emoji: {
								name: '⬅️',
							},
							disabled: true,
						},
						{
							type: 2,
							style: 2,
							custom_id: 'evalstop',
							emoji: {
								name: '⏹️',
							},
							disabled: false,
						},
						{
							type: 2,
							style: 2,
							custom_id: 'evalnext',
							emoji: {
								name: '➡️',
							},
							disabled: false,
						},
					],
				}],
			});

			const collector = msg.createMessageComponentCollector({
				time: 60000,
			});

			let page = 1;

			collector.on('collect', async (i) => {
				if (i.user?.id !== ctx.message.author?.id) {
					return i.reply({
						content: `${process.env.FAILURE_EMOJI} | You are not allowed to use this button!`,
						ephemeral: true,
					});
				}

				if (i.customId === 'evalprev') {
					page = page > 1 ? --page : Math.ceil(output.length / 1500);
				}

				if (i.customId === 'evalnext') {
					page = page + 1 <= Math.ceil(output.length / 1500) ? ++page : 1;
				}

				if (i.customId === 'evalstop') {
					i.deferUpdate();
					return collector.stop('time');
				}

				await i.update({
					content: `\`\`\`js\n${output.substring((page - 1) * 1500, page * 1500)}\n\`\`\` \n Page ${page}/${Math.ceil(output.length / 1500)}`,
					components: [{
						type: 1,
						components: [{
							type: 2,
							style: 2,
							custom_id: 'evalprev',
							emoji: {
								name: '⬅️',
							},
							disabled: page === 1,
						},
						{
							type: 2,
							style: 2,
							custom_id: 'evalstop',
							emoji: {
								name: '⏹️',
							},
							disabled: false,
						},
						{
							type: 2,
							style: 2,
							custom_id: 'evalnext',
							emoji: {
								name: '➡️',
							},
							disabled: page === Math.ceil(output.length / 1500),
						},
						],
					}],
				});
				collector.resetTimer();
			});

			collector.on('end', async (collected, reason) => {
				if (reason === 'time') {
					await msg.edit({
						components: [{
							type: 1,
							components: [{
								type: 2,
								style: 2,
								custom_id: 'evalprev',
								emoji: {
									name: '⬅️',
								},
								disabled: true,
							},
							{
								type: 2,
								style: 2,
								custom_id: 'evalstop',
								emoji: {
									name: '⏹️',
								},
								disabled: true,
							},
							{
								type: 2,
								style: 2,
								custom_id: 'evalnext',
								emoji: {
									name: '➡️',
								},
								disabled: true,
							},
							],
						}],
					});
				}
			});
		}
		else {
			ctx.message.reply({ content: `\`\`\`js\n${output}\n\`\`\`` });
		}
	},
});
