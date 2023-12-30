const App = require('../../../../Structures/Core/App');

module.exports = new App({
	name: 'rps',
	description: 'Play rock paper scissors with the bot',
	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const selection = ['rock', 'paper', 'scissors'];
		const botSelection = selection[Math.floor(Math.random() * selection.length)];
		const msg = await ctx.message.reply({
			embeds: [{
				title: 'Rock Paper Scissors',
				description: 'Choose your weapon from below by clicking on the buttons!\n\nRock: 🪨\nPaper: 📰\nScissors: ✂️',
				color: 16705372,
			}],
			components: [{
				type: 1,
				components: [{
					type: 2,
					style: 1,
					label: 'Rock',
					custom_id: 'rock',
					emoji: {
						name: '🪨',
					},
				},
				{
					type: 2,
					style: 1,
					label: 'Paper',
					custom_id: 'paper',
					emoji: {
						name: '📰',
					},
				},
				{
					type: 2,
					style: 1,
					label: 'Scissors',
					custom_id: 'scissors',
					emoji: {
						name: '✂️',
					},
				},
				],
			}],
		});

		const filter = (i) => i.customId === 'rock' || i.customId === 'paper' || i.customId === 'scissors';
		const collector = msg.createMessageComponentCollector({
			filter,
			time: 30000,
		});

		collector.on('collect', async (i) => {
			switch (i.customId) {
				case 'rock':
					if (botSelection === 'rock') {

						if (i.user?.id !== ctx.message.author?.id) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | This confirmation is not for you!`,
								ephemeral: true,
							});
						}

						await i.deferUpdate();
						i.editReply({
							embeds: [{
								title: 'Rock Paper Scissors',
								description: 'You have chosen rock, and I have chosen rock. It\'s a tie!',
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: [{
									type: 2,
									style: 2,
									label: 'Rock',
									custom_id: 'rock',
									emoji: {
										name: '🪨',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 1,
									label: 'Paper',
									custom_id: 'paper',
									emoji: {
										name: '📰',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 1,
									label: 'Scissors',
									custom_id: 'scissors',
									emoji: {
										name: '✂️',
									},
									disabled: true,
								},
								],
							}],
						});
					}
					else if (botSelection === 'paper') {
						if (i.user?.id !== ctx.message.author?.id) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | This confirmation is not for you!`,
								ephemeral: true,
							});
						}

						await i.deferUpdate();
						i.editReply({
							embeds: [{
								title: 'Rock Paper Scissors',
								description: 'You have chosen rock, and I have chosen paper. I win!! <a:yay:1057975849070108833> Better luck next time.',
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: [{
									type: 2,
									style: 4,
									label: 'Rock',
									custom_id: 'rock',
									emoji: {
										name: '🪨',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 1,
									label: 'Paper',
									custom_id: 'paper',
									emoji: {
										name: '📰',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 1,
									label: 'Scissors',
									custom_id: 'scissors',
									emoji: {
										name: '✂️',
									},
									disabled: true,
								},
								],
							}],
						});
					}
					else if (botSelection === 'scissors') {
						if (i.user?.id !== ctx.message.author?.id) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | This confirmation is not for you!`,
								ephemeral: true,
							});
						}

						await i.deferUpdate();
						i.editReply({
							embeds: [{
								title: 'Rock Paper Scissors',
								description: 'You have chosen rock, and I have chosen scissors. I lost! <a:cry:1057976596029509652>',
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: [{
									type: 2,
									style: 2,
									label: 'Rock',
									custom_id: 'rock',
									emoji: {
										name: '🪨',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 1,
									label: 'Paper',
									custom_id: 'paper',
									emoji: {
										name: '📰',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 1,
									label: 'Scissors',
									custom_id: 'scissors',
									emoji: {
										name: '✂️',
									},
									disabled: true,
								},
								],
							}],
						});
					}

					collector.stop();
					break;
				case 'paper':
					if (botSelection === 'rock') {
						if (i.user?.id !== ctx.message.author?.id) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | This confirmation is not for you!`,
								ephemeral: true,
							});
						}

						await i.deferUpdate();
						i.editReply({
							embeds: [{
								title: 'Rock Paper Scissors',
								description: 'You have chosen paper, and I have chosen rock. I lost! <a:cry:1057976596029509652>',
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: [{
									type: 2,
									style: 1,
									label: 'Rock',
									custom_id: 'rock',
									emoji: {
										name: '🪨',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 3,
									label: 'Paper',
									custom_id: 'paper',
									emoji: {
										name: '📰',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 1,
									label: 'Scissors',
									custom_id: 'scissors',
									emoji: {
										name: '✂️',
									},
									disabled: true,
								},
								],
							}],
						});
					}
					else if (botSelection === 'paper') {
						if (i.user?.id !== ctx.message.author?.id) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | This confirmation is not for you!`,
								ephemeral: true,
							});
						}

						await i.deferUpdate();
						i.editReply({
							embeds: [{
								title: 'Rock Paper Scissors',
								description: 'You have chosen paper, and I have chosen paper. It\'s a tie!',
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: [{
									type: 2,
									style: 2,
									label: 'Rock',
									custom_id: 'rock',
									emoji: {
										name: '🪨',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 1,
									label: 'Paper',
									custom_id: 'paper',
									emoji: {
										name: '📰',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 1,
									label: 'Scissors',
									custom_id: 'scissors',
									emoji: {
										name: '✂️',
									},
									disabled: true,
								},
								],
							}],
						});
					}
					else if (botSelection === 'scissors') {
						if (i.user?.id !== ctx.message.author?.id) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | This confirmation is not for you!`,
								ephemeral: true,
							});
						}

						await i.deferUpdate();
						i.editReply({
							embeds: [{
								title: 'Rock Paper Scissors',
								description: 'You have chosen paper, and I have chosen scissors. I win!! <a:yay:1057975849070108833> Better luck next time.',
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: [{
									type: 2,
									style: 1,
									label: 'Rock',
									custom_id: 'rock',
									emoji: {
										name: '🪨',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 4,
									label: 'Paper',
									custom_id: 'paper',
									emoji: {
										name: '📰',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 1,
									label: 'Scissors',
									custom_id: 'scissors',
									emoji: {
										name: '✂️',
									},
									disabled: true,
								},
								],
							}],
						});
					}

					collector.stop();
					break;
				case 'scissors':
					if (botSelection === 'rock') {
						if (i.user?.id !== ctx.message.author?.id) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | This confirmation is not for you!`,
								ephemeral: true,
							});
						}

						await i.deferUpdate();
						i.editReply({
							embeds: [{
								title: 'Rock Paper Scissors',
								description: 'You have chosen scissors, and I have chosen rock. I win!! <a:yay:1057975849070108833> Better luck next time.',
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: [{
									type: 2,
									style: 1,
									label: 'Rock',
									custom_id: 'rock',
									emoji: {
										name: '🪨',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 1,
									label: 'Paper',
									custom_id: 'paper',
									emoji: {
										name: '📰',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 4,
									label: 'Scissors',
									custom_id: 'scissors',
									emoji: {
										name: '✂️',
									},
									disabled: true,
								},
								],
							}],
						});
					}
					else if (botSelection === 'paper') {
						if (i.user?.id !== ctx.message.author?.id) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | This confirmation is not for you!`,
								ephemeral: true,
							});
						}

						await i.deferUpdate();
						i.editReply({
							embeds: [{
								title: 'Rock Paper Scissors',
								description: 'You have chosen scissors, and I have chosen paper. I lost! <a:cry:1057976596029509652>',
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: [{
									type: 2,
									style: 1,
									label: 'Rock',
									custom_id: 'rock',
									emoji: {
										name: '🪨',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 1,
									label: 'Paper',
									custom_id: 'paper',
									emoji: {
										name: '📰',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 3,
									label: 'Scissors',
									custom_id: 'scissors',
									emoji: {
										name: '✂️',
									},
									disabled: true,
								},
								],
							}],
						});
					}
					else if (botSelection === 'scissors') {
						if (i.user?.id !== ctx.message.author?.id) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | This confirmation is not for you!`,
								ephemeral: true,
							});
						}

						await i.deferUpdate();
						i.editReply({
							embeds: [{
								title: 'Rock Paper Scissors',
								description: 'You have chosen scissors, and I have chosen scissors. It\'s a tie!',
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: [{
									type: 2,
									style: 1,
									label: 'Rock',
									custom_id: 'rock',
									emoji: {
										name: '🪨',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 1,
									label: 'Paper',
									custom_id: 'paper',
									emoji: {
										name: '📰',
									},
									disabled: true,
								},
								{
									type: 2,
									style: 2,
									label: 'Scissors',
									custom_id: 'scissors',
									emoji: {
										name: '✂️',
									},
									disabled: true,
								},
								],
							}],
						});
					}

					collector.stop();
					break;
			}

		});

		collector.on('end', async (collected, reason) => {
			if (reason === 'time') {
				try {
					await msg.edit({
						embeds: [{
							title: 'Rock Paper Scissors',
							description: 'You took too long to respond. The game has ended.',
							color: 16705372,
						}],
						components: [{
							type: 1,
							components: [{
								type: 2,
								style: 1,
								label: 'Rock',
								custom_id: 'rock',
								emoji: {
									name: '🪨',
								},
								disabled: true,
							},
							{
								type: 2,
								style: 1,
								label: 'Paper',
								custom_id: 'paper',
								emoji: {
									name: '📰',
								},
								disabled: true,
							},
							{
								type: 2,
								style: 1,
								label: 'Scissors',
								custom_id: 'scissors',
								emoji: {
									name: '✂️',
								},
								disabled: true,
							},
							],
						}],
					});
				}
				catch (e) {
					return;
				}
			}
		});

	},
});