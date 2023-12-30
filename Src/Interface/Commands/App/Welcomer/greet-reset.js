const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/welcomer');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'greet-reset',
	description: 'Disable welcome your server.',
	usage: 'greet-reset',
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

		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {

			if (data) {
				await data.deleteOne();
				ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Sucessfully removed greet system from this server.`,
				});
			}
			else {
				ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no greet system in this server.`,
					ephemeral: true,
				});
			}
		});

	},
});