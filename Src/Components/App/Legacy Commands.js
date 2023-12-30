const Discord = require('discord.js');
const Component = require('../../Structures/Core/Component');
const mediaSchema = require('../../Database/Schemas/media');
const ignoreSchema = require('../../Database/Schemas/ignore');
const Schema = require('../../Database/Schemas/guildprefix');
const Noprefix = require('../../Database/Schemas/noprefix');
const blacklist = require('../../Database/Schemas/blacklist');
const Owners = require('../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new Component({
	name: 'messageCreate',
	/**
     * @param {Rolex} client
     * @param {Discord.Message} message
     */

	run: async (client, message) => {
		if (message.author?.bot) return;
		if (message.channel?.type === 'DM') return;

		if (!message.channel?.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !message.channel?.permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

		const prefix_scheme = await Schema.findOne({
			Guild: message.guild.id,
		});
		const noprefix_scheme = await Noprefix.findOne({
			User: message.author?.id,
		});

		let prefix;

		if (prefix_scheme) {
			prefix = prefix_scheme.prefix;
		}
		else {
			prefix = process.env.PREFIX;
		}

		if (noprefix_scheme) {
			if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) {
				prefix = '';
			}

			const args = message.content.slice(prefix.length).trim().split(/ +/g);
			const command = args.shift()?.toLowerCase();

			if (command?.length === 0) return;

			const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
			if (!cmd) return;

			const Bldata = await blacklist.findOne({
				User: message.author?.id,
			});
			if ((!client.owners.includes(message.author?.id)) && Bldata) return;

			if (message.content.startsWith(prefix + ' ')) {
				return message.reply({
					content: `${process.env.FAILURE_EMOJI} | There should be no space between the prefix and the command!`,
				}).then(msg => {
					setTimeout(() => {
						msg.delete();
					}, 15000);
				});
			}

			const owner_data = await Owners.findOne({
				Guild: message.guild.id,
			});

			const mediaData = await mediaSchema.findOne({
				Guild: message.guild.id,
			});
			if (mediaData && mediaData.channel?.includes(message.channel?.id) && !message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(message.author?.id))) {
				return message.reply({
					content: `${process.env.FAILURE_EMOJI} | This channel is media-only! You cannot use commands here.`,
				}).then(msg => {
					setTimeout(() => {
						msg.delete();
					}, 15000);
				});
			}

			const ignoreData = await ignoreSchema.findOne({
				Guild: message.guild.id,
			});

			if (ignoreData && ignoreData.channel?.includes(message.channel?.id) && !message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(message.author?.id))) {
				return message.reply({
					embeds: [{
						description: 'This channel is ignored! You cannot use commands here.',
						color: 16705372,
					}],
				}).then(msg => {
					setTimeout(() => {
						msg.delete();
					}, 15000);
				});
			}

			client.channels.cache.get(process.env.CMD_LOG).send({
				embeds: [{
					title: 'Command Logging',
					description: `**Command Name:** ${cmd.name}\n**Message Author:** ${message.author?.username} (${message.author?.id})\n**Time:** <t:${Math.floor(Date.now() / 1000)}:R>\n**Guild:** ${message.guild.name} (${message.guild.id})`,
					color: 16705372,
					thumbnail: {
						url: message.guild.iconURL(),
					},
					author: {
						name: message.author?.globalName || message.author?.username,
						icon_url: message.author?.displayAvatarURL({ size: 2048 }),
					},
				}],
			});

			const commandName = cmd.name;
			cmd.run({
				client,
				message,
				Discord,
				commandName,
			});
		}
		else {
			if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

			const args = message.content.slice(prefix.length).trim().split(/ +/g);
			const command = args.shift()?.toLowerCase();

			if (command?.length === 0) return;

			const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
			if (!cmd) return;

			if (message.content.startsWith(prefix + ' ')) {
				return message.reply({
					content: `${process.env.FAILURE_EMOJI} | There should be no space between the prefix and the command!`,
				}).then(msg => {
					setTimeout(() => {
						msg.delete();
					}, 15000);
				});
			}

			const mediaData = await mediaSchema.findOne({
				Guild: message.guild.id,
			});
			if (mediaData && mediaData.channel?.includes(message.channel?.id) && !message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
				return message.reply({
					content: `${process.env.FAILURE_EMOJI} | This channel is media-only! You cannot use commands here.`,
				}).then(msg => {
					setTimeout(() => {
						msg.delete();
					}, 15000);
				});
			}

			const ignoreData = await ignoreSchema.findOne({
				Guild: message.guild.id,
			});

			if (ignoreData && ignoreData.channel?.includes(message.channel?.id) && !message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
				return message.reply({
					embeds: [{
						description: 'This channel is ignored! You cannot use commands here.',
						color: 16705372,
					}],
				}).then(msg => {
					setTimeout(() => {
						msg.delete();
					}, 15000);
				});
			}

			client.channels.cache.get(process.env.CMD_LOG).send({
				embeds: [{
					title: 'Command Logging',
					description: `**Command Name:** ${cmd.name}\n**Message Author:** ${message.author?.username} (${message.author?.id})\n**Time:** <t:${Math.floor(Date.now() / 1000)}:R>\n**Guild:** ${message.guild.name} (${message.guild.id})`,
					color: 16705372,
					thumbnail: {
						url: message.guild.iconURL(),
					},
					author: {
						name: message.author?.globalName || message.author?.username,
						icon_url: message.author?.displayAvatarURL({ size: 2048 }),
					},
				}],
			});

			const commandName = cmd.name;
			cmd.run({
				client,
				message,
				Discord,
				commandName,
			});
		}
	},
});
