const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/loggings');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'logall',
	description: 'Enables/Disables all the logs at once in a channel?.',

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

		const ops = ctx.message.content.split(' ').slice(1).shift();

		if (!ops) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Please provide a valid option! Available options: \`Enable\`, \`Disable\``,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		switch (ops.toLowerCase()) {
			case 'enable':

				const channel = ctx.message.mentions.channels.first() || ctx.message.guild.channels.cache.get(ctx.message.content.split(' ').slice(2).shift()) || ctx.message.guild.channels.cache.find(c => c.name.toLowerCase() === ctx.message.content.split(' ').slice(2).join(' ').toLowerCase());

				if (!channel) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | Please provide a valid channel!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				if (channel?.type !== 0) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You can only set a text channel as the welcomer channel!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				if (!channel?.permissionsFor(ctx.client.user).has(PermissionsBitField.Flags.SendMessages) || !channel?.permissionsFor(ctx.client.user).has(PermissionsBitField.Flags.EmbedLinks)) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | I don't have \`Send Messages\` or \`Embed Links\` permissions in that channel!`,
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
						data.channel = channel?.id,
						data.member = channel?.id,
						data.mod = channel?.id,
						data.message = channel?.id,
						data.role = channel?.id,
						data.server = channel?.id,
						await data.save();
						ctx.message.reply({
							content: `${process.env.SUCCESS_EMOJI} | All logs are sucessfully setted.`,
						});
					}
					else {
						await new Schema({
							Guild: ctx.message.guild.id,
							channel: channel?.id,
							member: channel?.id,
							mod: channel?.id,
							message: channel?.id,
							role: channel?.id,
							server: channel?.id,
						}).save();
						ctx.message.reply({
							content: `${process.env.SUCCESS_EMOJI} | All logs are sucessfully setted.`,
						});
					}
				});
				break;
			case 'disable':
				await Schema.findOne({
					Guild: ctx.message.guild.id,
				}).then(async (data) => {

					if (!data) {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | You don't have logging system enabled for this server!`,
						});
					}
					else {
						await data.deleteOne();
						ctx.message.reply({
							content: `${process.env.SUCCESS_EMOJI} | Logging system disabled for this server!`,
						});
					}
				});
				break;
			default:
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | Please provide a valid option! Available options: \`Enable\`, \`Disable\``,
				});
		}
	},
});