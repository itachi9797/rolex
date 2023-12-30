const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/welcomer');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'greet-color',
	description: 'Change the embed color for the welcomer.',

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

		let color = ctx.message.content.split(' ').slice(1).shift()?.toLowerCase();

		if (!color) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Please specify a color.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		await Schema.findOne({
			Guild: ctx.message.guild.id,
		}).then(async (data) => {

			if (data) {
				if (data.embed === false) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You haven't enabled embed for the welcomer, please enable embed first.`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				if (color.startsWith('#')) {
					color = color.replace(/#/g, '0x').toUpperCase();
				}

				ctx.message.channel?.send({
					embeds: [{
						description: '­',
						color: Number(color),
					}],
				}).catch(() => {
					ctx.message.channel?.send({
						content: `${process.env.FAILURE_EMOJI} | Your color code is invalid. Run the command again to set it up.`,
					});
					return;
				});

				ctx.message.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully set the color of welcomer embed. Your color is set on a embed for you to visualize it. Run the command again to change it.`,
				});
				data.color = Number(color);
				await data.save();
			}
			else {
				ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You haven't set a channel for the welcomer, please set a channel first.`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		});

	},
});
