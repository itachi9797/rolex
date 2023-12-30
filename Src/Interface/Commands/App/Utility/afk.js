const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/globalafk');
const Schema2 = require('../../../../Database/Schemas/guildafk');

module.exports = new App({
	name: 'afk',
	description: 'Set your status to afk.',
	usage: 'afk [reason]',
	options: [{
		name: 'reason',
		description: 'The reason for being afk',
		required: false,
		type: 3,
	}],
	/**
     @param {Rolex} ctx
    */

	run: async (ctx) => {
		const afk_reason = ctx.interaction.options.getString('reason') || 'I am AFK :)';

		const data = await Schema.findOne({
			User: ctx.interaction.user?.id,
		});
		const data2 = await Schema2.findOne({
			Guild: ctx.interaction.guild.id,
			User: ctx.interaction.user?.id,
		});

		const msg = await ctx.interaction.reply({
			embeds: [{
				author: {
					name: ctx.interaction.user?.username,
					icon_url: ctx.interaction.user?.displayAvatarURL({ size: 2048 }),
				},
				description: 'Please choose a type of AFK.',
				color: 16705372,
			}],
			components: [{
				type: 1,
				components: [{
					type: 2,
					style: 3,
					label: 'Global AFK',
					custom_id: 'global',
				},
				{
					type: 2,
					style: 3,
					label: 'Server AFK',
					custom_id: 'server',
				},
				],
			}],
		});

		const collector = msg.createMessageComponentCollector({
			time: 60000,
		});

		collector.on('collect', async (i) => {
			switch (i.customId) {
				case 'global':
					await i.deferUpdate();
					if (data) {
						return ctx.interaction.editReply({
							content: 'You are already AFK.',
							embeds: [],
							components: [],
						});
					}
					else if (data2) {
						await Schema2.findOneAndDelete({
							Guild: ctx.interaction.guild.id,
							User: ctx.interaction.user?.id,
						});

						const newafk = new Schema({
							User: ctx.interaction.user?.id,
							reason: afk_reason,
							timestamp: Math.floor(Date.now() / 1000),
						});
						newafk.save();
						return ctx.interaction.editReply({
							content: `You are now AFK globally for the reason: ${afk_reason}`,
							embeds: [],
							components: [],
						});

					}
					else {
						const newafk = new Schema({
							User: ctx.interaction.user?.id,
							reason: afk_reason,
							timestamp: Math.floor(Date.now() / 1000),
						});
						newafk.save();
						return ctx.interaction.editReply({
							content: `You are now AFK globally for the reason: ${afk_reason}`,
							embeds: [],
							components: [],
						});
					}
				case 'server':
					await i.deferUpdate();
					if (data) {
						return ctx.interaction.editReply({
							content: 'You are already AFK.',
							embeds: [],
							components: [],
						});
					}
					else if (data2) {
						return ctx.interaction.editReply({
							content: 'You are already AFK in this server.',
							embeds: [],
							components: [],
						});
					}
					else {
						const newafk = new Schema2({
							Guild: ctx.interaction.guild.id,
							User: ctx.interaction.user?.id,
							reason: afk_reason,
							timestamp: Math.floor(Date.now() / 1000),
						});
						newafk.save();
						return ctx.interaction.editReply({
							content: `You are now AFK in this server for the reason: ${afk_reason}`,
							embeds: [],
							components: [],
						});
					}
			}

			collector.on('end', async (collected, reason) => {
				if (reason === 'time') {
					return ctx.interaction.editReply({
						components: [{
							type: 1,
							components: [{
								type: 2,
								style: 3,
								label: 'Global',
								custom_id: 'global',
								disabled: true,
							},
							{
								type: 2,
								style: 3,
								label: 'Server',
								custom_id: 'server',
								disabled: true,
							},
							],
						}],
					});
				}
			});
		});
	},
});