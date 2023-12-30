const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/loggings');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'channellog',
	description: 'Log create/edit/delete a channel?.',
	aliases: ['chlog'],

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

		if (channel?.type !== 0) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You can only set a text channel as the log channel!`,

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
				data.channel = channel?.id;
				await data.save();
			}
			else {
				new Schema({
					Guild: ctx.message.guild.id,
					channel: channel?.id,
				}).save();
			}
			ctx.message.reply({
				content: `${process.env.SUCCESS_EMOJI} | Successfully set the channel logs to ${channel}!`,
			});
		});
	},
});