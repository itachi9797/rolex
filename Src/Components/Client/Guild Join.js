const Component = require('../../Structures/Core/Component');

module.exports = new Component({
	name: 'guildCreate',
	/**
     * @param {Rolex} client
     */
	run: async (client, guild) => {
		if (client.channels.cache.get(process.env.GUILD_LOG) === undefined) return;
		const obj = {
			PremiumEarlySupporter: '<:Early_Supporter:969268917660975144> • Early Supporter',
			CertifiedModerator: '<:Certified_Moderator:1051010140423327754> • Moderator Programs Alumni',
			BugHunterLevel1: '<:Bug_Hunter:969270237855899689> • Bug Hunter',
			BugHunterLevel2: '<:Bug_Hunter_Pro:969270310559965214> • Bug Hunter',
			Staff: '<:Discord_Staff:969270359704629418> • Discord Staff',
			VerifiedDeveloper: '<:Early_Verified_Bot_Developer:968780598703439883> • Early Verified Bot Developer',
			ActiveDeveloper: '<:Active_Developer:1044479260292808785> • Active Developer',
			HypeSquadOnlineHouse3: '<:HypeSquad_Balance:969270420840787988> • HypeSquad Balance',
			HypeSquadOnlineHouse2: '<:HypeSquad_Brilliance:969270477631651860> • HypeSquad Brilliance',
			HypeSquadOnlineHouse1: '<:HypeSquad_Bravery:969270529829765190> • HypeSquad Bravery',
			Partner: '<:Discord_Partnered_Server_Owner:969270590110331010> • Discord Partnered Server Owner',
			Hypesquad: '<:HypeSquad_Events:969270656791363607> • HypeSquad Events',
		};
		client.channels.cache.get(process.env.GUILD_LOG).send({
			embeds: [{
				title: 'Added To Guild',
				fields: [{
					name: '__Guild Info__',
					value: `>>> **Name:** ${guild.name}\n**ID:** ${guild.id}\n**Guild MemberCount:** ${guild.memberCount}\n**Vanity Code:** ${guild.vanityURLCode === null ? 'None' : `${guild.vanityURLCode}`}`,
					inline: false,
				},
				{
					name: '__Owner Info__',
					value: `>>> **Username:** ${(await client.users.fetch(guild.ownerId)).username}\n**ID:** ${guild.ownerId}\n**Created At:** <t:${Math.floor((await client.users.fetch(guild.ownerId)).createdTimestamp / 1000)}:R>\n**Badges:** ${(await client.users.fetch(guild.ownerId)).flags.toArray().length !== 0 ? (await client.users.fetch(guild.ownerId)).flags.toArray().map(badge => `${obj[badge]}`).join('\n') : 'No badge!'}`,
					inline: false,
				},
				{
					name: '__Joined At__',
					value: `>>> **Time:** <t:${Math.floor(Date.now() / 1000)}:R>\n**Date:** ${Date()}`,
					inline: false,
				},
				],
				footer: {
					text: `Currently on ${client.guilds.cache.size} servers!`,
					icon_url: client.user?.displayAvatarURL({ size: 2048 }),
				},
				color: 16705372,
				thumbnail: {
					url: guild.icon === null ? null : guild.iconURL(),
				},
			}],
		});
	},
});