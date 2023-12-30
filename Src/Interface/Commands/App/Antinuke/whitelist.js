const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/antinuke');
const Owners = require('../../../../Database/Schemas/owners');
const { EmbedBuilder } = require('discord.js');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');

module.exports = new App({
	name: 'whitelist',
	description: 'Adds/removes/resets/shows whitelist',
	usage: 'whitelist <add | remove | reset | show> [user]',
	userPermissions: ['Server Owner'],
	aliases: ['wl'],
	options: [{
		name: 'add',
		description: 'Add a trusted member to the antinuke whitelist for better security!',
		type: 1,
		options: [{
			name: 'user',
			description: 'The user you want to add in whitelist',
			type: 6,
			required: true,
		}],
	},
	{
		name: 'remove',
		description: 'Removes a member from the antinuke whitelist for better security!',
		type: 1,
		options: [{
			name: 'user',
			description: 'The user you want to remove from whitelist',
			type: 6,
			required: true,
		}],
	},
	{
		name: 'reset',
		description: 'Resets the whole whitelist resulting in removing everyone from the list!',
		type: 1,
	},
	{
		name: 'show',
		description: 'Shows the list of whitelisted users!',
		type: 1,
	},
	],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.interaction.guild.id,
		});

		if (ctx.interaction.user?.id !== ctx.interaction.guild.ownerId && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.user?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`,
				ephemeral: true,
			});
		}

		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {
			if (!data) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | Antinuke is disabled for this server!`,
					ephemeral: true,
				});
			}
			switch (ctx.interaction.options.getSubcommand()) {
				case 'add':
					if (ctx.interaction.guild.members.cache.get(ctx.interaction.options.getUser('user').id) === undefined) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | No member found with the given id!`,
							ephemeral: true,
						});
					}
					if (data.whitelist.includes(ctx.interaction.options.getUser('user').id)) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | This user is already in my whitelist!`,
							ephemeral: true,
						});
					}
					if (data.whitelist.length >= 20) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | You can't add more than 20 users to the whitelist!`,
							ephemeral: true,
						});
					}
					data.whitelist.push(ctx.interaction.options.getUser('user').id);
					await data.save();
					ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Added **${ctx.interaction.options.getUser('user').globalName !== null ? ctx.interaction.options.getUser('user').globalName : ctx.interaction.options.getUser('user').username}** to my whitelist!`,
					});
					break;
				case 'remove':
					if (!data.whitelist.includes(ctx.interaction.options.getUser('user').id)) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | This user is not in my whitelist!`,
							ephemeral: true,
						});
					}
					const index = data.whitelist.indexOf(ctx.interaction.options.getUser('user').id);
					data.whitelist.splice(index, 1);
					await data.save();
					ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Removed **${ctx.interaction.options.getUser('user').globalName !== null ? ctx.interaction.options.getUser('user').globalName : ctx.interaction.options.getUser('user').username}** from my whitelist!`,
					});
					break;
				case 'reset':
					data.whitelist.splice(0, data.whitelist.length);
					await data.save();
					ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Reset was done everyone was removed from whitelist!`,
					});
					break;
				case 'show':
					if (data.whitelist.length === 0) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | This server has no one whitelisted!, add someone to view the list.`,
							ephemeral: true,
						});
					}

					let i0 = 0;
					let i1 = 10;

					const emb = new EmbedBuilder()
						.setTitle(`Total Whitelisted Users : ${data.whitelist.length}`)
						.setColor(16705372)
						.setDescription((await Promise.all(data.whitelist
							.map((r) => r)
							.map(async (r, i) =>
								`\`${i + 1}\` | ${(ctx.client.users.cache.get(r) ? ctx.client.users.cache.get(r) : (await ctx.client.users.fetch(r))).globalName !== null ? ctx.client.users.cache.get(r).globalName : ctx.client.users.cache.get(r).username} | <@${r}>)`)))
							.slice(0, 10)
							.join('\n'))
						.setFooter({
							text: `${ctx.client.user?.globalName || ctx.client.user?.username} • Page ${i0 / 10 + 1}/${Math.ceil(data.whitelist.length / 10)}`,
							icon_url: ctx.client.user?.displayAvatarURL({ size: 2048 }),
						});

					if (data.whitelist.length <= 10) {
						return ctx.interaction.reply({
							fetchReply: true,
							embeds: [emb],
						});
					}

				
					const start = generateCustomID();

					const prev = generateCustomID();

					const stop = generateCustomID();

					const next = generateCustomID();

					const end = generateCustomID();

					const msg = await ctx.interaction.reply({
						fetchReply: true,
						embeds: [emb],
						components: [{
							type: 1,
							components: [{
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
						time: 60000,
					});

					collector.on('collect', async (i) => {

						if (i.user.id !== ctx.interaction.user.id) return i.reply({ 
							content: `${process.env.FAILURE_EMOJI} | You can't control this pagination!`,
							ephemeral: true,
						});

						await i.deferUpdate();

						if (i.customId === start) {
							i0 = 0;
							i1 = 10;
						}

						if (i.customId === end) {
							i0 = data.whitelist.length - 10;
							i1 = data.whitelist.length;
						}

						if (i.customId === prev) {
							i0 = i0 - 10;
							i1 = i1 - 10;
						}

						if (i.customId === stop) {
							return collector.stop();
						}

						if (i.customId === next) {
							i0 = i0 + 10;
							i1 = i1 + 10;
						}
					});

					emb 
						.setTitle(`Total Whitelisted Users : ${data.whitelist.length}`)
						.setDescription((await Promise.all(data.whitelist
							.map((r) => r)
							.map(async (r, i) =>
								`\`${i + 1}\` | ${(ctx.client.users.cache.get(r) ? ctx.client.users.cache.get(r) : (await ctx.client.users.fetch(r))).globalName !== null ? ctx.client.users.cache.get(r).globalName : ctx.client.users.cache.get(r).username} | <@${r}>)`)))
							.slice(i0, i1)
							.join('\n'))
						.setFooter({
							text: `${ctx.client.user?.globalName || ctx.client.user?.username} • Page ${i0 / 10 + 1}/${Math.ceil(data.whitelist.length / 10)}`,
							icon_url: ctx.client.user?.displayAvatarURL({ size: 2048 }),
						});

					msg.edit({
						embeds: [emb],
						components: [{
							type: 1,
							components: msg.components[0].components.map((component, index) => { 
								if (index === 0 || index === 1) {
									component.data.disabled = i0 === 0;
								} else if (index === 3 || index === 4) {
									component.data.disabled = i0 === data.whitelist.length - 10;
								}
								return component.data;
							}),
						}],
					});

					collector.on('end', async (collected, reason) => {
						msg.edit({
							components: msg.components[0].components.map((component) => { 
								component.data.disabled = true;
								return component.data;
							}),
						});
					});
					break;
			}
	  });
	},
});
