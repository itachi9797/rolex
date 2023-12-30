const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/loggings');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'modlog',
	description: 'Log mod actions in the server.',
	usage: 'modlog <channel>',
	userPermissions: ['Manage Server'],
	options: [{
		name: 'channel',
		description: 'The channel you want to set!',
		required: true,
		type: 7,
		channel_types: [0],
	}],

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

		if (ctx.interaction.member?.id !== ctx.interaction.guild.ownerId && ctx.interaction.member?.roles.highest.position <= ctx.interaction.guild.members.me.roles.highest.position && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You must be above me to use this command.`,
				ephemeral: true,
			});
		}

		const channel = ctx.interaction.options.getChannel('channel');
		if (channel?.type !== 0) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You can only set a text channel as the log channel!`,
				ephemeral: true,
			});
		}

		if (!channel?.permissionsFor(ctx.client.user).has(PermissionsBitField.Flags.SendMessages) || !channel?.permissionsFor(ctx.client.user).has(PermissionsBitField.Flags.EmbedLinks)) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | I don't have \`Send Messages\` or \`Embed Links\` permissions in that channel!`,
				ephemeral: true,
			});
		}
		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {

			if (data) {
				data.mod = channel?.id;
				await data.save();
			}
			else {
				new Schema({
					Guild: ctx.interaction.guild.id,
					mod: channel?.id,
				}).save();
			}
			ctx.interaction.reply({
				content: `${process.env.SUCCESS_EMOJI} | Successfully set the mod logs to ${channel}!`,
			});
		});
	},
});