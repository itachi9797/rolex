const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'lock',
	description: 'Locks a mentioned channel in the server!',

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const channel = ctx.message.mentions.channels.first() || ctx.message.guild.channels.cache.get(ctx.message.content.split(' ')[1]) || ctx.message.guild.channels.cache.find(c => c.name.toLowerCase() === ctx.message.content.split(' ').slice(1).join(' ').toLowerCase()) || ctx.message.channel;

		if (!channel) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must provide a valid channel!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});
		if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.ManageRoles) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Roles\` permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}
		if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I do not have \`Manage Roles\` permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		await channel?.permissionOverwrites.edit(ctx.message.guild.roles.everyone, {
			SendMessages: false,
		});

		ctx.message.reply({
			content: `${process.env.SUCCESS_EMOJI} | Succesfully locked <#${channel?.id}>!`,
		});

	},
});