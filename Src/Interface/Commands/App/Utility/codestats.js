const App = require('../../../../Structures/Core/App');
const { getCodeStats } = require('../../../../Structures/Utils/Functions/getCodeStats');

module.exports = new App({
	name: 'codestats',
	description: 'Get the code statistics for the project',
	usage: 'codestats',

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		await ctx.interaction.deferReply();

		const stats = await getCodeStats();

		const table = `\`\`\`ml\n+------------+-------+\n| Code       | Count |\n+------------+-------+\n| Files      | ${stats.files.toString().padStart(5)} |\n| Lines      | ${stats.lines.toString().padStart(5)} |\n| Imports    | ${stats.imports.toString().padStart(5)} |\n| Classes    | ${stats.classes.toString().padStart(5)} |\n| Comments   | ${stats.docstrings.toString().padStart(5)} |\n| Functions  | ${stats.functions.toString().padStart(5)} |\n| Coroutines | ${stats.coroutines.toString().padStart(5)} |\n| Docstrings | ${stats.docstrings.toString().padStart(5)} |\n+------------+-------+\n\`\`\``;

		await ctx.interaction.editReply({
			embeds: [{
				author: {
					name: 'Code Statistics',
					icon_url: ctx.client.user?.displayAvatarURL({ size: 2048 }),
					url: process.env.SUPPORT_SERVER,
				},
				description: `**__*Here are the code statistics for the project:*__**\n\n${table}`,
				footer: {
					text: `Last updated: ${new Date().toUTCString()}`,
					icon_url: ctx.interaction.guild.icon === null ? null : ctx.interaction.guild.iconURL(),
				},
				color: 16705372,
			}],
		});
	},
});