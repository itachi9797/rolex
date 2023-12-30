const App = require('../../../../Structures/Core/App');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'gcancel',
	description: 'Deletes a giveaway!',
	usage: 'gcancel <message id>',
	aliases: ['gdelete'],
	userPermissions: ['Manage Server'],
	options: [{
		name: 'message_id',
		description: 'The message id of the giveaway you want to delete.',
		type: 3,
		required: false,
	}],

	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.interaction.guild.id,
		});

		const giveawayRole = ctx.interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'giveaways');

		if (!ctx.interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id)) && !ctx.interaction.member?.roles.cache.has(giveawayRole?.id)) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You need the \`Manage Server\` permissions or Giveaways role to cancel a giveaway!`,
				ephemeral: true,
			});
		}

		let messageID = ctx.interaction.options.getString('message_id');

		if (!messageID) {
			const lastGiveaway = ctx.client.giveawaysManager.giveaways.filter((g) => g.channelId === ctx.interaction.channel?.id);
			if (!lastGiveaway) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | Unable to find a giveaway!`,
					ephemeral: true,
				});
			}
			messageID = lastGiveaway[lastGiveaway.length - 1].messageId;
		}

		const giveaway = ctx.client.giveawaysManager.giveaways.find((g) => g.messageId === messageID && g.guildId === ctx.interaction.guild.id);

		if (!giveaway) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | Unable to find a giveaway for \`${messageID}\``,
				ephemeral: true,
			});
		}

		ctx.client.giveawaysManager
			.delete(messageID, true)
			.then(() => {
				ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Giveaway deleted!`,
					ephemeral: true,
				});
			}).catch(() => {
				ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | No giveaway found for \`${messageID}\`!`,
					ephemeral: true,
				});
			});
	},
});