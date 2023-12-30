const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/autoroles');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'autoroles-reset',
	description: 'Reset the autoroles list.',
	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});
		if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Server\` permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (ctx.message.member?.id !== ctx.message.guild.ownerId && ctx.message.member?.roles.highest.position <= ctx.message.guild.members.me.roles.highest.position && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must be above me to use this command.`,

			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}
		await Schema.findOne({
			Guild: ctx.message.guild.id,
		}).then(async (data) => {

			if (!data) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no autoroles configuration.`,

				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
			await data.deleteOne();
			ctx.message.reply({
				content: `${process.env.SUCCESS_EMOJI} | The autoroles configuration has been reset.`,
			});
		});
	},
});