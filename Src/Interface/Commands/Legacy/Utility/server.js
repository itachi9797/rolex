const App = require('../../../../Structures/Core/App');

module.exports = new App({
	name: 'server',
	description: 'Get the icon or banner of the server',
	aliases: ['guild'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {

		const subcommand = ctx.message.content.split(' ').slice(1).shift();
		if (!subcommand) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Please provide a valid option! Available options: \`icon\`, \`banner\``,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		switch (subcommand.toLowerCase()) {
			case 'icon':
				if (ctx.message.guild.icon === null) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | This server doesn't have a icon!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
				ctx.message.reply({
					embeds: [{
						author: {
							name: ctx.message.guild.members.cache.get(ctx.message.guild.ownerId).globalName !== null ? ctx.message.guild.members.cache.get(ctx.message.guild.ownerId).globalName : ctx.message.guild.members.cache.get(ctx.message.guild.ownerId).username,
							icon_url: ctx.client.users.cache.get(ctx.message.guild.ownerId).displayAvatarURL({ size: 2048 }),
						},
						description: `${ctx.message.guild.icon.startsWith('a_') ? `[\`PNG\`](https://cdn.discordapp.com/icons/${ctx.message.guild.id}/${ctx.message.guild.icon}.png?size=2048) | [\`JPG\`](https://cdn.discordapp.com/icons/${ctx.message.guild.id}/${ctx.message.guild.icon}.jpg?size=2048) | [\`WEBP\`](https://cdn.discordapp.com/icons/${ctx.message.guild.id}/${ctx.message.guild.icon}.webp?size=2048) | [\`GIF\`](https://cdn.discordapp.com/icons/${ctx.message.guild.id}/${ctx.message.guild.icon}.gif?size=2048)` : `[\`PNG\`](https://cdn.discordapp.com/icons/${ctx.message.guild.id}/${ctx.message.guild.icon}.png?size=2048) | [\`JPG\`](https://cdn.discordapp.com/icons/${ctx.message.guild.id}/${ctx.message.guild.icon}.jpg?size=2048) | [\`WEBP\`](https://cdn.discordapp.com/icons/${ctx.message.guild.id}/${ctx.message.guild.icon}.webp?size=2048)`}`,
						image: {
							url: ctx.message.guild.iconURL({
								size: 2048,
							}),
						},
						footer: {
							text: `Desired by ${ctx.message.author?.username}`,
							icon_url: ctx.message.author?.displayAvatarURL({ size: 2048 }),
						},
						color: 16705372,
					}],
				});
				break;
			case 'banner':
				if (ctx.message.guild.banner === null) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | This server doesn't have a banner!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				ctx.message.reply({
					embeds: [{
						author: {
							name: ctx.message.guild.name,
							icon_url: ctx.message.guild.iconURL(),
						},
						description: `${ctx.message.guild.banner.startsWith('a_') ? `[\`PNG\`](https://cdn.discordapp.com/banners/${ctx.message.guild.id}/${ctx.message.guild.banner}.png?size=2048) | [\`JPG\`](https://cdn.discordapp.com/banners/${ctx.message.guild.id}/${ctx.message.guild.banner}.jpg?size=2048) | [\`WEBP\`](https://cdn.discordapp.com/banners/${ctx.message.guild.id}/${ctx.message.guild.banner}.webp?size=2048) | [\`GIF\`](https://cdn.discordapp.com/banners/${ctx.message.guild.id}/${ctx.message.guild.banner}.gif?size=2048)` : `[\`PNG\`](https://cdn.discordapp.com/banners/${ctx.message.guild.id}/${ctx.message.guild.banner}.png?size=2048) | [\`JPG\`](https://cdn.discordapp.com/banners/${ctx.message.guild.id}/${ctx.message.guild.banner}.jpg?size=2048) | [\`WEBP\`](https://cdn.discordapp.com/banners/${ctx.message.guild.id}/${ctx.message.guild.banner}.webp?size=2048)`}`,
						image: {
							url: ctx.message.guild.bannerURL({
								size: 2048,
							}),
						},
						color: 16705372,
					}],
				});
				break;
			default:
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | Please provide a valid option! Available options: \`icon\`, \`banner\``,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
		}
	},
});