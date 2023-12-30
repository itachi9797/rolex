const Component = require('../Structures/Core/Component');

module.exports = new Component({
	name: 'giveawayReactionAdded',
	/**
     * @param {Rolex} client
     */
	run: async (client, giveaway, member, reaction) => {
		if (giveaway.exemptMembers) {
			await giveaway.exemptMembers(member).then((res) => {
				if (res) {
					reaction.users.remove(member?.user);
				}
			});
		}
	},
});