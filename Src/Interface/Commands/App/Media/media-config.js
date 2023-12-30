const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Schema = require('../../../../Database/Schemas/media');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'media-config',
	description: 'Shows the configuration for the media.',
	usage: 'media-config',
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
					content: `${process.env.FAILURE_EMOJI} | There is no configuration for media-only channels in this server!`,
					ephemeral: true,
				});
			}

			const description = data.channel
				.map((r) => r)
				.map((r, i) => `\`[${i + 1}]\` | <#${r}> | \`[${r}]\``)
				.join('\n');

			await ctx.interaction.reply({
				embeds: [{
					title: 'Media Configuration',
					description: description,
					color: 16705372,
				}],
			});
		});
	},
});