const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'lock',
	description: 'Locks a mentioned channel in the server!',
	usage: 'lock [channel]',
	userPermissions: ['Manage Roles'],
	options: [{
		name: 'channel',
		description: 'The channel/category you want to lock!',
		required: false,
		type: 7,
	}],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const channel = ctx.interaction.options.getChannel('channel') || ctx.interaction.channel;

		const owner_data = await Owners.findOne({
			Guild: ctx.interaction.guild.id,
		});
		if (!ctx.interaction.member?.permissions.has(PermissionsBitField.Flags.ManageRoles) && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Roles\` permissions!`,
				ephemeral: true,
			});
		}
		if (!ctx.interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | I do not have \`Manage Roles\` permissions!`,
				ephemeral: true,
			});
		}

		await channel?.permissionOverwrites.edit(ctx.interaction.guild.roles.everyone, {
			SendMessages: false,
		});

		ctx.interaction.reply({
			content: `${process.env.SUCCESS_EMOJI} | Succesfully locked <#${channel?.id}>!`,
		});

	},
});