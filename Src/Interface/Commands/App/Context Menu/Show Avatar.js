const App = require('../../../../Structures/Core/App');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');

module.exports = new App({
	name: 'Show Avatar',
	type: 2,
	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {

		const id = generateCustomID();

		const serverav = generateCustomID();

		const userav = generateCustomID();

		const user = ctx.interaction.options.getUser('user');

		if (ctx.interaction.guild.members.cache.get(user?.id) === undefined) {
			if (!user?.avatar) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | ${user?.globalName || user?.username} does not have a avatar...`,
					ephemeral: true,
				});
			}

			const msg = await ctx.interaction.reply({
				fetchReply: true,
				embeds: [{
					author: {
						name: user?.globalName || user?.username,
						icon_url: user?.displayAvatarURL({ size: 2048 }),

					},
					description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
					image: {
						url: user?.displayAvatarURL({ size: 2048 }),
					},
					footer: {
						text: `Desired by ${ctx.interaction.user?.username}`,
						icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
					},
					color: 16705372,
				} ],
				components: [{
					type: 1,
					components: [{
						type: 3,
						placeholder: 'Select Image Format',
						max_values: 1,
						min_values: 1,
						custom_id: id,
						options: user?.avatar.startsWith('a_') ? [{
							label: 'PNG',
							value: 'png',
						}, {
							label: 'JPG',
							value: 'jpg',
						}, {
							label: 'WEBP',
							value: 'webp',
						}, {
							label: 'GIF',
							value: 'gif',
						}] : [{
							label: 'PNG',
							value: 'png',
						}, {
							label: 'JPG',
							value: 'jpg',
						}, {
							label: 'WEBP',
							value: 'webp',
						}],
					}],
				}],
			});

			const collector = msg.createMessageComponentCollector({
				time: 60000,
			});

			collector.on('collect', async (i) => {
				if (i.isStringSelectMenu()) {
					if (i.customId === id) {
						if (i.user?.id !== ctx.interaction.user?.id) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
								ephemeral: true,
							});
						}
						if (!user?.avatar) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | ${user?.globalName || user?.username} does not have a avatar...`,
								ephemeral: true,
							});
						}
						await i.deferUpdate();
						if (i.values[0] === 'png') {
							msg.edit({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
									image: {
										url: user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true }),
									},
									footer: {
										text: `Desired by ${ctx.interaction.user?.username}`,
										icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
									},
									color: 16705372,
								}],
							});

							collector.resetTimer();
						}
						else if (i.values[0] === 'jpg') {
							msg.edit({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
									image: {
										url: user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true }),
									},
									footer: {
										text: `Desired by ${ctx.interaction.user?.username}`,
										icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
									},
									color: 16705372,
								}],
							});

							collector.resetTimer();
						}
						else if (i.values[0] === 'webp') {
							msg.edit({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
									image: {
										url: user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true }),
									},
									footer: {
										text: `Desired by ${ctx.interaction.user?.username}`,
										icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
									},
									color: 16705372,
								}],
							});

							collector.resetTimer();
						}
						else if (i.values[0] === 'gif') {
							msg.edit({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
									image: {
										url: user?.displayAvatarURL({ size: 2048 }),
									},
									footer: {
										text: `Desired by ${ctx.interaction.user?.username}`,
										icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
									},
									color: 16705372,
								}],
							});

							collector.resetTimer();
						}
					}
				}
			});

			collector.on('end', async (collected, reason) => {
				if (reason === 'time') {
					msg.edit({
						components: [{
							type: 1,
							components: [{
								type: 3,
								placeholder: 'This select menu has expired!',
								max_values: 1,
								min_values: 1,
								custom_id: id,
								disabled: true,
								options: user?.avatar.startsWith('a_') ? [{
									label: 'PNG',
									value: 'png',
								}, {
									label: 'JPG',
									value: 'jpg',
								}, {
									label: 'WEBP',
									value: 'webp',
								}, {
									label: 'GIF',
									value: 'gif',
								}] : [{
									label: 'PNG',
									value: 'png',
								}, {
									label: 'JPG',
									value: 'jpg',
								}, {
									label: 'WEBP',
									value: 'webp',
								}],
							}],
						}],
					});
				}
			});

		}
		else if (ctx.interaction.guild.members.cache.get(user?.id).avatar === null) {
			if (!user?.avatar) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | ${user?.globalName || user?.username} does not have a avatar...`,
					ephemeral: true,
				});
			}

			const msg = await ctx.interaction.reply({
				embeds: [{
					author: {
						name: user?.globalName || user?.username,
						icon_url: user?.displayAvatarURL({ size: 2048 }),

					},
					description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
					image: {
						url: user?.displayAvatarURL({ size: 2048 }),
					},
					footer: {
						text: `Desired by ${ctx.interaction.user?.username}`,
						icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
					},
					color: 16705372,
				} ],
				components: [{
					type: 1,
					components: [{
						type: 3,
						placeholder: 'Select Image Format',
						max_values: 1,
						min_values: 1,
						custom_id: id,
						options: user?.avatar.startsWith('a_') ? [{
							label: 'PNG',
							value: 'png',
						}, {
							label: 'JPG',
							value: 'jpg',
						}, {
							label: 'WEBP',
							value: 'webp',
						}, {
							label: 'GIF',
							value: 'gif',
						}] : [{
							label: 'PNG',
							value: 'png',
						}, {
							label: 'JPG',
							value: 'jpg',
						}, {
							label: 'WEBP',
							value: 'webp',
						}],
					}],
				}],
			});

			const collector = msg.createMessageComponentCollector({
				time: 60000,
			});

			collector.on('collect', async (i) => {
				if (i.isStringSelectMenu()) {
					if (i.customId === id) {
						if (i.user?.id !== ctx.interaction.user?.id) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
								ephemeral: true,
							});
						}
						if (!user?.avatar) {
							return i.reply({
								content: `${process.env.FAILURE_EMOJI} | ${user?.globalName || user?.username} does not have a avatar...`,
								ephemeral: true,
							});
						}
						await i.deferUpdate();
						if (i.values[0] === 'png') {
							msg.edit({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
									image: {
										url: user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true }),
									},
									footer: {
										text: `Desired by ${ctx.interaction.user?.username}`,
										icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
									},
									color: 16705372,
								}],
							});

							collector.resetTimer();
						}
						else if (i.values[0] === 'jpg') {
							msg.edit({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
									image: {
										url: user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true }),
									},
									footer: {
										text: `Desired by ${ctx.interaction.user?.username}`,
										icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
									},
									color: 16705372,
								}],
							});

							collector.resetTimer();
						}
						else if (i.values[0] === 'webp') {
							msg.edit({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
									image: {
										url: user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true }),
									},
									footer: {
										text: `Desired by ${ctx.interaction.user?.username}`,
										icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
									},
									color: 16705372,
								}],
							});

							collector.resetTimer();
						}
						else if (i.values[0] === 'gif') {
							msg.edit({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
									image: {
										url: user?.displayAvatarURL({ size: 2048 }),
									},
									footer: {
										text: `Desired by ${ctx.interaction.user?.username}`,
										icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
									},
									color: 16705372,
								}],
							});

							collector.resetTimer();
						}
					}
				}
			});

			collector.on('end', async (collected, reason) => {
				if (reason === 'time') {
					msg.edit({
						components: [{
							type: 1,
							components: [{
								type: 3,
								placeholder: 'This select menu has expired!',
								max_values: 1,
								min_values: 1,
								custom_id: id,
								disabled: true,
								options: user?.avatar.startsWith('a_') ? [{
									label: 'PNG',
									value: 'png',
								}, {
									label: 'JPG',
									value: 'jpg',
								}, {
									label: 'WEBP',
									value: 'webp',
								}, {
									label: 'GIF',
									value: 'gif',
								}] : [{
									label: 'PNG',
									value: 'png',
								}, {
									label: 'JPG',
									value: 'jpg',
								}, {
									label: 'WEBP',
									value: 'webp',
								}],
							}],
						}],
					});
				}
			});
		}
		else if (ctx.interaction.guild.members.cache.get(user?.id).avatar !== null) {
			const msg = await ctx.interaction.reply({
				embeds: [{
					author: {
						name: user?.globalName || user?.username,
						icon_url: user?.displayAvatarURL({ size: 2048 }) || ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 }),
					},
					description: 'Choose your avatar style from the buttons below.',
					color: 16705372,
				}],
				components: [{
					type: 1,
					components: [{
						type: 2,
						label: 'Server Avatar',
						custom_id: serverav,
						style: 3,
					},
					{
						type: 2,
						label: 'User Avatar',
						custom_id: userav,
						style: 3,
					},
					],
				}],
			});

			const collector_main = msg.createMessageComponentCollector({
				time: 30000,
			});

			collector_main.on('collect', async (i) => {
				if (i.isButton()) {
					switch (i.customId) {
						case serverav:
							collector_main.resetTimer({
								time: 60000,
							});

							if (i.user?.id !== ctx.interaction.user?.id) {
								return i.reply({
									content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
									ephemeral: true,
								});
							}

							if (!ctx.interaction.guild.members.cache.get(user?.id).avatar) {
								return i.reply({
									content: `${process.env.FAILURE_EMOJI} | ${user?.globalName || user?.username} does not have a server avatar...`,
									ephemeral: true,
								});
							}

							await i.deferUpdate();

							const msg = await i.editReply({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }) || ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 }),
									},
									description: `${ctx.interaction.guild.members.cache.get(user?.id).avatar.startsWith('a_') ? `[\`PNG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
									image: {
										url: ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 }),
									},
									footer: {
										text: `Desired by ${ctx.interaction.user?.username}`,
										icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
									},
									color: 16705372,
								} ],
								components: [{
									type: 1,
									components: [{
										type: 3,
										placeholder: 'Select Image Format',
										max_values: 1,
										min_values: 1,
										custom_id: id,
										options: ctx.interaction.guild.members.cache.get(user?.id).avatar.startsWith('a_') ? [{
											label: 'PNG',
											value: 'png',
										}, {
											label: 'JPG',
											value: 'jpg',
										}, {
											label: 'WEBP',
											value: 'webp',
										}, {
											label: 'GIF',
											value: 'gif',
										}] : [{
											label: 'PNG',
											value: 'png',
										}, {
											label: 'JPG',
											value: 'jpg',
										}, {
											label: 'WEBP',
											value: 'webp',
										}],
									}],
								}],
							});

							const collector = msg.createMessageComponentCollector({
								time: 60000,
							});

							collector.on('collect', async (i) => {
								if (i.isStringSelectMenu()) {
									if (i.customId === id) {
										if (i.user?.id !== ctx.interaction.user?.id) {
											return i.reply({
												content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
												ephemeral: true,
											});
										}
										if (!ctx.interaction.guild.members.cache.get(user?.id).avatar) {
											return i.reply({
												content: `${process.env.FAILURE_EMOJI} | ${user?.globalName || user?.username} does not have a server avatar...`,
												ephemeral: true,
											});
										}
										await i.deferUpdate();
										if (i.values[0] === 'png') {
											msg.edit({
												embeds: [{
													author: {
														name: user?.globalName || user?.username,
														icon_url: user?.displayAvatarURL({ size: 2048 }) || ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 }),
													},
													description: `${ctx.interaction.guild.members.cache.get(user?.id).avatar.startsWith('a_') ? `[\`PNG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
													image: {
														url: ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true }),
													},
													footer: {
														text: `Desired by ${ctx.interaction.user?.username}`,
														icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
													},
													color: 16705372,
												}],
											});

											collector.resetTimer();
											collector_main.resetTimer({
												time: 60000,
											});
										}
										else if (i.values[0] === 'jpg') {
											msg.edit({
												embeds: [{
													author: {
														name: user?.globalName || user?.username,
														icon_url: user?.displayAvatarURL({ size: 2048 }) || ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 }),
													},
													description: `${ctx.interaction.guild.members.cache.get(user?.id).avatar.startsWith('a_') ? `[\`PNG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
													image: {
														url: ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true }),
													},
													footer: {
														text: `Desired by ${ctx.interaction.user?.username}`,
														icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
													},
													color: 16705372,
												}],
											});

											collector.resetTimer();
											collector_main.resetTimer({
												time: 60000,
											});
										}
										else if (i.values[0] === 'webp') {
											msg.edit({
												embeds: [{
													author: {
														name: user?.globalName || user?.username,
														icon_url: user?.displayAvatarURL({ size: 2048 }) || ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 }),
													},
													description: `${ctx.interaction.guild.members.cache.get(user?.id).avatar.startsWith('a_') ? `[\`PNG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
													image: {
														url: ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true }),
													},
													footer: {
														text: `Desired by ${ctx.interaction.user?.username}`,
														icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
													},
													color: 16705372,
												}],
											});

											collector.resetTimer();
											collector_main.resetTimer({
												time: 60000,
											});
										}
										else if (i.values[0] === 'gif') {
											msg.edit({
												embeds: [{
													author: {
														name: user?.globalName || user?.username,
														icon_url: user?.displayAvatarURL({ size: 2048 }) || ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 }),
													},
													description: `${ctx.interaction.guild.members.cache.get(user?.id).avatar.startsWith('a_') ? `[\`PNG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
													image: {
														url: ctx.interaction.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 }),
													},
													footer: {
														text: `Desired by ${ctx.interaction.user?.username}`,
														icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
													},
													color: 16705372,
												}],
											});

											collector.resetTimer();
											collector_main.resetTimer({
												time: 60000,
											});
										}
									}
								}
							});

							collector.on('end', async (collected, reason) => {
								if (reason === 'time') {
									collector_main.stop();
									await msg.edit({
										components: [{
											type: 1,
											components: [{
												type: 3,
												placeholder: 'This select menu has expired!',
												max_values: 1,
												min_values: 1,
												custom_id: id,
												disabled: true,
												options: ctx.interaction.guild.members.cache.get(user?.id).avatar.startsWith('a_') ? [{
													label: 'PNG',
													value: 'png',
												}, {
													label: 'JPG',
													value: 'jpg',
												}, {
													label: 'WEBP',
													value: 'webp',
												}, {
													label: 'GIF',
													value: 'gif',
												}] : [{
													label: 'PNG',
													value: 'png',
												}, {
													label: 'JPG',
													value: 'jpg',
												}, {
													label: 'WEBP',
													value: 'webp',
												}],
											}],
										}],
									});
								}
							});
							break;
						case userav:
							if (i.user?.id !== ctx.interaction.user?.id) {
								return i.reply({
									content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
									ephemeral: true,
								});
							}

							if (!user?.avatar) {
								return i.reply({
									content: `${process.env.FAILURE_EMOJI} | ${user?.globalName || user?.username} does not have a user avatar...`,
									ephemeral: true,
								});
							}

							await i.deferUpdate();

							const msg2 = await i.editReply({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),

									},
									description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
									image: {
										url: user?.displayAvatarURL({ size: 2048 }),
									},
									footer: {
										text: `Desired by ${ctx.interaction.user?.username}`,
										icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
									},
									color: 16705372,
								} ],
								components: [{
									type: 1,
									components: [{
										type: 3,
										placeholder: 'Select Image Format',
										max_values: 1,
										min_values: 1,
										custom_id: id,
										options: user?.avatar.startsWith('a_') ? [{
											label: 'PNG',
											value: 'png',
										}, {
											label: 'JPG',
											value: 'jpg',
										}, {
											label: 'WEBP',
											value: 'webp',
										}, {
											label: 'GIF',
											value: 'gif',
										}] : [{
											label: 'PNG',
											value: 'png',
										}, {
											label: 'JPG',
											value: 'jpg',
										}, {
											label: 'WEBP',
											value: 'webp',
										}],
									}],
								}],
							});

							const collector2 = msg2.createMessageComponentCollector({
								time: 60000,
							});

							collector2.on('collect', async (i) => {
								if (i.isStringSelectMenu()) {
									if (i.customId === id) {
										if (i.user?.id !== ctx.interaction.user?.id) {
											return i.reply({
												content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
												ephemeral: true,
											});
										}
										if (!user?.avatar) {
											return i.reply({
												content: `${process.env.FAILURE_EMOJI} | ${user?.globalName || user?.username} does not have a avatar...`,
												ephemeral: true,
											});
										}
										await i.deferUpdate();
										if (i.values[0] === 'png') {
											msg2.edit({
												embeds: [{
													author: {
														name: user?.globalName || user?.username,
														icon_url: user?.displayAvatarURL({ size: 2048 }),
													},
													description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
													image: {
														url: user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true }),
													},
													footer: {
														text: `Desired by ${ctx.interaction.user?.username}`,
														icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
													},
													color: 16705372,
												}],
											});

											collector2.resetTimer();
											collector_main.resetTimer({
												time: 60000,
											});
										}
										else if (i.values[0] === 'jpg') {
											msg2.edit({
												embeds: [{
													author: {
														name: user?.globalName || user?.username,
														icon_url: user?.displayAvatarURL({ size: 2048 }),
													},
													description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
													image: {
														url: user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true }),
													},
													footer: {
														text: `Desired by ${ctx.interaction.user?.username}`,
														icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
													},
													color: 16705372,
												}],
											});

											collector2.resetTimer();
											collector_main.resetTimer({
												time: 60000,
											});
										}
										else if (i.values[0] === 'webp') {
											msg2.edit({
												embeds: [{
													author: {
														name: user?.globalName || user?.username,
														icon_url: user?.displayAvatarURL({ size: 2048 }),
													},
													description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
													image: {
														url: user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true }),
													},
													footer: {
														text: `Desired by ${ctx.interaction.user?.username}`,
														icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
													},
													color: 16705372,
												}],
											});

											collector2.resetTimer();
											collector_main.resetTimer({
												time: 60000,
											});
										}
										else if (i.values[0] === 'gif') {
											msg2.edit({
												embeds: [{
													author: {
														name: user?.globalName || user?.username,
														icon_url: user?.displayAvatarURL({ size: 2048 }),
													},
													description: `${user?.avatar.startsWith('a_') ? `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })}) | [\`GIF\`](${user?.displayAvatarURL({ size: 2048 })})` : `[\`PNG\`](${user?.displayAvatarURL({ extension: 'png', size: 2048,  forceStatic: true })}) | [\`JPG\`](${user?.displayAvatarURL({ extension: 'jpg', size: 2048,  forceStatic: true })}) | [\`WEBP\`](${user?.displayAvatarURL({ extension: 'webp', size: 2048,  forceStatic: true })})`}`,
													image: {
														url: user?.displayAvatarURL({ size: 2048 }),
													},
													footer: {
														text: `Desired by ${ctx.interaction.user?.username}`,
														icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
													},
													color: 16705372,
												}],
											});

											collector2.resetTimer();
											collector_main.resetTimer({
												time: 60000,
											});
										}
									}
								}
							});
							collector2.on('end', async (collected, reason) => {
								if (reason === 'time') {
									collector_main.stop();
									await msg2.edit({
										components: [{
											type: 1,
											components: [{
												type: 3,
												placeholder: 'This select menu has expired!',
												max_values: 1,
												min_values: 1,
												custom_id: id,
												disabled: true,
												options: user?.avatar.startsWith('a_') ? [{
													label: 'PNG',
													value: 'png',
												}, {
													label: 'JPG',
													value: 'jpg',
												}, {
													label: 'WEBP',
													value: 'webp',
												}, {
													label: 'GIF',
													value: 'gif',
												}] : [{
													label: 'PNG',
													value: 'png',
												}, {
													label: 'JPG',
													value: 'jpg',
												}, {
													label: 'WEBP',
													value: 'webp',
												}],
											}],
										}],
									});
								}
							});
							break;
					}
				}
			});

			collector_main.on('end', async (collected, reason) => {
				if (reason === 'time') {
					await msg.edit({
						components: [{
							type: 1,
							components: [{
								type: 2,
								label: 'Server Avatar',
								custom_id: serverav,
								style: 3,
								disabled: true,
							},
							{
								type: 2,
								label: 'User Avatar',
								custom_id: userav,
								style: 3,
								disabled: true,
							},
							],
						}],
					});
				}
			});
		}
	},
});