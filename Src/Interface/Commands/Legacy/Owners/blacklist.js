const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/blacklist');

module.exports = new App({
	name: 'blacklist',
	description: 'Blacklists a user from using the bot',
	usage: 'blacklist <add | remove | check> <user> [reason]',
	aliases: ['bl'],
	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {

		if (!ctx.client.owners.includes(ctx.message.author?.id)) return;
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
		const reason = args.slice(2).join(' ');
		const data = await Schema.findOne({
			User: user?.id,
		});

		switch (action) {
			case 'add':
				if (!data) {
					Schema.create({
						User: user?.id,
						reason: reason || 'No reason provided.',
					});
					return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | Successfully blacklisted \`${user?.globalName || user?.username}\`.`);
				}
				else {
					return ctx.message.reply(`${process.env.FAILURE_EMOJI} | The user is already blacklisted.`);
				}
			case 'remove':
				if (!data) return ctx.message.reply(`${process.env.FAILURE_EMOJI} | The user is not blacklisted.`);
				await data.deleteOne();
				return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | Successfully removed \`${user?.globalName || user?.username}\` from blacklist.`);
			case 'check':
				if (data) {
					return ctx.message.reply(`${process.env.FAILURE_EMOJI} | The user is blacklisted.`);
				}
				else {
					return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | The user is not blacklisted.`);
				}
			default:
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid action. Available actions are \`add\`, \`remove\`, \`check\`.`);
		}

	},
});