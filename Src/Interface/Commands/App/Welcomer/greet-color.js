const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/welcomer');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'greet-color',
	description: 'Change the embed color for the welcomer.',
	usage: 'greet-color <color>',
	userPermissions: ['Manage Server'],
	options: [{
		name: 'color',
		description: 'The color of the embed.',
		type: 3,
		required: true,
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

		let color = ctx.interaction.options.getString('color');

		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {

			if (data) {
				if (data.embed === false) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | You haven't enabled embed for the welcomer, please enable embed first.`,
						ephemeral: true,
					});
				}

				if (color.startsWith('#')) {
					color = color.replace(/#/g, '0x').toUpperCase();
				}

				ctx.interaction.channel?.send({
					embeds: [{
						description: '­',
						color: Number(color),
					}],
				}).catch(() => {
					ctx.interaction.channel?.send({
						content: `${process.env.FAILURE_EMOJI} | Your color code is invalid. Run the command again to set it up.`,
					});
					return;
				});

				ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully set the color of welcomer embed. Your color is set on a embed for you to visualize it. Run the command again to change it.`,
				});
				data.color = Number(color);
				await data.save();
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