const Component = require('../Structures/Core/Component');

module.exports = new Component({
	name: 'endedGiveawayReactionAdded',
	/**
     * @param {Rolex} client
     */

	run: async (client, giveaway, member, reaction) => {
		return reaction.users.remove(member?.user);
	},
});