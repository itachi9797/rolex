const App = require('../../../../Structures/Core/App');
const { httpRequest } = require('../../../../Structures/Utils/Functions/httpRequest');

module.exports = new App({
	name: 'rawmsg',
	description: 'Shows raw message data',
	usage: 'rawmsg <messageid> [channel]',
	aliases: ['rm'],
	options: [{
		name: 'messageid',
		description: 'The message id to get the raw data of!',
		type: 3,
		required: true,
	}, {
		name: 'channel',
		description: 'The channel to get the raw data of!',
		type: 7,
		required: false,
		channel_types: [0],
	}],


	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {
		await ctx.interaction.deferReply();
		const messageid = ctx.interaction.options.getString('messageid') || ctx.interaction.targetId;
		const channel = ctx.interaction.options.getChannel('channel') || ctx.interaction.channel;

		const message = await channel?.messages.fetch(messageid).catch(() => null);

		if (!message) {
			return ctx.interaction.editReply({
				content: `${process.env.FAILURE_EMOJI} | I couldn't find that message!`,
			}).then(() => setTimeout(() => ctx.interaction.deleteReply(), 15000));
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
			return ctx.interaction.editReply({
				content: `${process.env.FAILURE_EMOJI} | I couldn't create a sourcebin for you! Please try again later.`,
			}).then(() => setTimeout(() => ctx.interaction.deleteReply(), 15000));
		}

		ctx.interaction.editReply({
			content: `Here's the raw message data for the message you requested!\nBin Data Key: __*${bin.key}*__`,
			components: [
				{
					type: 1,
					components: [
						{
							type: 2,
							label: 'Click Here',
							emoji: {
								id: '1098819386216816700',
								name: 'sourcebin',
							},
							url: `https://sourceb.in/${bin.key}`,
							style: 5,
						},
					],
				},
			],
		});
	},
});