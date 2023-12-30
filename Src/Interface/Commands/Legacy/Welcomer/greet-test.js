const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/welcomer');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = new App({
	name: 'greet-test',
	description: 'Test the welcome message and how it will look like.',

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
				const member = ctx.message.member;
				const channel = ctx.message.guild.channels.cache.get(data.channel);

				if (!channel) return;

				if (channel?.type !== 0) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | The channel which is set for welcomer is not a text channel!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				if (!channel?.permissionsFor(ctx.client.user).has(PermissionsBitField.Flags.SendMessages) || !channel?.permissionsFor(ctx.client.user).has(PermissionsBitField.Flags.EmbedLinks)) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | I don't have \`Send Messages\` or \`Embed Links\` permissions in that channel!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				let message = data.content;

				if (data.content) {
					message = data.content.replace(/<<server.name>>/g, member?.guild.name).replace(/<<server.membercount>>/g, member?.guild.memberCount).replace(/<<user?.mention>>/g, member?.user?.toString()).replace(/<<user?.created_at>>/g, `<t:${Math.floor(member?.user?.createdTimestamp / 1000)}:F>`).replace(/<<user?.joined_at>>/g, `<t:${Math.floor(member?.joinedAt / 1000)}:F>`).replace(/<<user?.id>>/g, member?.user?.id).replace(/<<user?.username>>/g, member?.user?.username).replace(/<<user?.displayname>>/g, member?.user?.globalName || member?.user?.username);
				}

				let title = data.title;

				if (data.title) {
					title = data.title.replace(/<<server.name>>/g, member?.guild.name).replace(/<<user?.username>>/g, member?.user?.username).replace(/<<user?.displayname>>/g, member?.user?.globalName || member?.user?.username);
				}

				let footer_text = data.footer_text;

				if (data.footer_text) {
					footer_text = data.footer_text.replace(/<<server.name>>/g, member?.guild.name).replace(/<<server.membercount>>/g, member?.guild.memberCount).replace(/<<user?.created_at>>/g, `<t:${Math.floor(member?.user?.createdTimestamp / 1000)}:F>`).replace(/<<user?.joined_at>>/g, `<t:${Math.floor(member?.joinedAt / 1000)}:F>`).replace(/<<user?.id>>/g, member?.user?.id).replace(/<<user?.username>>/g, member?.user?.username).replace(/<<user?.displayname>>/g, member?.user?.globalName || member?.user?.username);
				}

				let footer_icon_url = data.footer_icon_url;

				if (data.footer_icon_url) {
					footer_icon_url = data.footer_icon_url.replace(/<<server.icon>>/g, member?.guild.iconURL()).replace(/<<member_avatar>>/g, member?.user?.displayAvatarURL({
						size: 2048,
					}));
				}

				if (footer_icon_url === 'null') footer_icon_url = null;

				let author_name = data.author_name;

				if (data.author_name) {
					author_name = data.author_name.replace(/<<server.name>>/g, member?.guild.name).replace(/<<user?.username>>/g, member?.user?.username).replace(/<<user?.displayname>>/g, member?.user?.globalName || member?.user?.username);
				}

				let author_icon_url = data.author_icon_url;

				if (data.author_icon_url) {
					author_icon_url = data.author_icon_url.replace(/<<server.icon>>/g, member?.guild.iconURL()).replace(/<<member_avatar>>/g, member?.user?.displayAvatarURL({
						size: 2048,
					}));
				}

				if (author_icon_url === 'null') author_icon_url = null;

				let description = data.description;

				if (data.description) {
					description = data.description.replace(/<<server.name>>/g, member?.guild.name).replace(/<<server.membercount>>/g, member?.guild.memberCount).replace(/<<user?.mention>>/g, member?.user?.toString()).replace(/<<user?.created_at>>/g, `<t:${Math.floor(member?.user?.createdTimestamp / 1000)}:F>`).replace(/<<user?.joined_at>>/g, `<t:${Math.floor(member?.joinedAt / 1000)}:F>`).replace(/<<user?.id>>/g, member?.user?.id).replace(/<<user?.username>>/g, member?.user?.username).replace(/<<user?.displayname>>/g, member?.user?.globalName || member?.user?.username);
				}

				if (!data.description) description = '­';

				let thumbnail = data.thumbnail;

				if (data.thumbnail) {
					thumbnail = data.thumbnail.replace(/<<server.icon>>/g, member?.guild.iconURL()).replace(/<<member_avatar>>/g, member?.user?.displayAvatarURL({
						size: 2048,
					}));
				}

				if (thumbnail === 'null') thumbnail = null;

				let image = data.image;

				if (data.image) {
					image = data.image.replace(/<<server.banner>>/g, member?.guild.bannerURL({
						size: 2048,
					}));
				}

				if (image === 'null') image = null;

				let color = data.color;

				if (!color || color === 'NaN') {
					color = 16705372;
				}


				if (data.embed === true) {
					const embed = new EmbedBuilder();
					if (data.title) embed.setTitle(title);
					if (data.description) embed.setDescription(description);
					if (data.color) embed.setColor(Number(color));
					if (data.thumbnail) embed.setThumbnail(thumbnail);
					if (data.image) embed.setImage(image);
					if (data.footer_text) {
						embed.setFooter({
							text: footer_text,
							iconURL: footer_icon_url,
						});
					}
					if (data.author_name) {
						embed.setAuthor({
							name: author_name,
							url: process.env.SUPPORT_SERVER,
							iconURL: author_icon_url,
						});
					}

					if (message) {
						channel?.send({
							content: message,
							embeds: [embed],
						}).catch();
					}
					else {
						channel?.send({
							embeds: [embed],
						}).catch();
					}
				}
				else {
					channel?.send(message || `Hey ${member?.user?.toString()} <a:wave:1081218289830727701> ,\n<a:welcome:1020270145597362247> Welcome to ${member?.guild.name}!\nUsername: ${member?.user?.username}\nMember Count: ${member?.guild.memberCount}\nJoined At: <t:${Math.floor(member?.joinedAt / 1000)}:F>\nCreated At: <t:${Math.floor(member?.user?.createdTimestamp / 1000)}:F>`).catch();
				}
				ctx.message.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully sent greet message to <#${data.channel}>. If you don't see the message, please check the channel permissions.`,
				});
			}
			else {
				ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no greet system in this server.`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		});
	},
});