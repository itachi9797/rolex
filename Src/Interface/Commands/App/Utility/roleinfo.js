const App = require('../../../../Structures/Core/App');
const { separateWords } = require('../../../../Structures/Utils/Functions/separateWords');

module.exports = new App({
	name: 'roleinfo',
	description: 'Shows roleinfo for the mentioned role',
	usage: 'roleinfo <role>',
	aliases: ['ri'],
	options: [{
		name: 'role',
		description: 'The role to get the roleinfo of!',
		type: 8,
		required: true,
	}],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const role = ctx.interaction.options.getRole('role');

		const perms = role.permissions.toArray();

		let finalperms;
		if (perms?.includes('Administrator')) {
			finalperms = 'Administrator [All permission]';
		}
		else {
			const permstext = [];

			perms.forEach(permission => {
				const normalizedPermission = separateWords(permission);
				permstext.push(normalizedPermission);
			});
			finalperms = permstext.join(', ') || 'The role has no permissions.';
		}

		await ctx.interaction.reply({
			embeds: [{
				author: {
					name: `${role.name}'s Information`,
					icon_url: ctx.client.user?.displayAvatarURL({ size: 2048 }),
				},
				fields: [{
					name: '__General Info__',
					value: `**Role Name:** ${role.name}\n**Role ID:** ${role.id}\n**Role Position:** ${role.position}\n**Hex code:** ${role.hexColor}\n**Created At:** <t:${~~(role.createdTimestamp / 1000)}:R>\n**Mentionability:** ${role.mentionable ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Separated:** ${role.hoist ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Integration:** ${role.managed ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n`,
					inline: false,
				},
				{
					name: '__Allowed Permissions__',
					value: `${finalperms}`,
					inline: false,
				},
				{
					name: `__Role Members [${role.members.size}]__`,
					value: `${role.members.map(e => `<@${e.id}>`).length > 15 ? 'Too many members in this role to show here' : `${role.members.map(e => `<@${e.id}>`).join(', ')}`}` || 'No members in this role.',
					inline: false,
				},
				],
				footer: {
					text: `Desired by ${ctx.interaction.user?.username}`,
					icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
				},
				color: 16705372,
				thumbnail: {
					url: role.iconURL(),
				},
			}],
		});
	},
});