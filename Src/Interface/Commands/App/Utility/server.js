const App = require('../../../../Structures/Core/App');

module.exports = new App({
	name: 'server',
	description: 'Get the icon or banner of the server',
	usage: 'server <icon | banner>',
	aliases: ['guild'],
	options: [{
		name: 'icon',
		description: 'Server icon for the requested server',
		type: 1,
	},
	{
		name: 'banner',
		description: 'Server banner for the requested server',
		type: 1,
	},
	],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		switch (ctx.interaction.options.getSubcommand()) {
			case 'icon':
				if (ctx.interaction.guild.icon === null) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | This server doesn't have a icon!`,
						ephemeral: true,
					});
				}
				ctx.interaction.reply({
					embeds: [{
						author: {
							name: ctx.interaction.guild.members.cache.get(ctx.interaction.guild.ownerId).globalName !== null ? ctx.interaction.guild.members.cache.get(ctx.interaction.guild.ownerId).globalName : ctx.interaction.guild.members.cache.get(ctx.interaction.guild.ownerId).username,
							icon_url: ctx.client.users.cache.get(ctx.interaction.guild.ownerId).displayAvatarURL({ size: 2048 }),
						},
						description: `${ctx.interaction.guild.icon.startsWith('a_') ? `[\`PNG\`](https://cdn.discordapp.com/icons/${ctx.interaction.guild.id}/${ctx.interaction.guild.icon}.png?size=2048) | [\`JPG\`](https://cdn.discordapp.com/icons/${ctx.interaction.guild.id}/${ctx.interaction.guild.icon}.jpg?size=2048) | [\`WEBP\`](https://cdn.discordapp.com/icons/${ctx.interaction.guild.id}/${ctx.interaction.guild.icon}.webp?size=2048) | [\`GIF\`](https://cdn.discordapp.com/icons/${ctx.interaction.guild.id}/${ctx.interaction.guild.icon}.gif?size=2048)` : `[\`PNG\`](https://cdn.discordapp.com/icons/${ctx.interaction.guild.id}/${ctx.interaction.guild.icon}.png?size=2048) | [\`JPG\`](https://cdn.discordapp.com/icons/${ctx.interaction.guild.id}/${ctx.interaction.guild.icon}.jpg?size=2048) | [\`WEBP\`](https://cdn.discordapp.com/icons/${ctx.interaction.guild.id}/${ctx.interaction.guild.icon}.webp?size=2048)`}`,
						image: {
							url: ctx.interaction.guild.iconURL({
								size: 2048,
							}),
						},
						footer: {
							text: `Desired by ${ctx.interaction.user?.username}`,
							icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
						},
						color: 16705372,
					}],
				});
				break;
			case 'banner':
				if (ctx.interaction.guild.banner === null) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | This server doesn't have a banner!`,
						ephemeral: true,
					});
				}

				ctx.interaction.reply({
					embeds: [{
						author: {
							name: ctx.interaction.guild.name,
							icon_url: ctx.interaction.guild.iconURL(),
						},
						description: `${ctx.interaction.guild.banner.startsWith('a_') ? `[\`PNG\`](https://cdn.discordapp.com/banners/${ctx.interaction.guild.id}/${ctx.interaction.guild.banner}.png?size=2048) | [\`JPG\`](https://cdn.discordapp.com/banners/${ctx.interaction.guild.id}/${ctx.interaction.guild.banner}.jpg?size=2048) | [\`WEBP\`](https://cdn.discordapp.com/banners/${ctx.interaction.guild.id}/${ctx.interaction.guild.banner}.webp?size=2048) | [\`GIF\`](https://cdn.discordapp.com/banners/${ctx.interaction.guild.id}/${ctx.interaction.guild.banner}.gif?size=2048)` : `[\`PNG\`](https://cdn.discordapp.com/banners/${ctx.interaction.guild.id}/${ctx.interaction.guild.banner}.png?size=2048) | [\`JPG\`](https://cdn.discordapp.com/banners/${ctx.interaction.guild.id}/${ctx.interaction.guild.banner}.jpg?size=2048) | [\`WEBP\`](https://cdn.discordapp.com/banners/${ctx.interaction.guild.id}/${ctx.interaction.guild.banner}.webp?size=2048)`}`,
						image: {
							url: ctx.interaction.guild.bannerURL({
								size: 2048,
							}),
						},
						color: 16705372,
					}],
				});
				break;
		}
	},
});