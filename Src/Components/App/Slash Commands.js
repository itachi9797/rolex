const Discord = require('discord.js');
const Component = require('../../Structures/Core/Component');
const Schema = require('../../Database/Schemas/blacklist');
const mediaSchema = require('../../Database/Schemas/media');
const ignoreSchema = require('../../Database/Schemas/ignore');
const Owners = require('../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new Component({
	name: 'interactionCreate',
	/**
     * @param {Rolex} client
     * @param {Discord.Interaction} interaction
     */
	run: async (client, interaction) => {
		if (interaction.isChatInputCommand()) {
			if (!interaction.guild) {
				return interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | This command can only be used in a server.`,
					ephemeral: true,
				});
			}

			const Bldata = await Schema.findOne({
				User: interaction.user?.id,
			});
			if ((!client.owners.includes(interaction.user?.id)) && Bldata) {
				return interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | You are blacklisted from using this bot. Contact the support server for more info.`,
					components: [{
						type: 1,
						components: [{
							type: 2,
							label: 'Support Server',
							url: process.env.SUPPORT_SERVER,
							style: 5,
						}],
					}],
					ephemeral: true,
				});
			}

			const owner_data = await Owners.findOne({
				Guild: interaction.guild.id,
			});
			const mediaData = await mediaSchema.findOne({
				Guild: interaction.guild.id,
			});
			if (mediaData && mediaData.channel?.includes(interaction.channel?.id) && !interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(interaction.member?.id))) {
				return interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | This channel is media-only! You cannot use commands here.`,
					ephemeral: true,
				});
			}

			const ignoreData = await ignoreSchema.findOne({
				Guild: interaction.guild.id,
			});

			if (ignoreData && ignoreData.channel?.includes(interaction.channel?.id) && !interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(interaction.member?.id))) {
				return interaction.reply({
					embeds: [{
						description: 'This channel is ignored! You cannot use commands here.',
						color: 16705372,
					}],
					ephemeral: true,
				});
			}

			const command = client.slashCommands.get(interaction.commandName);

			if (!command) {
				return interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | An error occurred while executing this command.`,
					ephemeral: true,
				});
			}

			client.channels.cache.get(process.env.CMD_LOG).send({
				embeds: [{
					title: 'Command Logging',
					description: `**Command Name:** ${command.name}\n**Interaction User:** ${interaction.user?.username} (${interaction.user?.id})\n**Time:** <t:${Math.floor(Date.now() / 1000)}:R>\n**Command Options:** ${command.options ? command.options.map(e => `\`${e.name}\``).join(', ') : 'None'}\n**Guild:** ${interaction.guild.name} (${interaction.guild.id})`,
					color: 16705372,
					thumbnail: {
						url: interaction.guild.iconURL(),
					},
					author: {
						name: interaction.user?.globalName || interaction.user?.username,
						icon_url: interaction.user?.displayAvatarURL({ size: 2048 }),
					},
				}],
			});

			const commandName = command.name;

			command.run({
				client,
				interaction,
				Discord,
				commandName,
			});
		}

		if (interaction.isContextMenuCommand()) {
			if (!interaction.guild) {
				return interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | This command can only be used in a server.`,
					ephemeral: true,
				});
			}

			const owner_data = await Owners.findOne({
				Guild: interaction.guild.id,
			});
			const Bldata = await Schema.findOne({
				User: interaction.user?.id,
			});

			if ((!client.owners.includes(interaction.user?.id)) && Bldata) {
				return interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | You are blacklisted from using this bot. Contact the support server for more info.`,
					components: [{
						type: 1,
						components: [{
							type: 2,
							label: 'Support Server',
							url: process.env.SUPPORT_SERVER,
							style: 5,
						}],
					}],
					ephemeral: true,
				});
			}

			const mediaData = await mediaSchema.findOne({
				Guild: interaction.guild.id,
			});
			if (mediaData && mediaData.channel?.includes(interaction.channel?.id) && !interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(interaction.member?.id))) {
				return interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | This channel is media-only! You cannot use commands here.`,
					ephemeral: true,
				});
			}

			const ignoreData = await ignoreSchema.findOne({
				Guild: interaction.guild.id,
			});

			if (ignoreData && ignoreData.channel?.includes(interaction.channel?.id) && !interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(interaction.member?.id))) {
				return interaction.reply({
					embeds: [{
						description: 'This channel is ignored! You cannot use commands here.',
						color: 16705372,
					}],
					ephemeral: true,
				});
			}

			const command = client.slashCommands.get(interaction.commandName);

			if (!command) {
				return interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | An error occurred while executing this command.`,
					ephemeral: true,
				});
			}

			client.channels.cache.get(process.env.CMD_LOG).send({
				embeds: [{
					title: 'Command Logging',
					description: `**Command Name:** ${command.name}\n**Interaction User:** ${interaction.user?.username} (${interaction.user?.id})\n**Time:** <t:${Math.floor(Date.now() / 1000)}:R>\n**Command Options:** ${command.options ? command.options.map(e => `\`${e.name}\``).join(', ') : 'None'}\n**Guild:** ${interaction.guild.name} (${interaction.guild.id})`,
					color: 16705372,
					thumbnail: {
						url: interaction.guild.iconURL(),
					},
					author: {
						name: interaction.user?.globalName || interaction.user?.username,
						icon_url: interaction.user?.displayAvatarURL({ size: 2048 }),
					},
				}],
			});

			const commandName = command.name;

			command.run({
				client,
				interaction,
				Discord,
				commandName,
			});
		}
	},
});
