const App = require('../../../../Structures/Core/App');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');

module.exports = new App({
	name: 'Show Banner',
	type: 2,
	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {

		const id = generateCustomID();

		const user = ctx.interaction.options.getUser('user');

		const force = (await ctx.client.users.fetch(user?.id, { force: true })).banner;

		if (!force) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | This user doesn't have a banner!`,
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
				description: `${force.startsWith('a_') ? `[\`PNG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.png) | [\`JPG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.jpg) | [\`WEBP\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.webp) | [\`GIF\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.gif)` : `[\`PNG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.png) | [\`JPG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.jpg) | [\`WEBP\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.webp)`}`,
				image: {
					url: `https://cdn.discordapp.com/banners/${user?.id}/${force}${force.startsWith('a_') ? '.gif' : '.png'}?size=2048`,
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
					options: force.startsWith('a_') ? [{
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
					await i.deferUpdate();
					if (i.values[0] === 'png') {
						ctx.interaction.editReply({
							embeds: [{
								author: {
									name: user?.globalName || user?.username,
									icon_url: user?.displayAvatarURL({ size: 2048 }),
								},
								description: `${force.startsWith('a_') ? `[\`PNG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.png) | [\`JPG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.jpg) | [\`WEBP\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.webp) | [\`GIF\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.gif)` : `[\`PNG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.png) | [\`JPG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.jpg) | [\`WEBP\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.webp)`}`,
								image: {
									url: `https://cdn.discordapp.com/banners/${user?.id}/${force}.png?size=2048`,
								},
								footer: {
									text: `Desired by ${ctx.interaction.user?.username}`,
									icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
								},
								color: 16705372,
							}],
						});
					}
					else if (i.values[0] === 'jpg') {
						ctx.interaction.editReply({
							embeds: [{
								author: {
									name: user?.globalName || user?.username,
									icon_url: user?.displayAvatarURL({ size: 2048 }),
								},
								description: `${force.startsWith('a_') ? `[\`PNG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.png) | [\`JPG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.jpg) | [\`WEBP\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.webp) | [\`GIF\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.gif)` : `[\`PNG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.png) | [\`JPG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.jpg) | [\`WEBP\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.webp)`}`,
								image: {
									url: `https://cdn.discordapp.com/banners/${user?.id}/${force}.jpg?size=2048`,
								},
								footer: {
									text: `Desired by ${ctx.interaction.user?.username}`,
									icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
								},
								color: 16705372,
							}],
						});
					}
					else if (i.values[0] === 'webp') {
						ctx.interaction.editReply({
							embeds: [{
								author: {
									name: user?.globalName || user?.username,
									icon_url: user?.displayAvatarURL({ size: 2048 }),
								},
								description: `${force.startsWith('a_') ? `[\`PNG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.png) | [\`JPG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.jpg) | [\`WEBP\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.webp) | [\`GIF\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.gif)` : `[\`PNG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.png) | [\`JPG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.jpg) | [\`WEBP\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.webp)`}`,
								image: {
									url: `https://cdn.discordapp.com/banners/${user?.id}/${force}.webp?size=2048`,
								},
								footer: {
									text: `Desired by ${ctx.interaction.user?.username}`,
									icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
								},
								color: 16705372,
							}],
						});
					}
					else if (i.values[0] === 'gif') {
						ctx.interaction.editReply({
							embeds: [{
								author: {
									name: user?.globalName || user?.username,
									icon_url: user?.displayAvatarURL({ size: 2048 }),
								},
								description: `${force.startsWith('a_') ? `[\`PNG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.png) | [\`JPG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.jpg) | [\`WEBP\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.webp) | [\`GIF\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.gif)` : `[\`PNG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.png) | [\`JPG\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.jpg) | [\`WEBP\`](https://cdn.discordapp.com/banners/${user?.id}/${force}.webp)`}`,
								image: {
									url: `https://cdn.discordapp.com/banners/${user?.id}/${force}.gif?size=2048`,
								},
								footer: {
									text: `Desired by ${ctx.interaction.user?.username}`,
									icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
								},
								color: 16705372,
							}],
						});
					}
					collector.resetTimer();
				}
			}
		});

		collector.on('end', async (collected, reason) => {
			if (reason === 'time') {
				ctx.interaction.editReply({
					components: [{
						type: 1,
						components: [{
							type: 3,
							placeholder: 'This select menu has expired!',
							max_values: 1,
							min_values: 1,
							custom_id: id,
							disabled: true,
							options: msg.components[0].components[0].options,
						}],
					}],
				});
			}
		});
	},
});