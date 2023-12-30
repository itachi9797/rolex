const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/welcomer');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = new App({
	name: 'greet-author',
	description: 'Sets the author for the welcomer.',
	usage: 'greet-author <name>/<image>',
	userPermissions: ['Manage Server'],
	options: [{
		name: 'name',
		description: 'The name of the author',
		type: 1,
	},
	{
		name: 'icon',
		description: 'The image for the author',
		type: 1,
	},
	],
	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.interaction.guild.id,
		});
		if (!ctx.interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Server\` permissions!`,
				ephemeral: true,
			});
		}

		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {

			if (data) {
				if (data.embed === true) {
					if (ctx.interaction.options.getSubcommand() === 'name') {
						ctx.interaction.reply({
							embeds: [{
								title: 'Welcome Author Name Setup',
								description: 'Here are some keywords, which you can use in your welcome author text.\nSend your message in this channel?.\nIf you want to cancel the setup simply type `cancel`.\n\n```xml\n<<user?.username>> = Username of new member\n<<user?.displayname>> = The display name of the new member\n<<user?.id>> = User id of the new member\n<<server.name>> = Name of the server\n<<server.membercount>> = Total members of the server\n<<user?.joined_at>> = Member\'s server joining time\n<<user?.created_at>> = Member\'s account creation date```',
								color: 16705372,
							}],
						});

						const message = await ctx.interaction.channel?.awaitMessages({
							filter: (m) => m.author?.id === ctx.interaction.user?.id && m.content.length > 0,
							max: 1,
							time: 60000,
							errors: ['time'],
						}).catch(() => {
							ctx.interaction.channel?.send({
								embeds: [{
									description: 'You took too long to respond.  Run the command again to set it up.',
									color: 16705372,
								}],
							});
						});

						if (!message) return;

						if (message.first().content.toLowerCase() === 'cancel') {
							ctx.interaction.channel?.send({
								content: 'Cancelled the setup. Run the command again to set it up.',
							});
							return;
						}

						if (message.first().content.toLowerCase() === 'remove') {
							ctx.interaction.channel?.send({
								content: `${process.env.SUCCESS_EMOJI} | Sucessfully removed the content.`,
							});
							data.author_name = null;
							data.author_icon_url = null;
							await data.save();
							return;
						}

						const member = ctx.interaction.member;

						let data_message = message.first().content;

						if (message.first().content) {
							data_message = message.first().content.replace(/<<server.name>>/g, member?.guild.name).replace(/<<server.membercount>>/g, member?.guild.memberCount).replace(/<<user?.created_at>>/g, `<t:${Math.floor(member?.user?.createdTimestamp / 1000)}:F>`).replace(/<<user?.joined_at>>/g, `<t:${Math.floor(member?.joinedAt / 1000)}:F>`).replace(/<<user?.id>>/g, member?.user?.id).replace(/<<user?.username>>/g, member?.user?.username).replace(/<<user?.displayname>>/g, member?.user?.globalName || member?.user?.username);
						}

						if (data_message.length > 256) {
							return ctx.interaction.channel?.send({
								content: `${process.env.FAILURE_EMOJI} | The message length must be less than 256 characters.`,
							});
						}
						data.author_name = message.first().content;
						await data.save();
						ctx.interaction.channel?.send({
							content: `${process.env.SUCCESS_EMOJI} | Sucessfully set the author name for the welcomer.`,
						});
					}
					else if (ctx.interaction.options.getSubcommand() === 'icon') {
						if (!data.author_name) {
							return ctx.interaction.reply({
								content: `${process.env.FAILURE_EMOJI} | You haven't set the author name yet. Please set the author name first.`,
								ephemeral: true,
							});
						}
						ctx.interaction.reply({
							embeds: [{
								title: 'Welcome Author Icon Setup',
								description: 'Here are some keywords, which you can use in your welcome author icon. You can also send image links to set in author icon.\nSend your link/keywords in this channel?.\nIf you want to cancel the setup simply type `cancel`.\nIf you want to remove existing thumbnail simply type `remove`.\n\n```xml\n<<member_avatar>> = Shows the member\'s avatar\n<<server.icon>> = Shows the server icon.```',
								color: 16705372,
							}],
						});
						const message = await ctx.interaction.channel?.awaitMessages({
							filter: m => m.author?.id === ctx.interaction.user?.id,
							max: 1,
							time: 60000,
							errors: ['time'],
						}).catch(() => {
							ctx.interaction.channel?.send({
								embeds: [{
									description: 'You took too long to respond. Run the command again to set it up.',
									color: 16705372,
								}],
							});
						});

						if (!message) return;

						if (message.first().content.toLowerCase() === 'cancel') {
							ctx.interaction.channel?.send({
								content: 'Cancelled the setup. Run the command again to set it up.',
							});
							return;
						}

						if (message.first().content.toLowerCase() === 'remove') {
							ctx.interaction.channel?.send({
								content: `${process.env.SUCCESS_EMOJI} | Sucessfully removed the author icon.`,
							});
							data.author_icon_url = null;
							await data.save();
							return;
						}

						if (!message.first().content.startsWith('https://') && message.first().content.toLowerCase() !== '<<server.icon>>' && message.first().content.toLowerCase() !== '<<member_avatar>>') {
							return ctx.interaction.channel?.send({
								content: `${process.env.FAILURE_EMOJI} | Your link doesn't start with https! Run the command again to set it up.`,
							});
						}

						const member = ctx.interaction.member;
						let author_icon_url = message.first().content.split(' ')[0].replace(/<<server.icon>>/g, member?.guild.iconURL()).replace(/<<member_avatar>>/g, member?.user?.displayAvatarURL({
							size: 2048,
						}));

						if (author_icon_url === 'null') {
							author_icon_url = null;
						}
						const embed = new EmbedBuilder()
							.setAuthor({
								name: 'This is a preview of the author icon.',
								iconURL: author_icon_url,
							})
							.setDescription('­');

						ctx.interaction.channel?.send({
							embeds: [embed],
						}).catch(() => {
							ctx.interaction.channel?.send({
								content: `${process.env.FAILURE_EMOJI} | Your link is invalid! Run the command again to set it up.`,
							});
							return;
						});

						data.author_icon_url = message.first().content.split(' ')[0];
						await data.save();
						ctx.interaction.channel?.send({
							content: `${process.env.SUCCESS_EMOJI} | Sucessfully set the author icon for the welcomer. Here is a preview of the author icon.`,
						});
					}
				}
				else {
					ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | You haven't enabled embed for the welcomer, please enable embed first.`,
						ephemeral: true,
					});
				}
			}
			else {
				ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | You haven't set a channel for the welcomer, please set a channel first.`,
					ephemeral: true,
				});
			}
		});

	},
});