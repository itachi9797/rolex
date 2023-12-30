const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'purge',
	description: 'Clears a certain amount of messages in the channel!',
	usage: 'purge <amount>',
	aliases: ['clear', 'prune'],
	userPermissions: ['Manage Messages'],
	options: [{
		name: 'amount',
		description: 'The amount of messages to clear',
		required: true,
		type: 10,
	}],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const amount = ctx.interaction.options.getNumber('amount');

		const owner_data = await Owners.findOne({
			Guild: ctx.interaction.guild.id,
		});
		if (amount > 1000 || amount < 1) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You can only clear between 1 and 1000 messages!`,
				ephemeral: true,
			});
		}
		if (!ctx.interaction.member?.permissions.has(PermissionsBitField.Flags.ManageMessages) && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Messages\` permissions!`,
				ephemeral: true,
			});
		}
		if (!ctx.interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | I do not have \`Manage Messages\` permissions!`,
				ephemeral: true,
			});
		}

		await ctx.interaction.reply({
			content: `Clearing ${amount} messages in <#${ctx.interaction.channel?.id}>...`,
		});

		if (amount > 101) {
			let i = 0;
			while (i < amount) {
				const message = await ctx.interaction.channel?.messages.fetch({
					limit: 100,
					before: ctx.interaction.id,
				});

				const messages = message.filter((m) => !m.pinned);

				ctx.interaction.channel?.bulkDelete(messages, true);

				const oldMessages = messages.filter((m) => m.createdTimestamp < Date.now() - 1209600000);

				for (const msg of oldMessages.values()) {
					await msg.delete();
				}

				i += 100;
			}
		}
		else {
			const message = await ctx.interaction.channel?.messages.fetch({
				limit: amount,
				before: ctx.interaction.id,
			});

			const messages = message.filter((m) => !m.pinned);

			ctx.interaction.channel?.bulkDelete(messages, true);

			const oldMessages = messages.filter((m) => m.createdTimestamp < Date.now() - 1209600000);

			for (const msg of oldMessages.values()) {
				await msg.delete();
			}
		}

		try {
			await ctx.interaction.editReply({
				content: `${process.env.SUCCESS_EMOJI} | Cleared ${amount} messages in <#${ctx.interaction.channel?.id}>!`,
			}).then((m) => {
				setTimeout(() => {
					m.delete();
				}, 15000);
			});
		}
		catch (e) {
			await ctx.interaction.channel?.send({
				content: `${process.env.SUCCESS_EMOJI} | Cleared ${amount} messages in <#${ctx.interaction.channel?.id}>!`,
			}).then((m) => {
				setTimeout(() => {
					m.delete();
				}, 15000);
			});
		}
	},
});