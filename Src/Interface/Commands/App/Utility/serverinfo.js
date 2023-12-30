const App = require('../../../../Structures/Core/App');
const { ChannelType, GuildPremiumTier } = require('discord.js');
const { tickCheck } = require('../../../../Structures/Utils/Functions/tickCheck');

module.exports = new App({
	name: 'serverinfo',
	description: 'Get information about the server',
	usage: 'serverinfo',
	aliases: ['si'],

	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {
		ctx.interaction.reply({
			embeds: [{
				title: ctx.interaction.guild.name,
				thumbnail: {
					url: ctx.interaction.guild.iconURL(),
				},
				fields: [{
					name: '__Server Information__',
					value: `**ID:** ${ctx.interaction.guild.id}\n**Owner <:owner:993945290337964153> :** <@${ctx.interaction.guild.ownerId}>\n**Created At:** <t:${~~(ctx.interaction.guild.createdTimestamp / 1000)}:R>\n**Members:** ${ctx.interaction.guild.memberCount} (${ctx.interaction.guild.members.cache.filter(m => m.user?.bot).size} bots)`,
					inline: false,
				},
				{
					name: '__Server Description__',
					value: ctx.interaction.guild.description === null ? 'This server doesn\'t have a description!' : ctx.interaction.guild.description,
					inline: false,
				},
				{
					name: '__Extras__',
					value: `**Verification Level:** ${ctx.interaction.guild.verificationLevel === 0 ? 'None (Unrestricted)' : `${ctx.interaction.guild.verificationLevel === 1 ? 'Low' : `${ctx.interaction.guild.verificationLevel === 2 ? 'Medium' : `${ctx.interaction.guild.verificationLevel === 3 ? 'High' : `${ctx.interaction.guild.verificationLevel === 4 ? 'Highest' : 'Highest'}`}`}`}`}\n**Upload Limit:** ${ctx.interaction.guild.premiumTier === GuildPremiumTier.None ? '8.00MB' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier1 ? '8.00MB' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier2 ? '50.00MB' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier3 ? ' 100.00MB' : '100.00MB'}`}`}`}\n**Inactive Channel:** ${ctx.interaction.guild.afkChannel === null ? 'This server doesn\'t have an afk channel!' : `<#${ctx.interaction.guild.afkchannel?.id}>`}\n**Inactive Timeout:** ${ctx.interaction.guild.afkTimeout / 60} minutes\n**System Channel Id:** ${ctx.interaction.guild.systemChannelId === null ? 'This server doesn\'t have a system channel!' : `<#${ctx.interaction.guild.systemChannelId}>`}\n**Preferred Locale:** ${ctx.interaction.guild.preferredLocale}\n**2FA Requirement:** ${ctx.interaction.guild.mfaLevel === 1 ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Boost Bar Enabled:** ${ctx.interaction.guild.premiumProgressBarEnabled === true ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Vanity URL:** ${ctx.interaction.guild.vanityURLCode ? `${ctx.interaction.guild.vanityURLCode}` : 'This server doesn\'t have a vanity url!'}`,
					inline: false,
				},
				{
					name: '__Server Features__',
				    value: ctx.interaction.guild.features.length === 0 ? 'This server doesn\'t have any features!' : tickCheck(ctx.interaction.guild.features, 1000),
					inline: false,
				},
				{
					name: '__Channels__',
					value: `Total: ${ctx.interaction.guild.channels.cache.size}\nChannels: <:text:968785487764545587> ${ctx.interaction.guild.channels.cache.filter(e => e.type === ChannelType.GuildText).size} | <:voice:968786121578393630> ${ctx.interaction.guild.channels.cache.filter(e => e.type === ChannelType.GuildVoice).size} | <:stage:968786792910319626> ${ctx.interaction.guild.channels.cache.filter(e => e.type === ChannelType.GuildStageVoice).size}${ctx.interaction.guild.rulesChannel ? `\nRules channel: <#${ctx.interaction.guild.rulesChannelId}>` : ''}`,
					inline: false,
				},
				{
					name: '__Emoji Info__',
					value: `Regular: ${ctx.interaction.guild.emojis.cache.filter(e => !e.animated).size}/${ctx.interaction.guild.premiumTier === GuildPremiumTier.None ? '50' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier1 ? '100' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier2 ? '150' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier3 ? '250' : '250'}`}`}`}\nAnimated: ${ctx.interaction.guild.emojis.cache.filter(e => e.animated).size}/${ctx.interaction.guild.premiumTier === GuildPremiumTier.None ? '50' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier1 ? '100' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier2 ? '150' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier3 ? '250' : '250'}`}`}`}\nTotal Emoji: ${ctx.interaction.guild.emojis.cache.size}/${ctx.interaction.guild.premiumTier === GuildPremiumTier.None ? '100' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier1 ? '200' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier2 ? '300' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier3 ? '600' : '600'}`}`}`}`,
					inline: false,
				},
				{
					name: '__Boost Status__',
					value: `${ctx.interaction.guild.premiumTier === GuildPremiumTier.None ? 'No level' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier1 ? 'Level 1' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier2 ? 'Level 2' : `${ctx.interaction.guild.premiumTier === GuildPremiumTier.Tier3 ? 'Level 3' : 'Level 3'}`}`}`} [<:boost:993945287502614538> ${ctx.interaction.guild.premiumSubscriptionCount} boosts]\nBooster Role: ${ctx.interaction.guild.roles.premiumSubscriberRole ? `<@&${ctx.interaction.guild.roles.premiumSubscriberRole.id}>` : 'No Booster Role'}`,
					inline: false,
				},
				{
					name: '__Server Roles__',
					value: ctx.interaction.guild.roles.cache.filter(e => !e.managed && e.id !== ctx.interaction.guild.roles.everyone.id).size == 0 ? 'The server dpn\'t have any roles.' : ctx.interaction.guild.roles.cache.filter(e => !e.managed && e.id !== ctx.interaction.guild.roles.everyone.id).size < 15 ? ctx.interaction.guild.roles.cache.filter(e => e.managed === false && e.id !== ctx.interaction.guild.roles.everyone?.id).sort((a, b) => b.position - a.position).map(c => `<@&${c.id}>`).join(', ') : 'Too many roles to show here',
					inline: false,
				},
				],
				color: 16705372,
				image: {
					url: ctx.interaction.guild.bannerURL({
						size: 2048,
					}),
				},
			}],
		});
	},
});