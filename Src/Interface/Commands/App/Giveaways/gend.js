const App = require('../../../../Structures/Core/App');
const Owners = require('../../../../Database/Schemas/owners');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'gend',
	description: 'Ends a giveaway!',
	usage: 'gend <message id>',
	userPermissions: ['Manage Server'],
	options: [{
		name: 'message_id',
		description: 'The message id of the giveaway you want to end.',
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
				content: `${process.env.FAILURE_EMOJI} | You need the \`Manage Server\` permissions or Giveaways role to end a giveaway!`,
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

		const winMessageEmbed = new EmbedBuilder()
			.setTitle('Giveaway Ended')
			.setDescription('<a:giveaways:1099213761467924480> Congratulations! You won **{this.prize}**!!\nPlease contact {this.hostedBy} to claim your prize.')
			.setColor(3092790);

		ctx.client.giveawaysManager
			.end(messageID, {
				winMessage: {
					content: 'Congratulations, {winners}!',
					embed: winMessageEmbed,
					replyToGiveaway: true,
				},
			})
			.then(() => {
				ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Giveaway Ended!`,
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