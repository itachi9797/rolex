const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Schema = require('../../../../Database/Schemas/media');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'media-setup',
	description: 'Add/remove media-only channels in your server!',
	usage: 'media-setup [channel]',
	userPermissions: ['Manage Server'],
	aliases: ['media'],
	options: [{
		name: 'channel',
		description: 'The channel you want to configure!',
		required: false,
		type: 7,
		channel_types: [0],
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
		if (ctx.interaction.member?.id !== ctx.interaction.guild.ownerId && ctx.interaction.member?.roles.highest.position <= ctx.interaction.guild.members.me.roles.highest.position && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You must be above me to use this command.`,
				ephemeral: true,
			});
		}

		const channel = ctx.interaction.options.getChannel('channel') || ctx.interaction.channel;

		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {
			if (!data) {
				data = new Schema({
					Guild: ctx.interaction.guild.id,
					channels: [],
				});
				data.channel?.push(channel?.id);
				await data.save();
				await ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully added <#${channel?.id}> to media-only channels!`,
				});
			}
			else if (data.channel?.includes(channel?.id)) {
				if (data.channel?.filter((x) => x !== channel?.id).length === 0) {
					return Schema.findOneAndDelete({
						Guild: ctx.interaction.guild.id,
					});
				}
				else {
					data.channel = data.channel?.filter((x) => x !== channel?.id);
					await data.save();
				}
				await ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully removed <#${channel?.id}> from media-only channels!`,
				});
			}
			else {
				if (channel?.type !== 0) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | You can only add text channels to media-only channels!`,
						ephemeral: true,
					});
				}
				if (data.channel?.length >= 5) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | You can only add 5 channels to media-only channels!`,
						ephemeral: true,
					});
				}
				data.channel?.push(channel?.id);
				await data.save();
				await ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully added <#${channel?.id}> to media-only channels!`,
				});
			}
		});
	},
});