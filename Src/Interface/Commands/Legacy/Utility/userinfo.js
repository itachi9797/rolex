const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Schema = require('../../../../Database/Schemas/badge');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');
const { separateWords } = require('../../../../Structures/Utils/Functions/separateWords');

module.exports = new App({
	name: 'userinfo',
	description: 'Shows userinfo for the mentioned user',
	aliases: ['ui', 'whois'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const badges = {
			Staff: '<:Discord_Staff:969270359704629418>',
			CertifiedModerator: '<:Certified_Moderator:1051010140423327754>',
			BugHunterLevel1: '<:Bug_Hunter:969270237855899689>',
			BugHunterLevel2: '<:Bug_Hunter_Pro:969270310559965214>',
			Partner: '<:Discord_Partnered_Server_Owner:969270590110331010>',
			VerifiedDeveloper: '<:Early_Verified_Bot_Developer:968780598703439883>',
			VerifiedBot: '<:Verified_Bot:1106114477004435486>',
			ActiveDeveloper: '<:Active_Developer:1044479260292808785>',
			Hypesquad: '<:HypeSquad_Events:969270656791363607>',
			PremiumEarlySupporter: '<:Early_Supporter:969268917660975144>',
			HypeSquadOnlineHouse1: '<:HypeSquad_Bravery:969270529829765190>',
			HypeSquadOnlineHouse2: '<:HypeSquad_Brilliance:969270477631651860>',
			HypeSquadOnlineHouse3: '<:HypeSquad_Balance:969270420840787988>',
		};

		const args = ctx.message.content.split(' ').slice(1);

		let user;

		if (ctx.message.content.match(/<@(\d+)>/) !== null && args[0] === ctx.message.content.match(/<@(\d+)>/)[0]) {
			try {
				user = await ctx.client.users.fetch(ctx.message.content.match(/<@(\d+)>/)[1]);
			}
			catch (e) {
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		}
		else if (ctx.message.mentions.members.first() && ctx.message.mentions.members.first() === args[0]) {
			try {
				user = await ctx.client.users.fetch(ctx.message.mentions.members.first().id);
			}
			catch (e) {
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		}
		else if (ctx.message.mentions.repliedUser !== null && !args[0]) {
			try {
				user = await ctx.client.users.fetch(ctx.message.mentions.replieduser?.id);
			}
			catch (e) {
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		}
		else if (args[0]) {
			try {
				user = await ctx.client.users.fetch(args[0]);
			}
			catch (e) {
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		}
		else {
			user = ctx.message.author;
		}

		const banner = (await ctx.client.users.fetch(user?.id, { force: true })).bannerURL({ size: 2048 });

		const check = user?.flags?.toArray();

		const badge = check?.map(flag => badges[flag]).join(' ');

		const one = generateCustomID();

		const two = generateCustomID();

		const three = generateCustomID();

		const four = generateCustomID();

		const data = await Schema.findOne({ User: user?.id });

		if (data && ctx.message.guild.members.cache.get(user?.id) === undefined) {
			await ctx.message.reply({
				embeds: [{
					author: {
						name: user?.globalName || user?.username,
						icon_url: user?.displayAvatarURL({ size: 2048 }),
					},
					thumbnail: {
						url: user?.displayAvatarURL({ size: 2048 }),
					},
					image: {
						url: banner,
					},
					footer: {
						text: `${user?.globalName || user?.username} is not in this server.`,
						icon_url: user?.displayAvatarURL({ size: 2048 }),
					},
					fields: [{
						name: '__General Information__',
						value: `**Username:** ${user?.username}${user?.discriminator !== '0' ? `#${user?.discriminator}` : ''}\n${user?.globalName !== null ? `**Display Name:** ${user?.globalName}\n` : ''}**ID:** ${user?.id}\n**Registered:** <t:${Math.floor(user?.createdTimestamp / 1000)}:F> [<t:${Math.floor(user?.createdTimestamp / 1000)}:R>]\n**Is Bot?:** ${user?.bot ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}${badge ? `\n**Badges:** ${badge}` : ''}`,
						inline: false,
					},
					{
						name: '__Profile Picture__',
						value: `**Animated:** ${user?.avatar ? user?.avatar.startsWith('a_') ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Download:** ${user?.avatar ? user?.avatar.startsWith('a_') ? `[Click Me](https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.gif)` : `[Click Me](https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png)` : `[Click Me](${user?.displayAvatarURL({ size: 2048 })})`}`,
						inline: false,
					},
					{
						name: `__${ctx.client.user?.globalName || ctx.client.user?.username} Badges__`,
						value: `${data.Badges.map((b) => `${b.name}`).join('\n')}`,
						inline: false,
					},

					],
					color: 16705372,
				}],
			});

		}
		else if (!data && ctx.message.guild.members.cache.get(user?.id) === undefined) {
			await ctx.message.reply({
				embeds: [{
					author: {
						name: user?.globalName || user?.username,
						icon_url: user?.displayAvatarURL({ size: 2048 }),
					},
					thumbnail: {
						url: user?.displayAvatarURL({ size: 2048 }),
					},
					image: {
						url: banner,
					},
					footer: {
						text: `${user?.globalName || user?.username} is not in this server.`,
						icon_url: user?.displayAvatarURL({ size: 2048 }),
					},
					fields: [{
						name: '__General Information__',
						value: `**Username:** ${user?.username}${user?.discriminator !== '0' ? `#${user?.discriminator}` : ''}\n${user?.globalName !== null ? `**Display Name:** ${user?.globalName}\n` : ''}**ID:** ${user?.id}\n**Registered:** <t:${Math.floor(user?.createdTimestamp / 1000)}:F> [<t:${Math.floor(user?.createdTimestamp / 1000)}:R>]\n**Is Bot?:** ${user?.bot ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}${badge ? `\n**Badges:** ${badge}` : ''}`,
						inline: false,
					},
					{
						name: '__Profile Picture__',
						value: `**Animated:** ${user?.avatar ? user?.avatar.startsWith('a_') ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Download:** ${user?.avatar ? user?.avatar.startsWith('a_') ? `[Click Me](https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.gif)` : `[Click Me](https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png)` : `[Click Me](${user?.displayAvatarURL({ size: 2048 })})`}`,
						inline: false,
					},
					],
					color: 16705372,
				}],
			});
		}
		else if (data && ctx.message.guild.members.cache.get(user?.id) !== undefined) {

			let page = 1;

			let userStatus = 'No Activities Available';

			if (ctx.message.guild.members.cache.get(user?.id).presence?.activities?.length === undefined) {
				userStatus = 'No Activities Available';
			}
			else if (ctx.message.guild.members.cache.get(user?.id).presence?.activities?.length === 0) {
				userStatus = 'No Activities Available';
			}
			else if (ctx.message.guild.members.cache.get(user?.id).presence?.activities?.length > 3) {
				userStatus = 'The user has more than 3 activities.';
			}
			else {
				const array = [];
				const activities = ctx.message.guild.members.cache.get(user?.id).presence?.activities;
				for (let i = 0; i < activities?.length; i++) {
					const name = activities[i].name || 'No Name';
					const details = activities[i].details || 'No Details';
					const state = activities[i].state || 'No State';

					array.push(`**Name:** ${name}\n**State:** ${state}\n**Details:** ${details}`);
				}

				userStatus = array.join('\n\n');
			}


			const msg = await ctx.message.reply({
				embeds: [{
					author: {
						name: user?.globalName || user?.username,
						icon_url: user?.displayAvatarURL({ size: 2048 }),
					},
					fields: [{
						name: '__General Information__',
						value: `**Username:** ${user?.username}${user?.discriminator !== '0' ? `#${user?.discriminator}` : ''}\n${user?.globalName !== null ? `**Display Name:** ${user?.globalName}\n` : ''}**ID:** ${user?.id}\n**Registered:** <t:${Math.floor(user?.createdTimestamp / 1000)}:F> [<t:${Math.floor(user?.createdTimestamp / 1000)}:R>]\n**Is Bot?:** ${user?.bot ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}${badge ? `\n**Badges:** ${badge}` : ''}`,
						inline: false,
					},
					{
						name: '__Profile Picture__',
						value: `**Animated:** ${user?.avatar ? user?.avatar.startsWith('a_') ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Download:** ${user?.avatar ? user?.avatar.startsWith('a_') ? `[Click Me](https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.gif)` : `[Click Me](https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png)` : `[Click Me](${user?.displayAvatarURL({ size: 2048 })})`}`,
						inline: false,
					},
					{
						name: `__${ctx.client.user?.globalName || ctx.client.user?.username} Badges__`,
						value: `${data.Badges.map((b) => `${b.name}`).join('\n')}`,
						inline: false,
					},
					{
						name: '__Activities__',
						value: userStatus,
						inline: true,
					},
					],
					color: 16705372,
					thumbnail: {
						url: user?.displayAvatarURL({ size: 2048 }),
					},
					image: {
						url: banner,
					},
				}],
				components: [{
					type: 1,
					components: [{
						type: 2,
						label: 'Account',
						custom_id: one,
						disabled: true,
						style: 3,
					},
					{
						type: 2,
						label: 'Guild',
						custom_id: two,
						style: 2,
					},
					{
						type: 2,
						label: 'Roles',
						custom_id: three,
						style: 2,
					},
					{
						type: 2,
						label: 'Permissions',
						custom_id: four,
						style: 2,
					},
					],
				}],
			});

			const collector = msg.createMessageComponentCollector({
				time: 60000,
			});

			collector.on('collect', async (i) => {
				if (i.isButton()) {
					switch (i.customId) {
						case one:

							page = 1;

							userStatus = 'No Activities Available';

							if (ctx.message.guild.members.cache.get(user?.id).presence?.activities?.length === undefined) {
								userStatus = 'No Activities Available';
							}
							else if (ctx.message.guild.members.cache.get(user?.id).presence?.activities?.length === 0) {
								userStatus = 'No Activities Available';
							}
							else if (ctx.message.guild.members.cache.get(user?.id).presence?.activities?.length > 3) {
								userStatus = 'The user has more than 3 activities.';
							}
							else {
								const array = [];
								const activities = ctx.message.guild.members.cache.get(user?.id).presence?.activities;
								for (let i = 0; i < activities?.length; i++) {
									const name = activities[i].name || 'No Name';
									const details = activities[i].details || 'No Details';
									const state = activities[i].state || 'No State';

									array.push(`**Name:** ${name}\n**State:** ${state}\n**Details:** ${details}`);
								}

								userStatus = array.join('\n\n');
							}

							if (i.user?.id !== ctx.message.author?.id) {
								return i.reply({
									content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
									ephemeral: true,
								});
							}

							await i.deferUpdate();
							i.editReply({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									fields: [{
										name: '__General Information__',
										value: `**Username:** ${user?.username}${user?.discriminator !== '0' ? `#${user?.discriminator}` : ''}\n${user?.globalName !== null ? `**Display Name:** ${user?.globalName}\n` : ''}**ID:** ${user?.id}\n**Registered:** <t:${Math.floor(user?.createdTimestamp / 1000)}:F> [<t:${Math.floor(user?.createdTimestamp / 1000)}:R>]\n**Is Bot?:** ${user?.bot ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}${badge ? `\n**Badges:** ${badge}` : ''}`,
										inline: false,
									},
									{
										name: '__Profile Picture__',
										value: `**Animated:** ${user?.avatar ? user?.avatar.startsWith('a_') ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Download:** ${user?.avatar ? user?.avatar.startsWith('a_') ? `[Click Me](https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.gif)` : `[Click Me](https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png)` : `[Click Me](${user?.displayAvatarURL({ size: 2048 })})`}`,
										inline: false,
									},
									{
										name: `__${ctx.client.user?.globalName || ctx.client.user?.username} Badges__`,
										value: `${data.Badges.map((b) => `${b.name}`).join('\n')}`,
										inline: false,
									},
									{
										name: '__Activities__',
										value: userStatus,
										inline: true,
									},
									],
									color: 16705372,
									thumbnail: {
										url: user?.displayAvatarURL({ size: 2048 }),
									},
									image: {
										url: banner,
									},
								}],
								components: [{
									type: 1,
									components: [{
										type: 2,
										label: 'Account',
										custom_id: one,
										disabled: true,
										style: 3,
									},
									{
										type: 2,
										label: 'Guild',
										custom_id: two,
										style: 2,
									},
									{
										type: 2,
										label: 'Roles',
										custom_id: three,
										style: 2,
									},
									{
										type: 2,
										label: 'Permissions',
										custom_id: four,
										style: 2,
									},
									],
								}],
							});

							collector.resetTimer();
							break;
						case two:
							if (i.user?.id !== ctx.message.author?.id) {
								return i.reply({
									content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
									ephemeral: true,
								});
							}

							await i.deferUpdate();
							let acc = 'No Acknowledgements';

							if (
								ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.BanMembers) ||
                                ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.ManageMessages) ||
                                ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.KickMembers) ||
                                ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.ManageRoles) ||
                                ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.ModerateMembers)
							) {
								acc = 'Server Moderator';
							}
							if (ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.ManageEvents)) {
								acc = 'Event Manager';
							}
							if (ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.ManageGuild)) {
								acc = 'Server Manager';
							}
							if (ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.Administrator)) {
								acc = 'Administrator';
							}
							if (user?.id === ctx.message.guild.ownerId) {
								acc = 'Server Owner';
							}
							i.editReply({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									fields: [{
										name: `__Information in ${ctx.message.guild.name}__`,
										value: `**Joined:** <t:${Math.floor(ctx.message.guild.members.cache.get(user?.id).joinedAt / 1000)}:F> [<t:${Math.floor(ctx.message.guild.members.cache.get(user?.id).joinedAt / 1000)}:R>]\n**Nickname:** ${ctx.message.guild.members.cache.get(user?.id).nickname || 'No Nickname'}\n**Booster:** ${ctx.message.guild.members.cache.get(user?.id).premiumSince ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Boosting Since:** ${ctx.message.guild.members.cache.get(user?.id).premiumSinceTimestamp === null ? 'Not Boosting' : `<t:${~~(ctx.message.guild.members.cache.get(user?.id).premiumSinceTimestamp / 1000)}:R>`}\n**Acknowledgements:** ${acc}`,
										inline: false,
									}],
									color: 16705372,
									thumbnail: {
										url: ctx.message.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 }) || user?.displayAvatarURL({ size: 2048 }),
									},
								}],
								components: [{
									type: 1,
									components: [{
										type: 2,
										label: 'Account',
										custom_id: one,
										style: 2,
									},
									{
										type: 2,
										label: 'Guild',
										custom_id: two,
										disabled: true,
										style: 3,
									},
									{
										type: 2,
										label: 'Roles',
										custom_id: three,
										style: 2,
									},
									{
										type: 2,
										label: 'Permissions',
										custom_id: four,
										style: 2,
									},
									],
								}],
							});

							page = 2;

							collector.resetTimer();
							break;
						case three:

							let iconURL = null;

							if (ctx.message.guild.members.cache.get(user?.id).roles.icon) {
								iconURL = ctx.message.guild.members.cache.get(user?.id).roles.icon.iconURL();
							}

							let color = 'No Color';

							if (ctx.message.guild.members.cache.get(user?.id).roles.color) {
								color = `${ctx.message.guild.members.cache.get(user?.id).roles.color.hexColor} (${ctx.message.guild.members.cache.get(user?.id).roles.color.color})`;
							}


							if (i.user?.id !== ctx.message.author?.id) {
								return i.reply({
									content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
									ephemeral: true,
								});
							}

							await i.deferUpdate();
							i.editReply({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									fields: [{
										name: '__Role info__',
										value: `\n**Highest Role:** <@&${ctx.message.guild.members.cache.get(user?.id).roles.highest.id}>\n**Roles:** ${ctx.message.guild.members.cache.get(user?.id).roles.cache.sort((a, b) => b.position - a.position).map(r => r.toString()).slice(0, -1).length > 10 ? 'Too many roles to show here' : `${ctx.message.guild.members.cache.get(user?.id).roles.cache.sort((a, b) => b.position - a.position).map(r => r.toString()).slice(0, -1).length ? ctx.message.guild.members.cache.get(user?.id).roles.cache.sort((a, b) => b.position - a.position).map(r => r.toString()).slice(0, -1).join(', ') : 'The user don\'t have any roles'}`}\n**Color:** ${color}`,
										inline: false,
									}],
									color: 16705372,
									thumbnail: {
										url: iconURL,
									},
								}],
								components: [{
									type: 1,
									components: [{
										type: 2,
										label: 'Account',
										custom_id: one,
										style: 2,
									},
									{
										type: 2,
										label: 'Guild',
										custom_id: two,
										style: 2,
									},
									{
										type: 2,
										label: 'Roles',
										custom_id: three,
										disabled: true,
										style: 3,
									},
									{
										type: 2,
										label: 'Permissions',
										custom_id: four,
										style: 2,
									},
									],
								}],
							});

							page = 3;

							collector.resetTimer();
							break;
						case four:
							if (i.user?.id !== ctx.message.author?.id) {
								return i.reply({
									content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
									ephemeral: true,
								});
							}

							await i.deferUpdate();

							const perms = ctx.message.guild.members.cache.get(user?.id).permissions.toArray();

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
								finalperms = permstext.join(', ') || 'The user doesn\'t have any permission';
							}

							i.editReply({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									fields: [{
										name: '__Permissions__',
										value: `${finalperms}`,
										inline: false,
									}],
									color: 16705372,
									thumbnail: {
										url: user?.displayAvatarURL({ size: 2048 }),
									},
								}],
								components: [{
									type: 1,
									components: [{
										type: 2,
										label: 'Account',
										custom_id: one,
										style: 2,
									},
									{
										type: 2,
										label: 'Guild',
										custom_id: two,
										style: 2,
									},
									{
										type: 2,
										label: 'Roles',
										custom_id: three,
										style: 2,
									},
									{
										type: 2,
										label: 'Permissions',
										custom_id: four,
										disabled: true,
										style: 3,
									},
									],
								}],
							});
							page = 4;

							collector.resetTimer();
							break;
					}
				}
			});

			collector.on('end', async (collected, reason) => {
				if (reason === 'time') {
					await msg.edit({
						components: [{
							type: 1,
							components: [{
								type: 2,
								label: 'Account',
								custom_id: one,
								disabled: true,
								style: page === 1 ? 3 : 2,
							},
							{
								type: 2,
								label: 'Guild',
								custom_id: two,
								disabled: true,
								style: page === 2 ? 3 : 2,
							},
							{
								type: 2,
								label: 'Roles',
								custom_id: three,
								disabled: true,
								style: page === 3 ? 3 : 2,
							},
							{
								type: 2,
								label: 'Permissions',
								custom_id: four,
								disabled: true,
								style: page === 4 ? 3 : 2,
							},
							],
						}],
					});
				}
			});
		}
		else if (!data && ctx.message.guild.members.cache.get(user?.id) !== undefined) {

			let page = 1;

			let userStatus = 'No Activities Available';

			if (ctx.message.guild.members.cache.get(user?.id).presence?.activities?.length === undefined) {
				userStatus = 'No Activities Available';
			}
			else if (ctx.message.guild.members.cache.get(user?.id).presence?.activities?.length === 0) {
				userStatus = 'No Activities Available';
			}
			else if (ctx.message.guild.members.cache.get(user?.id).presence?.activities?.length > 3) {
				userStatus = 'The user has more than 3 activities.';
			}
			else {


				const array = [];
				const activities = ctx.message.guild.members.cache.get(user?.id).presence?.activities;
				for (let i = 0; i < activities?.length; i++) {
					const name = activities[i].name || 'No Name';
					const details = activities[i].details || 'No Details';
					const state = activities[i].state || 'No State';

					array.push(`**Name:** ${name}\n**State:** ${state}\n**Details:** ${details}`);
				}

				userStatus = array.join('\n\n');
			}


			const msg = await ctx.message.reply({
				embeds: [{
					author: {
						name: user?.globalName || user?.username,
						icon_url: user?.displayAvatarURL({ size: 2048 }),
					},
					fields: [{
						name: '__General Information__',
						value: `**Username:** ${user?.username}${user?.discriminator !== '0' ? `#${user?.discriminator}` : ''}\n${user?.globalName !== null ? `**Display Name:** ${user?.globalName}\n` : ''}**ID:** ${user?.id}\n**Registered:** <t:${Math.floor(user?.createdTimestamp / 1000)}:F> [<t:${Math.floor(user?.createdTimestamp / 1000)}:R>]\n**Is Bot?:** ${user?.bot ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}${badge ? `\n**Badges:** ${badge}` : ''}`,
						inline: false,
					},
					{
						name: '__Profile Picture__',
						value: `**Animated:** ${user?.avatar ? user?.avatar.startsWith('a_') ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Download:** ${user?.avatar ? user?.avatar.startsWith('a_') ? `[Click Me](https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.gif)` : `[Click Me](https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png)` : `[Click Me](${user?.displayAvatarURL({ size: 2048 })})`}`,
						inline: false,
					},
					{
						name: '__Activities__',
						value: userStatus,
						inline: true,
					},
					],
					color: 16705372,
					thumbnail: {
						url: user?.displayAvatarURL({ size: 2048 }),
					},
					image: {
						url: banner,
					},
				}],
				components: [{
					type: 1,
					components: [{
						type: 2,
						label: 'Account',
						custom_id: one,
						disabled: true,
						style: 3,
					},
					{
						type: 2,
						label: 'Guild',
						custom_id: two,
						style: 2,
					},
					{
						type: 2,
						label: 'Roles',
						custom_id: three,
						style: 2,
					},
					{
						type: 2,
						label: 'Permissions',
						custom_id: four,
						style: 2,
					},
					],
				}],
			});

			const collector = msg.createMessageComponentCollector({
				time: 60000,
			});

			collector.on('collect', async (i) => {
				if (i.isButton()) {
					switch (i.customId) {
						case one:

							page = 1;

							userStatus = 'No Activities Available';

							if (ctx.message.guild.members.cache.get(user?.id).presence?.activities?.length === undefined) {
								userStatus = 'No Activities Available';
							}
							else if (ctx.message.guild.members.cache.get(user?.id).presence?.activities?.length === 0) {
								userStatus = 'No Activities Available';
							}
							else if (ctx.message.guild.members.cache.get(user?.id).presence?.activities?.length > 3) {
								userStatus = 'The user has more than 3 activities.';
							}
							else {


								const array = [];
								const activities = ctx.message.guild.members.cache.get(user?.id).presence?.activities;
								for (let i = 0; i < activities?.length; i++) {
									const name = activities[i].name || 'No Name';
									const details = activities[i].details || 'No Details';
									const state = activities[i].state || 'No State';

									array.push(`**Name:** ${name}\n**State:** ${state}\n**Details:** ${details}`);
								}

								userStatus = array.join('\n\n');
							}

							if (i.user?.id !== ctx.message.author?.id) {
								return i.reply({
									content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
									ephemeral: true,
								});
							}

							await i.deferUpdate();
							i.editReply({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									fields: [{
										name: '__General Information__',
										value: `**Username:** ${user?.username}${user?.discriminator !== '0' ? `#${user?.discriminator}` : ''}\n${user?.globalName !== null ? `**Display Name:** ${user?.globalName}\n` : ''}**ID:** ${user?.id}\n**Registered:** <t:${Math.floor(user?.createdTimestamp / 1000)}:F> [<t:${Math.floor(user?.createdTimestamp / 1000)}:R>]\n**Is Bot?:** ${user?.bot ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}${badge ? `\n**Badges:** ${badge}` : ''}`,
										inline: false,
									},
									{
										name: '__Profile Picture__',
										value: `**Animated:** ${user?.avatar ? user?.avatar.startsWith('a_') ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Download:** ${user?.avatar ? user?.avatar.startsWith('a_') ? `[Click Me](https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.gif)` : `[Click Me](https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png)` : `[Click Me](${user?.displayAvatarURL({ size: 2048 })})`}`,
										inline: false,
									},
									{
										name: '__Activities__',
										value: userStatus,
										inline: true,
									},
									],
									color: 16705372,
									thumbnail: {
										url: user?.displayAvatarURL({ size: 2048 }),
									},
									image: {
										url: banner,
									},
								}],
								components: [{
									type: 1,
									components: [{
										type: 2,
										label: 'Account',
										custom_id: one,
										disabled: true,
										style: 3,
									},
									{
										type: 2,
										label: 'Guild',
										custom_id: two,
										style: 2,
									},
									{
										type: 2,
										label: 'Roles',
										custom_id: three,
										style: 2,
									},
									{
										type: 2,
										label: 'Permissions',
										custom_id: four,
										style: 2,
									},
									],
								}],
							});

							collector.resetTimer();
							break;
						case two:
							if (i.user?.id !== ctx.message.author?.id) {
								return i.reply({
									content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
									ephemeral: true,
								});
							}

							await i.deferUpdate();
							let acc = 'No Acknowledgements';

							if (
								ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.BanMembers) ||
                                ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.ManageMessages) ||
                                ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.KickMembers) ||
                                ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.ManageRoles) ||
                                ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.ModerateMembers)
							) {
								acc = 'Server Moderator';
							}
							if (ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.ManageEvents)) {
								acc = 'Event Manager';
							}
							if (ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.ManageGuild)) {
								acc = 'Server Manager';
							}
							if (ctx.message.guild.members.cache.get(user?.id).permissions.has(PermissionsBitField.Flags.Administrator)) {
								acc = 'Administrator';
							}
							if (user?.id === ctx.message.guild.ownerId) {
								acc = 'Server Owner';
							}
							i.editReply({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									fields: [{
										name: `__Information in ${ctx.message.guild.name}__`,
										value: `**Joined:** <t:${Math.floor(ctx.message.guild.members.cache.get(user?.id).joinedAt / 1000)}:F> [<t:${Math.floor(ctx.message.guild.members.cache.get(user?.id).joinedAt / 1000)}:R>]\n**Nickname:** ${ctx.message.guild.members.cache.get(user?.id).nickname || 'No Nickname'}\n**Booster:** ${ctx.message.guild.members.cache.get(user?.id).premiumSince ? `${process.env.SUCCESS_EMOJI}` : `${process.env.FAILURE_EMOJI}`}\n**Boosting Since:** ${ctx.message.guild.members.cache.get(user?.id).premiumSinceTimestamp === null ? 'Not Boosting' : `<t:${~~(ctx.message.guild.members.cache.get(user?.id).premiumSinceTimestamp / 1000)}:R>`}\n**Acknowledgements:** ${acc}`,
										inline: false,
									}],
									color: 16705372,
									thumbnail: {
										url: ctx.message.guild.members.cache.get(user?.id).displayAvatarURL({ size: 2048 }) || user?.displayAvatarURL({ size: 2048 }),
									},
								}],
								components: [{
									type: 1,
									components: [{
										type: 2,
										label: 'Account',
										custom_id: one,
										style: 2,
									},
									{
										type: 2,
										label: 'Guild',
										custom_id: two,
										disabled: true,
										style: 3,
									},
									{
										type: 2,
										label: 'Roles',
										custom_id: three,
										style: 2,
									},
									{
										type: 2,
										label: 'Permissions',
										custom_id: four,
										style: 2,
									},
									],
								}],
							});

							page = 2;

							collector.resetTimer();
							break;
						case three:

							let iconURL = null;

							if (ctx.message.guild.members.cache.get(user?.id).roles.icon) {
								iconURL = ctx.message.guild.members.cache.get(user?.id).roles.icon.iconURL();
							}

							let color = 'No Color';

							if (ctx.message.guild.members.cache.get(user?.id).roles.color) {
								color = `${ctx.message.guild.members.cache.get(user?.id).roles.color.hexColor} (${ctx.message.guild.members.cache.get(user?.id).roles.color.color})`;
							}


							if (i.user?.id !== ctx.message.author?.id) {
								return i.reply({
									content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
									ephemeral: true,
								});
							}

							await i.deferUpdate();
							i.editReply({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									fields: [{
										name: '__Role info__',
										value: `\n**Highest Role:** <@&${ctx.message.guild.members.cache.get(user?.id).roles.highest.id}>\n**Roles:** ${ctx.message.guild.members.cache.get(user?.id).roles.cache.sort((a, b) => b.position - a.position).map(r => r.toString()).slice(0, -1).length > 10 ? 'Too many roles to show here' : `${ctx.message.guild.members.cache.get(user?.id).roles.cache.sort((a, b) => b.position - a.position).map(r => r.toString()).slice(0, -1).length ? ctx.message.guild.members.cache.get(user?.id).roles.cache.sort((a, b) => b.position - a.position).map(r => r.toString()).slice(0, -1).join(', ') : 'The user don\'t have any roles'}`}\n**Color:** ${color}`,
										inline: false,
									}],
									color: 16705372,
									thumbnail: {
										url: iconURL,
									},
								}],
								components: [{
									type: 1,
									components: [{
										type: 2,
										label: 'Account',
										custom_id: one,
										style: 2,
									},
									{
										type: 2,
										label: 'Guild',
										custom_id: two,
										style: 2,
									},
									{
										type: 2,
										label: 'Roles',
										custom_id: three,
										disabled: true,
										style: 3,
									},
									{
										type: 2,
										label: 'Permissions',
										custom_id: four,
										style: 2,
									},
									],
								}],
							});

							page = 3;

							collector.resetTimer();
							break;
						case four:
							if (i.user?.id !== ctx.message.author?.id) {
								return i.reply({
									content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
									ephemeral: true,
								});
							}

							await i.deferUpdate();

							const perms = ctx.message.guild.members.cache.get(user?.id).permissions.toArray();

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
								finalperms = permstext.join(', ') || 'The user doesn\'t have any permission';
							}

							i.editReply({
								embeds: [{
									author: {
										name: user?.globalName || user?.username,
										icon_url: user?.displayAvatarURL({ size: 2048 }),
									},
									fields: [{
										name: '__Permissions__',
										value: `${finalperms}`,
										inline: false,
									}],
									color: 16705372,
									thumbnail: {
										url: user?.displayAvatarURL({ size: 2048 }),
									},
								}],
								components: [{
									type: 1,
									components: [{
										type: 2,
										label: 'Account',
										custom_id: one,
										style: 2,
									},
									{
										type: 2,
										label: 'Guild',
										custom_id: two,
										style: 2,
									},
									{
										type: 2,
										label: 'Roles',
										custom_id: three,
										style: 2,
									},
									{
										type: 2,
										label: 'Permissions',
										custom_id: four,
										disabled: true,
										style: 3,
									},
									],
								}],
							});
							page = 4;

							collector.resetTimer();
							break;
					}
				}
			});

			collector.on('end', async (collected, reason) => {
				if (reason === 'time') {
					await msg.edit({
						components: [{
							type: 1,
							components: [{
								type: 2,
								label: 'Account',
								custom_id: one,
								disabled: true,
								style: page === 1 ? 3 : 2,
							},
							{
								type: 2,
								label: 'Guild',
								custom_id: two,
								disabled: true,
								style: page === 2 ? 3 : 2,
							},
							{
								type: 2,
								label: 'Roles',
								custom_id: three,
								disabled: true,
								style: page === 3 ? 3 : 2,
							},
							{
								type: 2,
								label: 'Permissions',
								custom_id: four,
								disabled: true,
								style: page === 4 ? 3 : 2,
							},
							],
						}],
					});
				}
			});
		}
	},
});