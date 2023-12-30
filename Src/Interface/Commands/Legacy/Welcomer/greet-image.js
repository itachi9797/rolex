const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/welcomer');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'greet-image',
	description: 'Sets welcome image.',

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});
		if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Server\` permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		await Schema.findOne({
			Guild: ctx.message.guild.id,
		}).then(async (data) => {

			if (data) {
				if (!data.channel) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You haven't set a channel for the welcomer, please set a channel first.`,
					});
				}

				if (data.embed === false) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You haven't enabled embed for the welcomer, please enable embed first.`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				ctx.message.reply({
					embeds: [{
						title: 'Welcome Image Setup',
						description: 'Here are some keywords, which you can use in your welcome image. You can also send image links to set in image.\nSend your link/keywords in this channel?.\nIf you want to cancel the setup simply type `cancel`.\nIf you want to remove existing image simply type `remove`.\n\n```xml\n<<server.banner>> = Shows the server\'s banner```',
						color: 16705372,
					}],
				});


				const message = await ctx.message.channel?.awaitMessages({
					filter: m => m.author?.id === ctx.message.author?.id,
					max: 1,
					time: 60000,
					errors: ['time'],
				}).catch(() => {
					ctx.message.channel?.send({
						embeds: [{
							description: 'You took too long to respond. Run the command again to set it up.',
							color: 16705372,
						}],
					});
				});

				if (!message) return;

				if (message.first().content.toLowerCase() === 'cancel') {
					ctx.message.channel?.send({
						content: 'Cancelled the setup. Run the command again to set it up.',
					});
					return;
				}

				if (message.first().content.toLowerCase() === 'remove') {
					ctx.message.channel?.send({
						content: `${process.env.SUCCESS_EMOJI} | Sucessfully removed the image.`,
					});
					data.image = null;
					await data.save();
					return;
				}

				if (!message.first().content.startsWith('https://') && message.first().content.toLowerCase() !== '<<server.banner>>') {
					return ctx.message.channel?.send({
						content: `${process.env.FAILURE_EMOJI} | Your link doesn't start with https! Run the command again to set it up. Run the command again to set it up.`,
					});
				}

				const member = ctx.message.member;

				let image = message.first().content.split(' ')[0];

				if (message.first().content.split(' ')[0]) {
					image = message.first().content.split(' ')[0].replace(/<<server.banner>>/g, member?.guild.bannerURL({
						size: 2048,
					}));
				}

				ctx.message.channel?.send({
					embeds: [{
						color: 16705372,
						image: {
							url: image,
						},
					}],
				}).catch(() => {
					ctx.message.channel?.send({
						content: `${process.env.FAILURE_EMOJI} | Your image link is invalid. Run the command again to set it up.`,
					});
					return;
				});

				data.image = message.first().content.split(' ')[0];

				await data.save();

				ctx.message.channel?.send({
					content: `${process.env.SUCCESS_EMOJI} | Welcome image is successfully saved. Your image is set on a embed for you to visualize it. Run the command again to change it.`,
				});
			}
			else {
				ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You haven't set a channel for the welcomer, please set a channel first.`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		});

	},
});