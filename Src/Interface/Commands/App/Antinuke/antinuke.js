const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/antinuke');
const Owners = require('../../../../Database/Schemas/owners');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');

module.exports = new App({
	name: 'antinuke',
	description: 'Enable and Disable antinuke for your server!',
	usage: 'antinuke <enable | disable>',
	userPermissions: ['Server Owner'],
	aliases: ['security'],
	options: [{
		name: 'toggle',
		description: 'Toggle\'s the antinuke as per the given option',
		required: true,
		type: 3,
		choices: [{
			name: 'ENABLE',
			value: 'enable',
		},
		{
			name: 'DISABLE',
			value: 'disable',
		},
		],
	}],

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

		const ops = ctx.interaction.options.getString('toggle');

		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {
			if (data && ops === 'enable') {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | You already have antinuke enabled for this server!`,
					ephemeral: true,
				});
			} else if (!data && ops === 'disable') {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | You already have antinuke disabled for this server!`,
					ephemeral: true,
				});
			}
			else {
				const yes = generateCustomID();
				const no = generateCustomID();

				const msg = await ctx.interaction.reply({
					fetchReply: true,
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
					if (i.user?.id !== ctx.interaction.user?.id) {
						return i.reply({
							content: `${process.env.FAILURE_EMOJI} | This confirmation is not for you!`,
							ephemeral: true,
						});
					}
					await i.deferUpdate();

					switch (i.customId) {
						case yes:
							ops === 'enable' ? await Schema.create({
								Guild: ctx.interaction.guild.id,
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
									title: `${ctx.interaction.guild.name} security settings`,
									fields: [{
										name: 'STATUS',
										value: `All antinuke utilities has been ${ops}d!\n\n**Antinuke:** ${ops === 'enable' ? process.env.CHECK_TRUE : process.env.CHECK_FALSE}`,
										inline: false,
									}],
									color: 16705372,
									footer: {
										text: `Desired by ${ctx.interaction.user?.username}`,
										icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
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
						await ctx.interaction.editReply({
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