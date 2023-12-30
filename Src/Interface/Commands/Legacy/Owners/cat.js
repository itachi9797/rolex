const fs = require('fs');

module.exports = {
	name: 'cat',
	description: 'Display the content of a file',
	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {

		if (!ctx.client.owners.includes(ctx.message.author?.id)) return;
		const args = ctx.message.content.split(' ').slice(1);

		if (!args.length) {
			return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a file path.`).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const filePath = args[0];

		fs.readFile(filePath, 'utf8', async (err, data) => {
			if (err) {
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | An error occurred while reading the file:\n\`\`\`js${err}\`\`\``);
			}

			data = process.env.TOP_GG_TOKEN ? data.replace(new RegExp(ctx.client.token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[Client Access Token]').replace(new RegExp(process.env.MONGO_STRING.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[MongoDB Access Token]').replace(new RegExp(process.env.TOP_GG_TOKEN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[Top.gg Access Token]') : data.replace(new RegExp(ctx.client.token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[Client Access Token]').replace(new RegExp(process.env.MONGO_STRING.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[MongoDB Access Token]');

			if (data.length > 1500) {
				const msg = await ctx.message.reply({
					content: `\`\`\`js\n${data.substring(0, 1500)}\n\`\`\` \n Page 1/${Math.ceil(data.length / 1500)}`,
					components: [{
						type: 1,
						components: [
							{
								type: 2,
								style: 2,
								custom_id: 'catprev',
								emoji: {
									name: '⬅️',
								},
								disabled: true,
							},
							{
								type: 2,
								style: 2,
								custom_id: 'catstop',
								emoji: {
									name: '⏹️',
								},
								disabled: false,
							},
							{
								type: 2,
								style: 2,
								custom_id: 'catnext',
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

					if (i.customId === 'catprev') {
						page = page > 1 ? --page : Math.ceil(data.length / 1500);
					}

					if (i.customId === 'catnext') {
						page = page + 1 <= Math.ceil(data.length / 1500) ? ++page : 1;
					}

					if (i.customId === 'catstop') {
						i.deferUpdate();
						return collector.stop('time');
					}

					await i.update({
						content: `\`\`\`js\n${data.substring((page - 1) * 1500, page * 1500)}\n\`\`\` \n Page ${page}/${Math.ceil(data.length / 1500)}`,
						components: [{
							type: 1,
							components: [{
								type: 2,
								style: 2,
								custom_id: 'catprev',
								emoji: {
									name: '⬅️',
								},
								disabled: page === 1,
							},
							{
								type: 2,
								style: 2,
								custom_id: 'catstop',
								emoji: {
									name: '⏹️',
								},
								disabled: false,
							},
							{
								type: 2,
								style: 2,
								custom_id: 'catnext',
								emoji: {
									name: '➡️',
								},
								disabled: page === Math.ceil(data.length / 1500),
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
									custom_id: 'catprev',
									emoji: {
										name: '⬅️',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 2,
									custom_id: 'catstop',
									emoji: {
										name: '⏹️',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 2,
									custom_id: 'catnext',
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
				return ctx.message.reply(`\`\`\`js\n${data}\n\`\`\``);
			}
		});
	},
};