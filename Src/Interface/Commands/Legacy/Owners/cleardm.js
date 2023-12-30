const App = require('../../../../Structures/Core/App');

module.exports = new App({
	name: 'cleardm',
	description: 'Clears all messages in your DMs',
	usage: 'cleardm <user>',
	aliases: ['cd'],
	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {

		if (!ctx.client.owners.includes(ctx.message.author?.id) && !ctx.client.mods.includes(ctx.message.author?.id)) return;
		const args = ctx.message.content.split(' ').slice(1);
		if (!args[0]) {
			return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}
		let user;

		if (ctx.message.content.match(/<@(\d+)>/) !== null && args[1] === ctx.message.content.match(/<@(\d+)>/)[0]) {
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
		else if (ctx.message.mentions.members.first() && ctx.message.mentions.members.first() === args[1]) {
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
		else if (ctx.message.mentions.repliedUser !== null && !args[1]) {
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
		else if (args[1]) {
			try {
				user = await ctx.client.users.fetch(args[1]);
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

		if (ctx.client.mods.includes(ctx.message.author?.id) && (ctx.message.author?.id !== user?.id)) return ctx.message.reply(`${process.env.FAILURE_EMOJI} | You can only clear your own DMs!`);

		if (!user?.dmChannel) {
			const channel = await user?.createDM();
			const messages = (await channel?.messages.fetch()).filter(m => m.author?.id === ctx.client.user?.id);
			for (const message of messages.values()) {
				await message.delete();
			}
			channel?.delete();
		}
		else {
			const channel = user?.dmChannel;
			const messages = (await channel?.messages.fetch()).filter(m => m.author?.id === ctx.client.user?.id);
			for (const message of messages.values()) {
				await message.delete();
			}
			channel?.delete();
		}

		return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | Successfully cleared all messages from \`${user?.globalName || user?.username}\`'s DMs.`);
	},
});