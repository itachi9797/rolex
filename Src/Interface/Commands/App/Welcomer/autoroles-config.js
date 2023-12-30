const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/autoroles');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'autoroles-config',
	description: 'Shows the current autoroles configuration.',
	usage: 'autoroles-config',
	aliases: ['autoroles'],
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
					content: `${process.env.FAILURE_EMOJI} | There is no autoroles configuration.`,
					ephemeral: true,
				});
			}
			const humans = data.humans.map((x) => `<@&${x}>`);
			const bots = data.bots.map((x) => `<@&${x}>`);
			if (humans.length && !bots.length) {
				ctx.interaction.reply({
					embeds: [{
						title: 'Autoroles Configuration',
						fields: [{
							name: 'Humans',
							value: humans.join('\n'),
						}],
						color: 16705372,
					}],
				});
			}
			else if (!humans.length && bots.length) {
				ctx.interaction.reply({
					embeds: [{
						title: 'Autoroles Configuration',
						fields: [{
							name: 'Bots',
							value: bots.join('\n'),
						}],
						color: 16705372,
					}],
				});
			}
			else if (humans.length && bots.length) {
				ctx.interaction.reply({
					embeds: [{
						title: 'Autoroles Configuration',
						fields: [{
							name: 'Humans',
							value: humans.join('\n'),
						},
						{
							name: 'Bots',
							value: bots.join('\n'),
						},
						],
						color: 16705372,
					}],
				});
			}
			else if (!humans.length && !bots.length) {
				await data.deleteOne();
				ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no autoroles configuration.`,
					ephemeral: true,
				});
			}
			else {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no autoroles configuration.`,
					ephemeral: true,
				});
			}
		});
	},
});