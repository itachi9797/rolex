const Component = require('../../Structures/Core/Component');
const Schema = require('../../Database/Schemas/blacklist');
const mediaSchema = require('../../Database/Schemas/media');
const { PermissionsBitField } = require('discord.js');
const PrefixSchema = require('../../Database/Schemas/guildprefix');

module.exports = new Component({
	name: 'messageCreate',
	/**
     * @param {Rolex} client
     * @param {Discord.Message} message
     */
	run: async (client, message) => {
		if (message.webhookId !== null) return;
		if (message.author?.bot) return;
		if (!message.channel?.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !message.channel?.permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;
		const data = await Schema.findOne({
			User: message.author?.id,
		});
		if ((!client.owners.includes(message.author?.id)) && data) return;

		const mediaData = await mediaSchema.findOne({
			Guild: message.guild.id,
		});
		if (mediaData && mediaData.channel?.includes(message.channel?.id)) return;

		const prefix_scheme = await PrefixSchema.findOne({
			Guild: message.guild.id,
		});
		let prefix;

		if (prefix_scheme) {
			prefix = prefix_scheme.prefix;
		}
		else {
			prefix = process.env.PREFIX;
		}

		if (message.content.match(new RegExp(`^<@!?${client.user?.id}>( |)$`))) {
			return message.reply({
				content: `Hey, I'm __**${client.user?.globalName || client.user?.username}**__\n\nTry using the \`${prefix}help\` command to get a list of commands\n\nIf you continue to have problems, consider asking help on our discord server.`,
				components: [{
					type: 1,
					components: [{
						type: 2,
						label: `Invite ${client.user?.globalName || client.user?.username}`,
						url: process.env.BOT_INVITE,
						style: 5,
					},
					{
						type: 2,
						label: 'Support Server',
						url: process.env.SUPPORT_SERVER,
						style: 5,
					},
					{
						type: 2,
						label: 'Privacy Policy',
						url: process.env.PRIVACY_POLICY,
						style: 5,
					},
					],
				}],
			}).catch();
		}

		if (message.content.match(new RegExp(`^<@!?${client.user?.id}>( |)help$`))) {
			return message.reply({ content: `Please use the \`${prefix}help\` command to see a list of commands.` }).catch();
		}
	},
});