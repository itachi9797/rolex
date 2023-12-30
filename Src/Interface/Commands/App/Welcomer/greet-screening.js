const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/welcomer');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'greet-screening',
	description: 'Toggle screening for welcomer.',
	usage: 'greet-screening',
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
				if (data.screening === true) {
					data.screening = false;
					await data.save();
					ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Sucessfully disabled screening for welcomer.`,
					});
				}
				else {
					data.screening = true;
					await data.save();
					ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Sucessfully enabled screening for welcomer.`,
					});
				}
			}
			else {
				ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | You haven't set a channel for the welcomer, please set a channel first.`,
					ephemeral: true,
				});
			}
		});
	},
});