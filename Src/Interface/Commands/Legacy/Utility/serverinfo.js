const App = require('../../../../Structures/Core/App');
const { ChannelType } = require('discord.js');
const { tickCheck } = require('../../../../Structures/Utils/Functions/tickCheck');

module.exports = new App({
	name: 'serverinfo',
	description: 'Get information about the server',
	aliases: ['si'],
	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {
		const verificationLevels = [
			'None (Unrestricted)',
			'Low',
			'Medium',
			'High',
			'Highest'
		];

		const uploadLimits = [
			'8.00MB',
			'8.00MB',
			'50.00MB',
			'100.00MB',
		];

		const premiumTiers = [
			'No level',
			'Level 1',
			'Level 2',
			'Level 3'
		];

		const emojiCount = [
			'50',
			'100',
			'150',
			'250'
		]

		ctx.message.reply({
			embeds: [{
				title: ctx.message.guild.name,
				thumbnail: {
					url: ctx.message.guild.iconURL(),
				},
				fields: [{
					name: '__Server Information__',
					value: `**ID:** ${ctx.message.guild.id}\n**Owner <:owner:993945290337964153> :** <@${ctx.message.guild.ownerId}>\n**Created At:** <t:${~~(ctx.message.guild.createdTimestamp / 1000)}:R>\n**Members:** ${ctx.message.guild.memberCount} (${ctx.message.guild.members.cache.filter(m => m.user?.bot).size} bots)`,
					inline: false,
				},
				{
					name: '__Server Description__',
					value: ctx.message.guild.description === null ? 'This server doesn\'t have a description!' : ctx.message.guild.description,
					inline: false,
				},
				{
					name: '__Extras__',
					value: `**Verification Level:** ${verificationLevels[ctx.message.guild.verificationLevel]}\n**Upload Limit:** ${uploadLimits[ctx.message.guild.premiumTier]}\n**Inactive Channel:** ${ctx.message.guild.afkChannel === null ? 'This server doesn\'t have an AFK channel!' : `<#${ctx.message.guild.afkchannel?.id}>`}\n**Inactive Timeout:** ${ctx.message.guild.afkTimeout / 60} minutes\n**System Channel Id:** ${ctx.message.guild.systemChannelId === null ? 'This server doesn\'t have a system channel!' : `<#${ctx.message.guild.systemChannelId}>`}\n**Preferred Locale:** ${ctx.message.guild.preferredLocale}\n**2FA Requirement:** ${ctx.message.guild.mfaLevel === 1 ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Boost Bar Enabled:** ${ctx.message.guild.premiumProgressBarEnabled === true ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Vanity URL:** ${ctx.message.guild.vanityURLCode ? `${ctx.message.guild.vanityURLCode}` : 'This server doesn\'t have a vanity URL!'}`,
					inline: false,
				},
				{
					name: '__Server Features__',
					value: ctx.message.guild.features.length === 0 ? 'This server doesn\'t have any features!' : tickCheck(ctx.message.guild.features, 1000),
					inline: false,
				},
				{
					name: '__Channels__',
					value: `Total: ${ctx.message.guild.channels.cache.size}\nChannels: <:text:968785487764545587> ${ctx.message.guild.channels.cache.filter(e => e.type === ChannelType.GuildText).size} | <:voice:968786121578393630> ${ctx.message.guild.channels.cache.filter(e => e.type === ChannelType.GuildVoice).size} | <:stage:968786792910319626> ${ctx.message.guild.channels.cache.filter(e => e.type === ChannelType.GuildStageVoice).size}${ctx.message.guild.rulesChannel ? `\nRules channel: <#${ctx.message.guild.rulesChannelId}>` : ''}`,
					inline: false,
				},
				{
					name: '__Emoji Info__',
					value: `Regular: ${ctx.message.guild.emojis.cache.filter(e => !e.animated).size}/${emojiCount[ctx.message.guild.premiumTier]}\nAnimated: ${ctx.message.guild.emojis.cache.filter(e => e.animated).size}/${emojiCount[ctx.message.guild.premiumTier]}\nTotal Emoji: ${ctx.message.guild.emojis.cache.size}/${(emojiCount[ctx.message.guild.premiumTier] * 2)}`,
					inline: false,
				},
				{
					name: '__Boost Status__',
					value: `${premiumTiers[ctx.message.guild.premiumTier]} [<:boost:993945287502614538> ${ctx.message.guild.premiumSubscriptionCount} boosts]${ctx.message.guild.roles.premiumSubscriberRole ? `\nBooster Role: <@&${ctx.message.guild.roles.premiumSubscriberRole.id}>` : ''}`,
					inline: false,
				},
				{
					name: '__Server Roles__',
					value: ctx.message.guild.roles.cache.filter(e => !e.managed && e.id !== ctx.message.guild.roles.everyone.id).size == 0 ? 'The server don\'t have any roles.' : ctx.message.guild.roles.cache.filter(e => !e.managed && e.id !== ctx.message.guild.roles.everyone.id).size < 15 ? ctx.message.guild.roles.cache.filter(e => e.managed === false && e.id !== ctx.message.guild.roles.everyone?.id).sort((a, b) => b.position - a.position).map(c => `<@&${c.id}>`).join(', ') : 'Too many roles to show here',
					inline: false,
				},
				],
				color: 16705372,
				image: {
					url: ctx.message.guild.bannerURL({ size: 2048 }),
				},
			}],
		});
	},
});