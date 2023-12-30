const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/welcomer');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'greet-embed',
	description: 'Toggle embed for welcomer.',
	usage: 'greet-embed',
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

				if (data.embed === true) {
					data.embed = false;
					await data.save();
					ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Sucessfully disabled embed for welcomer.`,
					});
				}
				else {
					data.embed = true;
					data.description = '­';
					await data.save();
					ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Sucessfully enabled embed for welcomer. You can now set other embed options using:\n\`/greet-author\`, \`/greet-color\`, \`/greet-description\`, \`/greet-footer\`, \`/greet-image\`, \`/greet-thumbnail\`, \`/greet-title\``,
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