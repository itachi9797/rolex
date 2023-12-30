const Component = require('../Structures/Core/Component');
const { EmbedBuilder } = require('discord.js');

module.exports = new Component({
	name: 'giveawayDeleted',
	/**
     * @param {Rolex} client
     */

	run: async (client, giveaway) => {
		if (!giveaway.message) return;

		const embed = new EmbedBuilder()
			.setTitle(giveaway.message?.embeds[0].title)
			.setTimestamp(Date.parse(giveaway.message?.embeds[0].timestamp))
			.setFooter({
				text: giveaway.message?.embeds[0].footer.text,
			})
			.setDescription(giveaway.message?.embeds[0].description)
			.setColor(15158332);

		giveaway.message?.edit({
			content: '🎉 **Giveaway Deleted**',
			embeds: [embed],
		});
	},
});