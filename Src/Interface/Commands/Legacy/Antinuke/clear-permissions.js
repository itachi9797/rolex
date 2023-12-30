const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');
const { generateCustomID } = require('../../../../Structures/Utils/Functions/generateCustomID');
const { separateWords } = require('../../../../Structures/Utils/Functions/separateWords');

module.exports = new App({
	name: 'clear-permissions',
	description: 'Remove dangerous permissions from roles',
	aliases: ['cp'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});

		if (ctx.message.author?.id !== ctx.message.guild.ownerId && !(owner_data && owner_data.additional_owners.includes(ctx.message.author?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		let ops = ctx.message.content.split(' ').slice(1).shift()?.toLowerCase();

		if (!ops) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Please provide a option! Available options: \`Administrator\`, \`Ban Members\`, \`Kick Members\``,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (ops === 'administrator' || ops === 'admin') ops = 'Administrator';
		else if (ops === 'ban') ops = 'BanMembers';
		else if (ops === 'kick') ops = 'KickMembers';
		else {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Please provide a valid option! Available options: \`Administrator\`, \`Ban Members\`, \`Kick Members\``,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I don't have the Manage Roles permission!`
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}
		if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags[ops])) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I don't have the ${separateWords(ops)} permission!`
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}
		if (ctx.message.guild.roles.cache.filter((r) => r.permissions.has(PermissionsBitField.Flags[ops]) && r.position < ctx.message.guild.members.me.roles.highest.position).size === 0) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | There are no roles with ${separateWords(ops)} permission in this server!`
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
				description: `**Are you sure you want to remove ${separateWords(ops)} permission from every role in this server?**`,
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
					i.editReply({
						embeds: [{

							description: `**Removing ${separateWords(ops)} permission from every roles.**`,
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

					ctx.message.guild.roles.cache.filter((r) => r.permissions.has(PermissionsBitField.Flags[ops]) && r.position < ctx.message.guild.members.me.roles.highest.position).forEach((role) => {
						role.setPermissions(role.permissions.remove(PermissionsBitField.Flags[ops]));
					});

					try {
						i.editReply({
							embeds: [{

								description: `**Successfully removed ${separateWords(ops)} permission from every role in this guild**`,
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
					} catch {
						return;
					}

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
						components: msg.components[0].components.map((c) => {
							c.data.disabled = true;
							return c.data;
						})
					}],
				});
			}
		});
	},
});