const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Schema = require('../../../../Database/Schemas/vc-role');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'vcrole-reset',
	description: 'Removes all configurations for the VC roles.',
	usage: 'vcrole-reset',
	userPermissions: ['Manage Server'],

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
		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {
			if (!data) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no configuration for VC roles in this server!`,
					ephemeral: true,
				});
			}
			await Schema.findOneAndDelete({
				Guild: ctx.interaction.guild.id,
			});
			await ctx.interaction.reply({
				content: `${process.env.SUCCESS_EMOJI} | Successfully removed all configuration for VC roles in this server!`,
			});
		});
	},
});