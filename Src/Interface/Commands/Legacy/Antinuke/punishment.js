const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/antinuke');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'punishment',
	description: 'Set up a punishment for the antinuke system!',
	aliases: ['punish'],

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

		await Schema.findOne({
			Guild: ctx.message.guild.id,
		}).then(async (data) => {

			if (!data) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | Antinuke is disabled for this server!`,

				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			const choice = ctx.message.content.split(' ').slice(1).shift();

			if (!choice) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | Please provide a option! Available options: \`Ban\`, \`Kick\``,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			switch (choice.toLowerCase()) {
				case 'ban':
					if (data.punishment === 'Ban') {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | The current punishment is already set to **Ban**`,

						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					data.punishment = 'Ban';
					await data.save();
					ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | Punishment was set to **Ban** successfully!`,
					});
					break;
				case 'kick':
					if (data.punishment === 'Kick') {
						return ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | The current punishment is already set to **Kick**`,

						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					data.punishment = 'Kick';
					await data.save();
					ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | Punishment was set to **Kick** successfully!`,
					});
					break;
				default:
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | Please provide a valid option! Available options: \`Ban\`, \`Kick\``,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
			}
		});
	},
});