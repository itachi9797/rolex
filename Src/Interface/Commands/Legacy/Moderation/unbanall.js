const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');

module.exports = new App({
	name: 'unbanall',
	description: 'Unbans all users from the server',

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});

		if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.BanMembers) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Ban Members\` permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (ctx.message.member?.id !== ctx.message.guild.ownerId && ctx.message.member?.roles.highest.position <= ctx.message.guild.members.me.roles.highest.position && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must be above me to use this command.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I do not have \`Ban Members\` permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const yes = generateCustomID();
		const no = generateCustomID();

		const msg = await ctx.message.reply({
			embeds: [{

				description: '**Are you sure you want to unban everyone in this guild?**',
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
					const bans = (await i.guild.bans.fetch());
				
					i.editReply({
						embeds: [{

							description: `**Unbanning ${bans.size} users**`,
							color: 16705372,
						}],
						components: [{
							type: 1,
							components: msg.components[0].components.map((c) => {
								c.data.disabled = true;
								return c.data;
							})
						}],
					});

					await bans.forEach(e => i.guild.bans.remove(e.user?.id, `Unbanall Command executed by- (${ctx.message.author?.id})`));

					i.editReply({
						embeds: [{
							description: `**Successfully unbanned ${bans.size} users from this guild**`,
							color: 16705372,
						}],
					});
					break;
				case no:
					return collector.stop();
			}
		});

		collector.on('end', async (collected, reason) => {
			await msg.edit({
				embeds: [{

					description: '**Action Cancelled**',
					color: 16705372,
				}],
				components: [{
					type: 1,
					components: msg.components[0].components.map((c) => {
						c.data.disabled = true;
						return c.data;
					})
				}],
			});
		});
	},
});