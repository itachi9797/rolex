const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Schema = require('../../../../Database/Schemas/media');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'media-setup',
	description: 'Add/remove media-only channels in your server!',
	aliases: ['media'],

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


		const channel = ctx.message.mentions.channels.first() || ctx.message.guild.channels.cache.get(ctx.message.content.split(' ')[1]) || ctx.message.guild.channels.cache.find(c => c.name.toLowerCase() === ctx.message.content.split(' ').slice(1).join(' ').toLowerCase());

		if (!channel) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must provide a valid channel!`,
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
				data = new Schema({
					Guild: ctx.message.guild.id,
					channels: [],
				});
				data.channel?.push(channel?.id);
				await data.save();
				await ctx.message.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully added <#${channel?.id}> to media-only channels!`,
				});
			}
			else if (data.channel?.includes(channel?.id)) {
				if (data.channel?.filter((x) => x !== channel?.id).length === 0) {
					return Schema.findOneAndDelete({
						Guild: ctx.message.guild.id,
					});
				}
				else {
					data.channel = data.channel?.filter((x) => x !== channel?.id);
					await data.save();
				}
				await ctx.message.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully removed <#${channel?.id}> from media-only channels!`,
				});
			}
			else {
				if (channel?.type !== 0) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You can only add text channels to media-only channels!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
				if (data.channel?.length >= 5) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You can only add 5 channels to media-only channels!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
				data.channel?.push(channel?.id);
				await data.save();
				await ctx.message.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully added <#${channel?.id}> to media-only channels!`,
				});
			}
		});
	},
});