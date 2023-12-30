const App = require('../../../../Structures/Core/App');
const { separateWords } = require('../../../../Structures/Utils/Functions/separateWords');

module.exports = new App({
	name: 'roleinfo',
	description: 'Shows roleinfo for the mentioned role',
	aliases: ['ri'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const role = ctx.message.mentions.roles.first() || ctx.message.guild.roles.cache.get(ctx.message.content.split(' ').slice(1)[0]) || ctx.message.guild.roles.cache.find(r => r.name.toLowerCase() === ctx.message.content.split(' ').slice(1).join(' ').toLowerCase()) || ctx.message.guild.roles.cache.find(r => r.name.toLowerCase().includes(ctx.message.content.split(' ').slice(1).join(' ').toLowerCase()));

		if (!role) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must provide a valid role!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

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

		await ctx.message.reply({
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
					value: `${role.members.size > 15 ? 'Too many members in this role to show here' : `${role.members.map(e => `<@${e.id}>`).join(', ')}`}` || 'No members in this role.',
					inline: false,
				},
				],
				footer: {
					text: `Desired by ${ctx.message.author?.username}`,
					icon_url: ctx.message.author?.displayAvatarURL({ size: 2048 }),
				},
				color: 16705372,
				thumbnail: {
					url: role.iconURL(),
				},
			}],
		});
	},
});