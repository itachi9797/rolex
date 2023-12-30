const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/globalafk');
const Schema2 = require('../../../../Database/Schemas/guildafk');

module.exports = new App({
	name: 'afk',
	description: 'Set your status to afk.',

	/**
     @param {Rolex} ctx
    */

	run: async (ctx) => {

		const afk_reason = ctx.message.content.split(' ').slice(1).join(' ') || 'I am AFK :)';

		const data = await Schema.findOne({
			User: ctx.message.author?.id,
		});
		const data2 = await Schema2.findOne({
			Guild: ctx.message.guild.id,
			User: ctx.message.author?.id,
		});

		const msg = await ctx.message.reply({
			embeds: [{
				author: {
					name: ctx.message.author?.globalName || ctx.message.author?.username,
					icon_url: ctx.message.author?.displayAvatarURL({ size: 2048 }),
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
						return msg.edit({
							content: 'You are already AFK.',
							embeds: [],
							components: [],
						});
					}
					else if (data2) {
						await Schema2.findOneAndDelete({
							Guild: ctx.message.guild.id,
							User: ctx.message.author?.id,
						});

						const newafk = new Schema({
							User: ctx.message.author?.id,
							reason: afk_reason,
							timestamp: Math.floor(Date.now() / 1000),
						});
						newafk.save();
						return msg.edit({
							content: `You are now AFK globally for the reason: ${afk_reason}`,
							embeds: [],
							components: [],
						});

					}
					else {
						const newafk = new Schema({
							User: ctx.message.author?.id,
							reason: afk_reason,
							timestamp: Math.floor(Date.now() / 1000),
						});
						newafk.save();
						return msg.edit({
							content: `You are now AFK globally for the reason: ${afk_reason}`,
							embeds: [],
							components: [],
						});
					}
				case 'server':
					await i.deferUpdate();
					if (data) {
						return msg.edit({
							content: 'You are already AFK.',
							embeds: [],
							components: [],
						});
					}
					else if (data2) {
						return msg.edit({
							content: 'You are already AFK in this server.',
							embeds: [],
							components: [],
						});
					}
					else {
						const newafk = new Schema2({
							Guild: ctx.message.guild.id,
							User: ctx.message.author?.id,
							reason: afk_reason,
							timestamp: Math.floor(Date.now() / 1000),
						});
						newafk.save();
						return msg.edit({
							content: `You are now AFK in this server for the reason: ${afk_reason}`,
							embeds: [],
							components: [],
						});
					}
			}

			collector.on('end', async (collected, reason) => {
				if (reason === 'time') {
					return msg.edit({
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