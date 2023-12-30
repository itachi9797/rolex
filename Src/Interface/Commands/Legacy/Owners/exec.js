const { exec } = require('child_process');

module.exports = {
	name: 'exec',
	description: 'Run code in the shell',
	usage: 'exec <code>',
	aliases: ['execute'],
	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		try {
			if (!ctx.client.owners.includes(ctx.message.author?.id)) return;
			const args = ctx.message.content.split(' ').slice(1);
			const command = args.join(' ');
			if (!command) {
				ctx.message.reply({ content: `${process.env.FAILURE_EMOJI} | Please provide the execution code.` });
			}

			const defaultShell = process.env.SHELL || (process.platform === 'win32' ? 'powershell' : null) || (process.platform === 'darwin' ? 'bash' : null) || (process.platform === 'linux' ? 'bash' : null);

			if (!defaultShell) {
				ctx.message.reply(`${process.env.FAILURE_EMOJI} | Unable to find the default shell.`);
				return;
			}

			exec(command, { shell: defaultShell }, async (error, stdout, stderr) => {
				if (error) return ctx.message.reply({ content: `\`\`\`js\n${error}\n\`\`\`` });
				if (stderr) return ctx.message.reply({ content: `\`\`\`js\n${stderr}\n\`\`\`` });
				stdout = process.env.TOP_GG_TOKEN ? stdout.replace(new RegExp(ctx.client.token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[Client Access Token]').replace(new RegExp(process.env.MONGO_STRING.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[MongoDB Access Token]').replace(new RegExp(process.env.TOP_GG_TOKEN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[Top.gg Access Token]') : stdout.replace(new RegExp(ctx.client.token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[Client Access Token]').replace(new RegExp(process.env.MONGO_STRING.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[MongoDB Access Token]');
				if (stdout.length > 1500) {
					const msg = await ctx.message.reply({
						content: `\`\`\`js\n${stdout.substring(0, 1500)}\n\`\`\` \n Page 1/${Math.ceil(stdout.length / 1500)}`,
						components: [{
							type: 1,
							components: [
								{
									type: 2,
									style: 2,
									custom_id: 'execprev',
									emoji: {
										name: '⬅️',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 2,
									custom_id: 'execstop',
									emoji: {
										name: '⏹️',
									},
									disabled: false,
								},
								{
									type: 2,
									style: 2,
									custom_id: 'execnext',
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

						if (i.customId === 'execprev') {
							page = page > 1 ? --page : Math.ceil(stdout.length / 1500);
						}

						if (i.customId === 'execnext') {

							page = page + 1 <= Math.ceil(stdout.length / 1500) ? ++page : 1;
						}

						if (i.customId === 'execstop') {
							i.deferUpdate();
							return collector.stop('time');
						}

						await i.update({
							content: `\`\`\`js\n${stdout.substring((page - 1) * 1500, page * 1500)}\n\`\`\` \n Page ${page}/${Math.ceil(stdout.length / 1500)}`,
							components: [{
								type: 1,
								components: [
									{
										type: 2,
										style: 2,
										custom_id: 'execprev',
										emoji: {
											name: '⬅️',
										},
										disabled: page === 1,
									},
									{
										type: 2,
										style: 2,
										custom_id: 'execstop',
										emoji: {
											name: '⏹️',
										},
										disabled: false,
									},
									{
										type: 2,
										style: 2,
										custom_id: 'execnext',
										emoji: {
											name: '➡️',
										},
										disabled: page === Math.ceil(stdout.length / 1500),
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
										custom_id: 'execprev',
										emoji: {
											name: '⬅️',
										},
										disabled: true,
									},
									{
										type: 2,
										style: 2,
										custom_id: 'execstop',
										emoji: {
											name: '⏹️',
										},
										disabled: true,
									},
									{
										type: 2,
										style: 2,
										custom_id: 'execnext',
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
					ctx.message.reply({ content: `\`\`\`js\n${stdout}\n\`\`\`` });
				}
			});
		}
		catch (error) {
			ctx.message.reply(`\`\`\`js\n${error}\n\`\`\``);
		}
	},
};
