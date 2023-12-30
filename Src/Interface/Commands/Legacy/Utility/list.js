const App = require('../../../../Structures/Core/App');
const Owners = require('../../../../Database/Schemas/owners');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');

module.exports = new App({
	name: 'list',
	description: 'List of everything you need',

	/**
	 * @param {Rolex} ctx
	 */
	run: async (ctx) => {
		await ctx.message.channel?.sendTyping();
		let fetched;

		const subCommand = ctx.message.content.split(' ').slice(1).shift();

		if (!subCommand) return ctx.message.reply({
			content: `${process.env.FAILURE_EMOJI} | Please provide a subcommand. Available subcommands: \`inrole\`, \`badges\`, \`roles\`, \`emojis\`, \`stickers\`, \`boosters\`, \`bots\`, \`mods\`, \`joinpos\`, \`bans\`, \`admins\`, \`noroles\`, \`muted\`.`,
		}).then(message => { setTimeout(() => { message.delete(); }, 15000); });

		let i0 = 0;
		let i1 = 10;
		let page = 1;
		let description, type, size, role, stickerimage;
		let emb = new EmbedBuilder();

		switch (subCommand.toLowerCase()) {
			case 'inrole':
				role = ctx.message.mentions.roles.first() || ctx.message.guild.roles.cache.get(ctx.message.content.split(' ').slice(2)[0]) || ctx.message.guild.roles.cache.find(r => r.name.toLowerCase() === ctx.message.content.split(' ').slice(2).join(' ').toLowerCase()) || ctx.message.guild.roles.cache.find(r => r.name.toLowerCase().includes(ctx.message.content.split(' ').slice(2).join(' ').toLowerCase()));

				if (!role) return ctx.message.reply({ content: `${process.env.FAILURE_EMOJI} | You must provide a valid role!` }).then(message => { setTimeout(() => { message.delete(); }, 15000); });

				fetched = await ctx.message.guild.members.fetch();

				if (role.members.size === 0) return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | No members in this roles.`,
				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });

				description = role.members.map((r) => r).map((r, i) => `\`[${i + 1}]\` | ${r.user?.globalName || r.user?.username} | [${r}]`);

				size = role.members.size;
				type = `users with ${role.name}`;
				break;
			case 'badges':
				fetched = await ctx.message.guild.members.fetch();

				const badgetext = [];
				fetched = await ctx.message.guild.members.fetch();
				if (fetched.filter(mem => mem.user?.flags?.toArray().includes('Staff')).size > 0) badgetext.push(`<:Discord_Staff:969270359704629418> | ${fetched.filter(mem => mem.user?.flags?.toArray().includes('Staff')).size}`);
				if (fetched.filter(mem => mem.user?.flags?.toArray().includes('CertifiedModerator')).size > 0) badgetext.push(`<:Certified_Moderator:1051010140423327754> | ${fetched.filter(mem => mem.user?.flags?.toArray().includes('CertifiedModerator')).size}`);
				if (fetched.filter(mem => mem.user?.flags?.toArray().includes('BugHunterLevel1')).size > 0) badgetext.push(`<:Bug_Hunter:969270237855899689> | ${fetched.filter(mem => mem.user?.flags?.toArray().includes('BugHunterLevel1') || mem.user?.flags?.toArray().includes('BugHunterLevel`')).size}`);
				if (fetched.filter(mem => mem.user?.flags?.toArray().includes('BugHunterLevel2')).size > 0) badgetext.push(`<:Bug_Hunter_Pro:969270310559965214> | ${fetched.filter(mem => mem.user?.flags?.toArray().includes('BugHunterLevel2') || mem.user?.flags?.toArray().includes('BugHunterLevel2')).size}`);
				if (fetched.filter(mem => mem.user?.flags?.toArray().includes('Partner')).size > 0) badgetext.push(`<:Discord_Partnered_Server_Owner:969270590110331010> | ${fetched.filter(mem => mem.user?.flags?.toArray().includes('Partner')).size}`);
				if (fetched.filter(mem => mem.user?.flags?.toArray().includes('VerifiedDeveloper')).size > 0) badgetext.push(`<:Early_Verified_Bot_Developer:968780598703439883> | ${fetched.filter(mem => mem.user?.flags?.toArray().includes('VerifiedDeveloper')).size}`);
				if (fetched.filter(mem => mem.user?.flags?.toArray().includes('ActiveDeveloper')).size > 0) badgetext.push(`<:Active_Developer:1044479260292808785> | ${fetched.filter(mem => mem.user?.flags?.toArray().includes('ActiveDeveloper')).size}`);
				if (fetched.filter(mem => mem.user?.flags?.toArray().includes('PremiumEarlySupporter')).size > 0) badgetext.push(`<:Early_Supporter:969268917660975144> | ${fetched.filter(mem => mem.user?.flags?.toArray().includes('PremiumEarlySupporter')).size}`);
				if (fetched.filter(mem => mem.user?.flags?.toArray().includes('Hypesquad')).size > 0) badgetext.push(`<:HypeSquad_Events:969270656791363607> | ${fetched.filter(mem => mem.user?.flags?.toArray().includes('Hypesquad')).size}`);
				if (fetched.filter(mem => mem.user?.flags?.toArray().includes('HypeSquadOnlineHouse1')).size > 0) badgetext.push(`<:HypeSquad_Bravery:969270529829765190> | ${fetched.filter(mem => mem.user?.flags?.toArray().includes('HypeSquadOnlineHouse1')).size}`);
				if (fetched.filter(mem => mem.user?.flags?.toArray().includes('HypeSquadOnlineHouse2')).size > 0) badgetext.push(`<:HypeSquad_Brilliance:969270477631651860> | ${fetched.filter(mem => mem.user?.flags?.toArray().includes('HypeSquadOnlineHouse2')).size}`);
				if (fetched.filter(mem => mem.user?.flags?.toArray().includes('HypeSquadOnlineHouse3')).size > 0) badgetext.push(`<:HypeSquad_Balance:969270420840787988> | ${fetched.filter(mem => mem.user?.flags?.toArray().includes('HypeSquadOnlineHouse3')).size}`);

				if (badgetext.length === 0) return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no users in this server with badges.`,
				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });

				description = badgetext.map((r) => `${r}`);

				size = badgetext.length;
				type = 'badges';
				break;
			case 'roles':
				const guildroles = ctx.message.guild.roles.cache.filter(e => e.id !== ctx.message.guild.roles.everyone?.id).sort((a, b) => b.position - a.position);
				if (guildroles.size === 0) return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no roles in this server.`,
				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });

				description = guildroles.map((r) => r).map((r, i) => `\`[${i + 1}]\` | ${r} \`[${r.id}]\` - ${r.members.size} members`);

				size = guildroles.size;
				type = 'roles';
				break;
			case 'emojis':
				const emojisinfo = ctx.message.guild.emojis.cache.filter(e => e);
				if (emojisinfo.size === 0) return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no emojis in this server.`,
				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });

				description = emojisinfo.map((r) => r).map((r, i) => `\`[${i + 1}]\` | ${r} | [${r.name}](${r.url})`);

				size = emojisinfo.size;
				type = 'emojis';
				break;
			case 'stickers':
				const stickersinfo = ctx.message.guild.stickers.cache.filter(e => e);
				if (stickersinfo.size === 0) return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no stickers in this server.`,
				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });

				description = stickersinfo.map((r) => r).map((r, i) => `\`[${i + 1}]\` | [${r.name}](${r.url}) | \`[${r.id}]\``);

				stickerimage = stickersinfo.map((r) => r).map((r) => r.url);

				size = stickersinfo.size;
				type = 'stickers';
				break;
			case 'boosters':
				const booster = ctx.message.guild.roles.premiumSubscriberRole;
				if (ctx.message.guild.roles.premiumSubscriberRole === null) return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | This server don't have any boosters!`,
				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });

				fetched = await ctx.message.guild.members.fetch();

				if (booster.members.size === 0) return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | This server don't have any boosters!`,
				});

				description = booster.members
					.map((r) => r)
					.map((r, i) => `\`[${i + 1}]\` | ${r.user?.globalName || r.user?.username} | [${r}] - <t:${~~(fetched.get(r.id).premiumSinceTimestamp / 1000)}:R>`);

				size = booster.members.size;
				type = 'boosters';
				break;
			case 'bots':
				fetched = await ctx.message.guild.members.fetch();
				const botsinfo = fetched.filter((bot) => bot.user?.bot);

				description = botsinfo.map((r) => r).map((r, i) => `\`[${i + 1}]\` | ${r.user?.globalName || r.user?.username} [${r}]`);

				size = botsinfo.size;
				type = 'bots';
				break;
			case 'mods':
				fetched = await ctx.message.guild.members.fetch();
				if (fetched.filter((mod) => mod.permissions.has('ManageGuild') && !mod.user?.bot && !mod.permissions.has('Administrator')).size === 0) return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no moderators in this server.`,
				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });

				const modsinfo = fetched.filter((mod) => mod.permissions.has('ManageGuild') && !mod.user?.bot && !mod.permissions.has('Administrator'));

				description = modsinfo.map((r) => r).map((r, i) => `\`[${i + 1}]\` | ${r.user?.globalName || r.user?.username} [${r}]`);

				size = modsinfo.size;
				type = 'mods';
				break;
			case 'joinpos':
				fetched = await ctx.message.guild.members.fetch();

				const joinposinfo = fetched.sort((a, b) => a.joinedAt - b.joinedAt);

				description = joinposinfo.map((r) => r).map((r, i) => `\`[${i + 1}]\` | ${r.user?.globalName || r.user?.username} [${r}] - [<t:${Math.floor(r.joinedAt / 1000)}:R>]`);

				size = joinposinfo.size;
				type = 'join position';
				break;
			case 'bans':
				const owner_data = await Owners.findOne({
					Guild: ctx.message.guild.id,
				});

				if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.BanMembers) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You do not have \`Ban Members\` permissions!`,
				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });

				if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | I do not have \`Ban Members\` permissions!`,
				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });

				const bansinfo = await ctx.message.guild.bans.fetch();

				if (bansinfo.size === 0) return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | There are no bans in this server!`,
				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });

				description = bansinfo.map((r) => r).map((r, i) => `\`[${i + 1}]\` | ${r.user?.globalName || r.user?.username} \`[${r.user?.id}]\``);

				size = bansinfo.size;
				type = 'banned members';
				break;
			case 'admins':
				fetched = await ctx.message.guild.members.fetch();

				const adminsinfo = fetched.filter((admin) => admin.permissions.has('Administrator') && !admin.user?.bot);

				description = adminsinfo.map((r) => r).map((r, i) => `\`[${i + 1}]\` | ${r.user?.globalName || r.user?.username} [${r}]`);

				size = adminsinfo.size;
				type = 'admins';
				break;
			case 'noroles':
				fetched = await ctx.message.guild.members.fetch();
				const norolesinfo = fetched.filter(m => m.roles.cache.size === 1);
				if (norolesinfo.size === 0) return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no users without roles in this server.`,
				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });

				description = norolesinfo.map((r) => r).map((r, i) => `\`[${i + 1}]\` | ${r.user?.globalName || r.user?.username} [${r}]`);

				size = norolesinfo.size;
				type = 'users without roles';
				break;
			case 'muted':
				fetched = await ctx.message.guild.members.fetch();
				const mutedinfo = fetched.filter((muted) => muted.isCommunicationDisabled());

				if (mutedinfo.size === 0) return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no one muted in your server.`,
				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });

				description = mutedinfo.map((r) => r).map((r, i) => `\`[${i + 1}]\` | ${r.user?.globalName || r.user?.username} [${r}] - [<t:${Math.floor(r.communicationDisabledUntil / 1000)}:R>]`);

				size = mutedinfo.size;
				type = 'muted users';
				break;
			default:
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | Invalid subcommand! Available options: \`inrole\`, \`badges\`, \`roles\`, \`emojis\`, \`stickers\`, \`boosters\`, \`bots\`, \`mods\`, \`joinpos\`, \`bans\`, \`admins\`, \`noroles\`, \`muted\``,
				}).then(message => { setTimeout(() => { message.delete(); }, 15000); });
		}

		if (subCommand.toLowerCase() === 'stickers') i1 = 1;
		if (subCommand.toLowerCase() === 'badges') i1 = size;

		const incre_decre = i1 - i0;

		emb
			.setColor(16705372)
			.setTitle(`List of ${type} in ${ctx.message.guild.name} - ${size}`)
			.setFooter({
				text: `Desired by ${ctx.message.author?.username} | Page ${page}/${Math.ceil(size / incre_decre)}`,
				iconURL: ctx.message.author?.displayAvatarURL({ size: 2048 }),
			})
			.setDescription(description.slice(i0, i1).join('\n'))

		if (subCommand.toLowerCase() === 'stickers')
			emb.setImage(stickerimage.slice(i0, i1).join('\n'));
		else if (subCommand.toLowerCase() === 'inrole')
			emb.setThumbnail(role.iconURL());

		if ((size <= 10) || (subCommand.toLowerCase() === 'badges')) {
			return ctx.message.reply({
				embeds: [emb],
			});
		}

		const start = generateCustomID();

		const prev = generateCustomID();

		const stop = generateCustomID();

		const next = generateCustomID();

		const end = generateCustomID();

		const msg = await ctx.message.reply({
			embeds: [emb],
			components: [{
				type: 1,
				components: [
					{
						type: 2,
						emoji: {
							name: 'previous',
							id: '996000399943274506',
						},
						style: 2,
						custom_id: start,
						disabled: true,
					},
					{
						type: 2,
						emoji: {
							name: 'arrow_backward',
							id: '996005616147513406',
						},
						style: 2,
						disabled: true,
						custom_id: prev,
					},
					{
						type: 2,
						emoji: {
							name: 'stop',
							id: '996000402338226196',
						},
						style: 2,
						disabled: false,
						custom_id: stop,
					},
					{
						type: 2,
						emoji: {
							name: 'arrow_forward',
							id: '996005619767181323',
						},
						style: 2,
						disabled: false,
						custom_id: next,
					},
					{
						type: 2,
						emoji: {
							name: 'next',
							id: '996000397196005386',
						},
						style: 2,
						custom_id: end,
						disabled: false,
					},
				],
			}],
		});

		const collector = msg.createMessageComponentCollector({
			componentType: 2,
			time: 120000,
		});

		collector.on('collect', async (i) => {
			if (i.user.id !== ctx.message.author.id) return i.reply({ content: `${process.env.FAILURE_EMOJI} |  | You can't control this pagination!`, ephemeral: true });

			await i.deferUpdate();

			if (i.customId === start) {
				i0 = 0;
				i1 = incre_decre;
				page = 1;
			}

			if (i.customId === prev) {
				i0 = i0 - incre_decre;
				i1 = i1 - incre_decre;
				page = page - 1;
			}

			if (i.customId === stop) return collector.stop();

			if (i.customId === next) {
				i0 = i0 + incre_decre;
				i1 = i1 + incre_decre;
				page = page + 1;
			}

			if (i.customId === end) {
				i0 = size - (size % incre_decre);
				i1 = size;
				page = Math.ceil(size / incre_decre);
			}

			emb
				.setColor(16705372)
				.setTitle(`List of ${type} in ${ctx.message.guild.name} - ${size}`)
				.setFooter({
					text: `Desired by ${ctx.message.author?.username} | Page ${page}/${Math.ceil(size / incre_decre)}`,
					iconURL: ctx.message.author?.displayAvatarURL({ size: 2048 }),
				})
				.setDescription(description.slice(i0, i1).join('\n'));

			if (subCommand.toLowerCase() === 'stickers')
				emb.setImage(stickerimage.slice(i0, i1).join('\n'));
			else if (subCommand.toLowerCase() === 'inrole')
				emb.setThumbnail(role.iconURL());

			await msg.edit({
				embeds: [emb],
				components: [{
					type: 1,
					components: msg.components[0].components.map((components, index) => {
						if (page === 1) {
							components.data.disabled = (index === 0 || index === 1)
						} else if (page === Math.ceil(size / incre_decre)) {
							components.data.disabled = (index === 3 || index === 4)
						} else {
							components.data.disabled = false;
						}
						return components.data;
					}),
				}],
			});
			collector.resetTimer();
		});

		collector.on('end', async () => {
			await msg.edit({
				components: [{
					type: 1,
					components: msg.components[0].components.map((components) => {
						components.data.disabled = true;
						return components.data;
					}),
				}],
			});
		});
	},
});