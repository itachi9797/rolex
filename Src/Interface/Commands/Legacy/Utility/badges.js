const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/badge');

module.exports = new App({
	name: 'badges',
	description: 'Shows your badges',
	aliases: ['badge', 'profile'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const args = ctx.message.content.split(' ').slice(1);

		let user;

		if (ctx.message.content.match(/<@(\d+)>/) !== null && args[0] === ctx.message.content.match(/<@(\d+)>/)[0]) {
			try {
				user = await ctx.client.users.fetch(ctx.message.content.match(/<@(\d+)>/)[1]);
			}
			catch (e) {
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		}
		else if (ctx.message.mentions.members.first() && ctx.message.mentions.members.first() === args[0]) {
			try {
				user = await ctx.client.users.fetch(ctx.message.mentions.members.first().id);
			}
			catch (e) {
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		}
		else if (ctx.message.mentions.repliedUser !== null && !args[0]) {
			try {
				user = await ctx.client.users.fetch(ctx.message.mentions.replieduser?.id);
			}
			catch (e) {
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		}
		else if (args[0]) {
			try {
				user = await ctx.client.users.fetch(args[0]);
			}
			catch (e) {
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		}
		else {
			user = ctx.message.author;
		}

		Schema.findOne({ User: user?.id }).then(async (data) => {
			if (data) {
				await ctx.message.reply({
					embeds: [
						{
							author: {
								name: ctx.client.user?.globalName || ctx.client.user?.username + ' Badges',
								icon_url: ctx.client.user?.displayAvatarURL({ size: 2048 }),
							},
							description: `**Currently ${user?.globalName || user?.username} have ${data.Badges.length} badges.**\n\n${data.Badges.map(
								(badge) => `${badge.name}`,
							).join('\n')}`,
							color: 16705372,
						},
					],
				});
			}
			else if (!data) {
				await ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | This user don't have any badges currently.`,

				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });
			}
		},
		);
	},
});