const App = require('../../../../Structures/Core/App');
const { httpRequest } = require('../../../../Structures/Utils/Functions/httpRequest');

module.exports = new App({
	name: 'rawmsg',
	description: 'Shows raw message data',
	aliases: ['rm'],

	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {
		await ctx.message.channel?.sendTyping();

		const messageid = ctx.message.content.split(' ').slice(1).shift();

		if (!messageid) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Please provide a message id to get the raw data of!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const channel = ctx.message.mentions.channels.first() || ctx.message.guild.channels.cache.get(ctx.message.content.split(' ').slice(2).join(' ')) || ctx.message.channel;

		if (!channel) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must provide a valid channel!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const message = await channel?.messages.fetch(messageid).catch(() => null);

		if (!message) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I couldn't find that message!`,
			}).then(msg => {
				setTimeout(() => {
					msg.delete();
				}, 15000);
			});
		}

		const bin = await httpRequest({
			method: 'POST',
			hostname: 'sourceb.in',
			path: '/api/bins',
			headers: {
				'Content-Type': 'application/json',
			},
			data: {
				title: 'Raw Message Data',
				description: 'This Sourcebin contains the raw message data of a discord message. The message data includes the message content, author, timestamp, and any relevant metadata.',
				files: [
					{
						content: JSON.stringify(message, null, 4),
						languageId: 174,
					},
				],
			},
		}).then((res) => JSON.parse(res));

		if (!bin.key) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I couldn't create a sourcebin for you! Please try again later.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		ctx.message.reply({
			content: `Here's the raw message data for the message you requested!\nBin Data Key: __*${bin.key}*__`,
			components: [{
				type: 1,
				components: [{
					type: 2,
					label: 'Click Here',
					emoji: {
						id: '1098819386216816700',
						name: 'sourcebin',
					},
					url: `https://sourceb.in/${bin.key}`,
					style: 5,
				}],
			}],
		});
	},
});