const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/badge');

module.exports = new App({
	name: 'badges',
	description: 'Shows your badges',
	usage: 'badges [user]',
	aliases: ['badge', 'profile'],
	options: [
		{
			name: 'user',
			description: 'Provide a user to view their badges',
			required: false,
			type: 6,
		},
	],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const user = ctx.interaction.options.getUser('user') || ctx.interaction.user;

		Schema.findOne({ User: user?.id }).then(async (data) => {
			if (data) {
				await ctx.interaction.reply({
					embeds: [
						{
							author: {
								name: ctx.client.user?.globalName || ctx.client.user?.username + ' Badges',
								icon_url: ctx.client.user?.displayAvatarURL({ size: 2048 }),
							},
							description: `**Currently ${user?.globalName || user?.username} have ${data.Badges.length} badges.**\n\n${data.Badges.map(
								(badge) => `${badge.name}`,
							).join('\n')}`,
							color: 16705372,

						},
					],
				});
			}
			else if (!data) {
				await ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | This user don't have any badges currently.`,
					ephemeral: true,
				});
			}
		},
		);
	},
});