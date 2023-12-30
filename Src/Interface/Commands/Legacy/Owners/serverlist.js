const App = require('../../../../Structures/Core/App');
const { EmbedBuilder } = require('discord.js');

module.exports = new App({
	name: 'serverlist',
	description: 'Shows the list of servers the bot is in',
	usage: 'serverlist',
	aliases: ['sl'],
	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {

		if (!ctx.client.owners.includes(ctx.message.author?.id)) return;

		let i0 = 0;
		let i1 = 10;
		let page = 1;

		let description;

		description = (await Promise.all(ctx.client.guilds.cache
			.sort((a, b) => b.memberCount - a.memberCount)
			.map((r) => r)
			.map(async (r, i) =>
				`\`[${i + 1}]\` |  ${r.name} (<:id:1097007267020279878>: ${r.id})\n<:owner:993945290337964153> : ${(await ctx.client.users.fetch(r.ownerId)).username} | <:members:1097007269985656882> ${r.memberCount} members`)))
			.slice(i0, i1)
			.join('\n\n');

		const emb = new EmbedBuilder()
			.setTitle(`Server List - ${ctx.client.user?.globalName || ctx.client.user?.username}`)
			.setColor(16705372)
			.setFooter({
				text: `Total servers: ${(await ctx.client.application.fetch()).approximateGuildCount}| Page ${page}/${Math.ceil(ctx.client.guilds.cache.size / 10)}`,
				iconURL: ctx.client.user?.avatarURL(),
			})
			.setDescription(description)
			.setThumbnail(ctx.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)[0].iconURL());

		if (ctx.client.guilds.cache.size <= 10) {
			return ctx.message.channel?.send({
				embeds: [emb],
			});
		}

		const msg = await ctx.message.reply({
			embeds: [emb],
			components: [{
				type: 1,
				components: [{
					type: 2,
					emoji: {
						name: 'arrow_backward',
						id: '996005616147513406',
					},
					style: 2,
					disabled: true,
					custom_id: 'previous',
				},
				{
					type: 2,
					emoji: {
						name: 'stop',
						id: '996000402338226196',
					},
					style: 2,
					disabled: false,
					custom_id: 'stop',
				},
				{
					type: 2,
					emoji: {
						name: 'arrow_forward',
						id: '996005619767181323',
					},
					style: 2,
					disabled: false,
					custom_id: 'next',
				},
				],
			}],
		});

		const filter = (i) => i.user?.id === ctx.message.author?.id;

		const collector = msg.createMessageComponentCollector({
			filter,
			time: 60000,
		});

		collector.on('collect', async (i) => {
			await i.deferUpdate();
			if (i.customId === 'previous') {
				collector.resetTimer();
				if ((i1 - 10) < 9) {
					return i.reply({
						content: `${process.env.FAILURE_EMOJI} | You are already in the first page!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				i0 = i0 - 10;
				i1 = i1 - 10;
				page = page - 1;

				description = (await Promise.all(ctx.client.guilds.cache
					.sort((a, b) => b.memberCount - a.memberCount)
					.map((r) => r)
					.map(async (r, i) =>
						`\`[${i + 1}]\` |  ${r.name} (<:id:1097007267020279878>: ${r.id})\n<:owner:993945290337964153> : ${(await ctx.client.users.fetch(r.ownerId)).username} | <:members:1097007269985656882> ${r.memberCount} members`)))
					.slice(i0, i1)
					.join('\n\n');

				emb
					.setFooter({
						text: `Total servers: ${(await ctx.client.application.fetch()).approximateGuildCount} | Page ${page}/${Math.ceil(ctx.client.guilds.cache.size / 10)}`,
						iconURL: ctx.client.user?.avatarURL(),
					})
					.setDescription(description)
					.setThumbnail(ctx.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)[i0].iconURL());

				if (page === 1) {
					msg.edit({
						embeds: [emb],
						components: [{
							type: 1,
							components: [{
								type: 2,
								emoji: {
									name: 'arrow_backward',
									id: '996005616147513406',
								},
								style: 2,
								disabled: true,
								custom_id: 'previous',
							},
							{
								type: 2,
								emoji: {
									name: 'stop',
									id: '996000402338226196',
								},
								style: 2,
								disabled: false,
								custom_id: 'stop',
							},
							{
								type: 2,
								emoji: {
									name: 'arrow_forward',
									id: '996005619767181323',
								},
								style: 2,
								disabled: false,
								custom_id: 'next',
							},
							],
						}],
					});
				}
				else {
					msg.edit({
						embeds: [emb],
						components: [{
							type: 1,
							components: [{
								type: 2,
								emoji: {
									name: 'arrow_backward',
									id: '996005616147513406',
								},
								style: 2,
								disabled: false,
								custom_id: 'previous',
							},
							{
								type: 2,
								emoji: {
									name: 'stop',
									id: '996000402338226196',
								},
								style: 2,
								disabled: false,
								custom_id: 'stop',
							},
							{
								type: 2,
								emoji: {
									name: 'arrow_forward',
									id: '996005619767181323',
								},
								style: 2,
								disabled: false,
								custom_id: 'next',
							},
							],
						}],
					});
				}
			}

			if (i.customId === 'next') {
				collector.resetTimer();
				if ((i1 + 10) > ctx.client.guilds.cache.size + 10) {
					return i.reply({
						content: `${process.env.FAILURE_EMOJI} | You are already in the last page!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				if (!(i0 + 10) || !(i1 + 10)) {
					return i.reply({
						content: `${process.env.FAILURE_EMOJI} | You are already in the last page!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				i0 = i0 + 10;
				i1 = i1 + 10;
				page = page + 1;

				description = (await Promise.all(ctx.client.guilds.cache
					.sort((a, b) => b.memberCount - a.memberCount)
					.map((r) => r)
					.map(async (r, i) =>
						`\`[${i + 1}]\` |  ${r.name} (<:id:1097007267020279878>: ${r.id})\n<:owner:993945290337964153> : ${(await ctx.client.users.fetch(r.ownerId)).username} | <:members:1097007269985656882> ${r.memberCount} members`)))
					.slice(i0, i1)
					.join('\n\n');

				emb
					.setFooter({
						text: `Total servers: ${(await ctx.client.application.fetch()).approximateGuildCount} | Page ${page}/${Math.ceil(ctx.client.guilds.cache.size / 10)}`,
						iconURL: ctx.client.user?.avatarURL(),
					})
					.setDescription(description)
					.setThumbnail(ctx.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)[i0].iconURL());
				if (page === Math.ceil(ctx.client.guilds.cache.size / 10)) {
					msg.edit({
						embeds: [emb],
						components: [{
							type: 1,
							components: [{
								type: 2,
								emoji: {
									name: 'arrow_backward',
									id: '996005616147513406',
								},
								style: 2,
								disabled: false,
								custom_id: 'previous',
							},
							{
								type: 2,
								emoji: {
									name: 'stop',
									id: '996000402338226196',
								},
								style: 2,
								disabled: false,
								custom_id: 'stop',
							},
							{
								type: 2,
								emoji: {
									name: 'arrow_forward',
									id: '996005619767181323',
								},
								style: 2,
								disabled: true,
								custom_id: 'next',
							},
							],
						}],
					});
				}
				else {
					msg.edit({
						embeds: [emb],
						components: [{
							type: 1,
							components: [{
								type: 2,
								emoji: {
									name: 'arrow_backward',
									id: '996005616147513406',
								},
								style: 2,
								disabled: false,
								custom_id: 'previous',
							},
							{
								type: 2,
								emoji: {
									name: 'stop',
									id: '996000402338226196',
								},
								style: 2,
								disabled: false,
								custom_id: 'stop',
							},
							{
								type: 2,
								emoji: {
									name: 'arrow_forward',
									id: '996005619767181323',
								},
								style: 2,
								disabled: false,
								custom_id: 'next',
							},
							],
						}],
					});
				}
			}
			if (i.customId === 'stop') {
				collector.stop();
				msg.edit({
					components: [{
						type: 1,
						components: [{
							type: 2,
							emoji: {
								name: 'arrow_backward',
								id: '996005616147513406',
							},
							style: 2,
							disabled: true,
							custom_id: 'previous',
						},
						{
							type: 2,
							emoji: {
								name: 'stop',
								id: '996000402338226196',
							},
							style: 2,
							disabled: true,
							custom_id: 'stop',
						},
						{
							type: 2,
							emoji: {
								name: 'arrow_forward',
								id: '996005619767181323',
							},
							style: 2,
							disabled: true,
							custom_id: 'next',
						},
						],
					}],
				});
			}
		});

		collector.on('end', async (collected, reason) => {
			if (reason === 'time') {
				msg.edit({
					components: [{
						type: 1,
						components: [{
							type: 2,
							emoji: {
								name: 'arrow_backward',
								id: '996005616147513406',
							},
							style: 2,
							disabled: true,
							custom_id: 'previous',
						},
						{
							type: 2,
							emoji: {
								name: 'stop',
								id: '996000402338226196',
							},
							style: 2,
							disabled: true,
							custom_id: 'stop',
						},
						{
							type: 2,
							emoji: {
								name: 'arrow_forward',
								id: '996005619767181323',
							},
							style: 2,
							disabled: true,
							custom_id: 'next',
						},
						],
					}],
				});
			}
		});
	},
});