const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'purge',
	description: 'Clears a certain amount of messages in the channel!',
	aliases: ['clear', 'prune'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const amount = ctx.message.content.split(' ').slice(1).shift();

		if (!amount) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must specify a amount!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (isNaN(parseInt(amount))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | The amount must be a number!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});
		if (amount > 1000 || amount < 1) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You can only clear between 1 and 1000 messages!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}
		if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Messages\` permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}
		if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I do not have \`Manage Messages\` permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		await ctx.message.channel?.send({
			content: `Clearing ${amount} messages in <#${ctx.message.channel?.id}>...`,
		}).then(async (msg) => {
			if (amount > 101) {
				let i = 0;
				while (i < amount) {
					const message = await ctx.message.channel?.messages.fetch({
						limit: 100,
						before: msg.id,
					});

					const messages = message.filter((m) => !m.pinned);

					ctx.message.channel?.bulkDelete(messages, true);

					const oldMessages = messages.filter((m) => m.createdTimestamp < Date.now() - 1209600000);

					for (const msge of oldMessages.values()) {
						await msge.delete();
					}

					i += 100;
				}
			}
			else {
				const message = await ctx.message.channel?.messages.fetch({
					limit: amount,
					before: msg.id,
				});

				const messages = message.filter((m) => !m.pinned);

				ctx.message.channel?.bulkDelete(messages, true);

				const oldMessages = messages.filter((m) => m.createdTimestamp < Date.now() - 1209600000);

				for (const message of oldMessages.values()) {
					await message.delete();
				}
			}

			try {
				await msg.edit({
					content: `${process.env.SUCCESS_EMOJI} | Cleared ${amount} messages in <#${ctx.message.channel?.id}>!`,
				}).then((m) => {
					try {
						setTimeout(() => {
							m.delete();
						}, 15000);
					}
					catch {
						return;
					}
				});
			}
			catch {
				await ctx.message.channel?.send({
					content: `${process.env.SUCCESS_EMOJI} | Cleared ${amount} messages in <#${ctx.message.channel?.id}>!`,
				}).then((m) => {
					try {
						setTimeout(() => {
							m.delete();
						}, 15000);
					}
					catch {
						return;
					}
				});
			}
		});
	},
});