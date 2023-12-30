const App = require('../../../../Structures/Core/App');
const Owners = require('../../../../Database/Schemas/owners');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');

module.exports = new App({
	name: 'glist',
	description: 'Show all giveaways on the server!',

	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});

		const giveawayRole = ctx.message.guild.roles.cache.find(r => r.name.toLowerCase() === 'giveaways');

		if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id)) && !ctx.message.member?.roles.cache.has(giveawayRole?.id)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You need the \`Manage Server\` permissions or Giveaways role to get a list of giveaway of this server!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const giveaway = ctx.client.giveawaysManager.giveaways.filter((g) => g.guildId === ctx.message.guild.id);

		if (!giveaway.length) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | There are no giveaways in this server!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		let i0 = 0;
		let i1 = 10;

		let giveawayList = (await Promise.all(giveaway
			.map((g) => g)
			.map(async (g, i) =>
				`\`${i + 1}\` | ${g.prize} | **ID:** [${g.messageId}](https://discord.com/channels/${g.guildId}/${g.channelId}/${g.messageId}) | **Ends:** <t:${Math.floor(g.endAt / 1000)}:R>`)))
			.slice(0, 10)
			.join('\n');

		const emb = new EmbedBuilder()
			.setTitle('Total Giveaways: ' + giveaway.length + '')
			.setDescription(giveawayList)
			.setColor(16705372);

		if (giveaway.length <= 10) {
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
			time: 120000,
		});

		collector.on('collect', async (i) => {
			if (i.user.id !== ctx.message.author.id) return i.reply({ 
				content: `${process.env.FAILURE_EMOJI} | You cannot control this pagination!`,
				ephemeral: true 
			})

			await i.deferUpdate();

			if (i.customId === start) {
				i0 = 0;
				i1 = 10;
			}

			if (i.customId === prev) {
				i0 = i0 - 10;
				i1 = i1 - 10;
			}

			if (i.customId === stop) {
				i0 = i0 + 10;
				i1 = i1 + 10;
			}

			if (i.customId === next) {
				i0 = i0 + 10;
				i1 = i1 + 10;
			}

			if (i.customId === end) {
				i0 = giveaway.length - 10;
				i1 = giveaway.length;
			}

			giveawayList = (await Promise.all(giveaway
				.map((g) => g)
				.map(async (g, i) =>
					`\`${i + 1}\` | ${g.prize} | **ID:** [${g.messageId}](https://discord.com/channels/${g.guildId}/${g.channelId}/${g.messageId}) | **Ends:** <t:${Math.floor(g.endAt / 1000)}:R>`)))
				.slice(i0, i1)
				.join('\n');

			emb
				.setDescription(giveawayList);

			msg.edit({
				embeds: [emb],
				components: [{
					type: 1,
					components: msg.components[0].components.map((c, i) => {
						if (i === 0) {
							c.data.disabled = i0 === 0;
						}
						else if (i === 1) {
							c.data.disabled = i0 === 0;
						}
						else if (i === 3) {
							c.data.disabled = i1 >= giveaway.length;
						}
						else if (i === 4) {
							c.data.disabled = i1 >= giveaway.length;
						} else {
							c.data.disabled = false;
						}
						return c.data;
					})
				}]
			});
		});

		collector.on('end', () => {
			msg.edit({
				components: msg.components[0].components.map((c) => {
					c.data.disabled = true;
					return c.data;
				})
			});
		});
	},
});