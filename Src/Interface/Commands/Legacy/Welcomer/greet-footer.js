const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/welcomer');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = new App({
	name: 'greet-footer',
	description: 'Sets the footer for the welcomer.',

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
				if (data.embed === true) {
					const subCommand = ctx.message.content.split(' ').slice(1).shift()?.toLowerCase();

					if (!subCommand) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | Please specify a valid option! Available options: \`text\`, \`icon\`.`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}

					if (subCommand === 'text') {
						ctx.message.reply({
							embeds: [{
								title: 'Welcome Footer Tessage Setup',
								description: 'Here are some keywords, which you can use in your welcome footer text.\nSend your message in this channel?.\nIf you want to cancel the setup simply type `cancel`.\n\n```xml\n<<user?.mention>> = To mention the new member\n<<user?.username>> = Username of new member\n<<user?.displayname>> = The display name of the new member\n<<user?.id>> = User id of the new member\n<<server.name>> = Name of the server\n<<server.membercount>> = Total members of the server\n<<user?.joined_at>> = Member\'s server joining time\n<<user?.created_at>> = Member\'s account creation date```',
								color: 16705372,
							}],
						});

						const message = await ctx.message.channel?.awaitMessages({
							filter: (m) => m.author?.id === ctx.message.author?.id && m.content.length > 0,
							max: 1,
							time: 60000,
							errors: ['time'],
						}).catch(() => {
							ctx.message.channel?.send({
								embeds: [{
									description: 'You took too long to respond.  Run the command again to set it up.',
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
								content: `${process.env.SUCCESS_EMOJI} | Sucessfully removed the content.`,
							});
							data.footer_text = null;
							data.footer_icon_url = null;
							await data.save();
							return;
						}

						const member = ctx.message.member;

						let data_message = message.first().content;

						if (message.first().content) {
							data_message = message.first().content.replace(/<<server.name>>/g, member?.guild.name).replace(/<<server.membercount>>/g, member?.guild.memberCount).replace(/<<user?.created_at>>/g, `<t:${Math.floor(member?.user?.createdTimestamp / 1000)}:F>`).replace(/<<user?.joined_at>>/g, `<t:${Math.floor(member?.joinedAt / 1000)}:F>`).replace(/<<user?.id>>/g, member?.user?.id).replace(/<<user?.username>>/g, member?.user?.username).replace(/<<user?.displayname>>/g, member?.user?.globalName || member?.user?.username);
						}

						if (data_message.length > 500) {
							return ctx.message.channel?.send({
								content: `${process.env.FAILURE_EMOJI} | The message length must be less than 500 characters.`,
							});
						}
						data.footer_text = message.first().content;
						await data.save();
						ctx.message.channel?.send({
							content: `${process.env.SUCCESS_EMOJI} | Sucessfully set the footer text for the welcomer.`,
						});
					}
					else if (subCommand === 'icon') {
						if (!data.footer_text) {
							return ctx.message.reply({
								content: `${process.env.FAILURE_EMOJI} | You haven't set the footer text yet. Please set the footer text first.`,

							});
						}
						ctx.message.reply({
							embeds: [{
								title: 'Welcome Footer Icon Setup',
								description: 'Here are some keywords, which you can use in your welcome footer icon. You can also send image links to set in footer icon.\nSend your link/keywords in this channel?.\nIf you want to cancel the setup simply type `cancel`.\nIf you want to remove existing thumbnail simply type `remove`.\n\n```xml\n<<member_avatar>> = Shows the member\'s avatar\n<<server.icon>> = Shows the server icon.```',
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
								content: `${process.env.SUCCESS_EMOJI} | Sucessfully removed the footer icon.`,
							});
							data.footer_icon_url = null;
							await data.save();
							return;
						}

						if (!message.first().content.startsWith('https://') && message.first().content.toLowerCase() !== '<<server.icon>>' && message.first().content.toLowerCase() !== '<<member_avatar>>') {
							return ctx.message.channel?.send({
								content: `${process.env.FAILURE_EMOJI} | Your link doesn't start with https! Run the command again to set it up.`,
							});
						}

						const member = ctx.message.member;
						let footer_icon_url = message.first().content.replace(/<<server.icon>>/g, member?.guild.iconURL({
							size: 4096,
						})).replace(/<<member_avatar>>/g, member?.user?.displayAvatarURL({
							size: 4096,
						}));

						if (footer_icon_url === 'null') {
							footer_icon_url = null;
						}

						const embed = new EmbedBuilder()
							.setDescription('­')
							.setFooter({
								text: 'This is a preview of the footer icon.',
								iconURL: footer_icon_url,
							});

						ctx.message.channel?.send({
							embeds: [embed],
						}).catch(() => {
							return ctx.message.channel?.send({
								content: `${process.env.FAILURE_EMOJI} | Your link is invalid! Run the command again to set it up.`,
							});
						});

						data.footer_icon_url = message.first().content.split(' ')[0];
						await data.save();
						ctx.message.channel?.send({
							content: `${process.env.SUCCESS_EMOJI} | Sucessfully set the footer icon for the welcomer. You can see the preview in the embed above.`,
						});
					}
					else {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | Please specify a valid option! Available options: \`text\`, \`icon\`.`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
				}
				else {
					ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You haven't enabled embed for the welcomer, please enable embed first.`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
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