const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/noprefix');

module.exports = new App({
	name: 'noprefix',
	description: 'Allows a user to use the bot without prefix',
	usage: 'noprefix <add/remove/check> <user>',
	aliases: ['np'],
	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {

		if (!ctx.client.owners.includes(ctx.message.author?.id) && !ctx.client.mods.includes(ctx.message.author?.id)) return;
		const args = ctx.message.content.split(' ').slice(1);
		const action = args[0];
		if (!args[0] || (args[0] !== 'add' && args[0] !== 'remove' && args[0] !== 'check')) return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid action. Available actions are \`add\`, \`remove\`, \`check\`.`);

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
		const data = await Schema.findOne({
			User: user?.id,
		});

		switch (action) {
			case 'add':
				if (!data) {
					Schema.create({
						User: user?.id,
					});
					return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | Successfully given \`${user?.globalName || user?.username}\` access to use the bot without prefix.`);
				}
				else {
					return ctx.message.reply(`${process.env.FAILURE_EMOJI} | The user already has access to use the bot without prefix.`);
				}
			case 'remove':
				if (!data) return ctx.message.reply(`${process.env.FAILURE_EMOJI} | The user already doesn't have access to use the bot without prefix.`);
				await data.deleteOne();
				return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | Successfully removed \`${user?.globalName || user?.username}\` access to use the bot without prefix.`);
			case 'check':
				if (data) {
					return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | The user has access to use the bot without prefix.`);
				}
				else {
					return ctx.message.reply(`${process.env.FAILURE_EMOJI} | The user doesn't have access to use the bot without prefix.`);
				}
			default:
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid action. Available actions are \`add\`, \`remove\`, \`check\`.`);
		}

	},
});
