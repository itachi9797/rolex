const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/antinuke');
const Owners = require('../../../../Database/Schemas/owners');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');

module.exports = new App({
	name: 'antinuke',
	description: 'Enable and Disable antinuke for your server!',
	aliases: ['security'],
	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});

		if (ctx.message.author?.id !== ctx.message.guild.ownerId && !(owner_data && owner_data.additional_owners.includes(ctx.message.author?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const ops = ctx.message.content.split(' ').slice(1).shift()?.toLowerCase();

		if (!ops) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Please provide a valid option! Available options: \`Enable\`, \`Disable\``
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (ops !== 'enable' && ops !== 'disable') {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Please provide a valid option! Available options: \`Enable\`, \`Disable\``
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		await Schema.findOne({
			Guild: ctx.message.guild.id,
		}).then(async (data) => {
			if (data && ops === 'enable') {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You already have antinuke enabled for this server!`
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			} else if (!data && ops === 'disable') {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You already have antinuke disabled for this server!`
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
			else {
				const yes = generateCustomID();
				const no = generateCustomID();

				const msg = await ctx.message.reply({
					embeds: [{
						description: `**Are you sure you want to ${ops} antinuke for this server?**`,
						color: 16705372,
					}],
					components: [{
						type: 1,
						components: [{
							type: 2,
							label: 'Continue',
							emoji: {
								name: 'tick',
								id: '968773535914922014',
							},
							style: 3,
							custom_id: yes,
						}, {
							type: 2,
							label: 'Cancel',
							emoji: {
								name: 'cross',
								id: '968773791943626762',
							},
							style: 4,
							custom_id: no,
						}],
					}],
				});

				const collector = msg.createMessageComponentCollector({
					time: 30000,
				});

				collector.on('collect', async (i) => {
					if (i.user?.id !== ctx.message.author?.id) {
						return i.reply({
							content: `${process.env.FAILURE_EMOJI} | This confirmation is not for you!`,
							ephemeral: true,
						});
					}
					await i.deferUpdate();

					switch (i.customId) {
						case yes:
							ops === 'enable' ? await Schema.create({
								Guild: ctx.message.guild.id,
								antiban: true,
								antibot: true,
								antikick: true,
								antiChannelCreate: true,
								antiChannelDelete: true,
								antiChannelUpdate: true,
								antiRoleCreate: true,
								antiRoleDelete: true,
								antiRoleUpdate: true,
								antiserver: true,
								antiwebhookCreate: true,
								antiwebhookDelete: true,
								antiwebhookUpdate: true,
								antiprune: true,
								antiVanitySteal: true,
								antimember: true,
								antiunban: true,
								antiEmojiDelete: true,
								antiInviteDelete: true,
								antiEveryone: true,
							}) : await data.deleteOne();

							i.editReply({
								embeds: [{
									author: {
										name: `${ctx.client.user?.globalName || ctx.client.user?.username} Security`,
										icon_url: ctx.client.user?.displayAvatarURL({ size: 2048 }),
									},
									title: `${ctx.message.guild.name} security settings`,
									fields: [{
										name: 'STATUS',
										value: `All antinuke utilities has been ${ops}d!\n\n**Antinuke:** ${ops === 'enable' ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}`,
										inline: false,
									}],
									color: 16705372,
									footer: {
										text: `Desired by ${ctx.message.author?.username}`,
										icon_url: ctx.message.author?.displayAvatarURL({ size: 2048 }),
									},
								}],
								components: [],
							});

							collector.stop();
							break;
						case no:
							collector.stop('cancelled');
							break;
					}
				});

				collector.on('end', async (collected, reason) => {
					if (reason === 'time' || reason === 'cancelled') {
						await msg.edit({
							embeds: [{
								description: '**Action Cancelled**',
								color: 16705372,
							}],
							components: [{
								type: 1,
								components: msg.components[0].components.map((x) => {
									x.data.disabled = true;
									return x.data;
								})
							}],
						});
					}
				});
			}
		});
	},
});