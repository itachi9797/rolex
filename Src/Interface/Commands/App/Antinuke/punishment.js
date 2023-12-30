const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/antinuke');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'punishment',
	description: 'Set up a punishment for the antinuke system!',
	usage: 'punishment <ban | kick>',
	userPermissions: ['Server Owner'],
	aliases: ['punish'],
	options: [{
		name: 'choices',
		type: 3,
		required: true,
		description: 'The valid choices you can use!',
		choices: [{
			name: 'BAN',
			value: 'ban',
		},
		{
			name: 'KICK',
			value: 'kick',
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

		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {
			if (!data) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | Antinuke is disabled for this server!`,
					ephemeral: true,
				});
			}
			const choice = ctx.interaction.options.getString('choices');
			switch (choice) {
				case 'ban':
					if (data.punishment === 'Ban') {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | The current punishment is already set to **Ban**`,
							ephemeral: true,
						});
					}
					data.punishment = 'Ban';
					await data.save();
					ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Punishment was set to **Ban** successfully!`,
					});
					break;
				case 'kick':
					if (data.punishment === 'Kick') {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | The current punishment is already set to **Kick**`,
							ephemeral: true,
						});
					}
					data.punishment = 'Kick';
					await data.save();
					ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Punishment was set to **Kick** successfully!`,
					});
					break;
			}
		});
	},
});