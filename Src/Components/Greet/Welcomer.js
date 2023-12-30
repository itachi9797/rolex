const Component = require('../../Structures/Core/Component');
const db = require('../../Database/Schemas/welcomer');
const { PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = new Component({
	name: 'guildMemberAdd',
	/**
     * @param {Rolex} client
     */
	run: async (client, member) => {

		if (member?.user?.bot) return;
		await db.findOne({
			Guild: member?.guild.id,
		}).then(async (data) => {
			if (data) {
				if (data.screening && member?.pending) return;

				const channel = member?.guild.channels.cache.get(data.channel);

				if (!channel) return;

				if (channel?.type !== 0) return;

				if (!channel?.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !channel?.permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

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

				if (color === 'NaN') {
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
						try {
							channel?.send({
								content: message,
								embeds: [embed],
							});
						}
						catch {
							return;
						}
					}
					else {
						try {
							channel?.send({
								embeds: [embed],
							});
						}
						catch {
							return;
						}
					}
				}
				else {
					try {
						channel?.send(message || `Hey ${member?.user?.toString()} <a:wave:1081218289830727701> ,\n<a:welcome:1020270145597362247> Welcome to ${member?.guild.name}!\nUsername: ${member?.user?.username}\nMember Count: ${member?.guild.memberCount}\nJoined At: <t:${Math.floor(member?.joinedAt / 1000)}:F>\nCreated At: <t:${Math.floor(member?.user?.createdTimestamp / 1000)}:F>`);
					}
					catch {
						return;
					}
				}
			}
		});
	},
});