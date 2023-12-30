const App = require('../../../../Structures/Core/App');
const { httpRequest } = require('../../../../Structures/Utils/Functions/httpRequest');

module.exports = new App({
	name: 'dictionary',
	description: 'Searches the Urban Dictionary for a term!',
	usage: 'urban <term>',
	aliases: ['urban', 'ud'],
	options: [{
		name: 'term',
		description: 'The term to search for!',
		type: 3,
		required: true,
	}],
	/**
     @param {Rolex} ctx
    */ 

	run: async (ctx) => {
		const term = ctx.interaction.options.getString('term');

		const data = await httpRequest({
			method: 'GET',
			hostname: 'api.urbandictionary.com',
			path: `/v0/define?term=${encodeURIComponent(term)}`,
		}).then((res) => JSON.parse(res));

		if (!data.list.length) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | I couldn't find that term on urban dictionary!`,
				ephemeral: true,
			});
		}

		if (data.list.length > 1) {
			const pages = data.list.map((x, i) => {
				return {
					title: `Definition #${i + 1}`,
					description: x.definition,
					color: 16705372,
					fields: [{
						name: 'Example',
						value: x.example,
					}, {
						name: 'Author',
						value: x.author,
					}, {
						name: 'Rating',
						value: `${x.thumbs_up} 👍🏻 | ${x.thumbs_down} 👎🏻`,
					}],
					footer: {
						text: `Page ${i + 1}/${data.list.length} | Powered by Urban Dictionary`,
					},
				};
			});

			const msg = await ctx.interaction.reply({
				fetchReply: true,
				embeds: [pages[0]],
				components: [{
					type: 1,
					components: [
						{
							type: 2,
							style: 2,
							custom_id: 'start',
							emoji: {
								name: 'previous',
								id: '996000399943274506',
							},
							disabled: true,
						},
						{
							type: 2,
							style: 2,
							custom_id: 'prev',
							emoji: {
								name: 'arrow_backward',
								id: '996005616147513406',
							},
							disabled: true,
						},
						{
							type: 2,
							style: 2,
							custom_id: 'stop',
							emoji: {
								name: 'stop',
								id: '996000402338226196',
							},
						},
						{
							type: 2,
							style: 2,
							custom_id: 'next',
							emoji: {
								name: 'arrow_forward',
								id: '996005619767181323',
							},
						},
						{
							type: 2,
							style: 2,
							custom_id: 'end',
							emoji: {
								name: 'next',
								id: '996000397196005386',
							},
						},
					],
				}],
			});

			let page = 0;
			const collector = msg.createMessageComponentCollector({
				time: 120000,
			});

			collector.on('collect', async (i) => {
				await i.deferUpdate();

				if (i.user.id !== ctx.interaction.user.id) {
					return i.reply({
						content: `${process.env.FAILURE_EMOJI} | You cannot control this pagination!`,
						ephemeral: true,
					});
				}

				switch (i.customId) {
					case 'start':
						page = 0;
						break;
					case 'prev':
						page = --page;
						break;
					case 'stop':
						return collector.stop();
					case 'next':
						page = ++page;
						break;
					case 'end':
						page = pages.length - 1;
						break;
				}

				await msg.edit({
					embeds: [pages[page]],
					components: [{
						type: 1,
						components: msg.components[0].components.map((component, index) => {
							if (page === 0) {
								if (index === 0 || index === 1) {
									component.data.disabled = true;
								}
								else {
									component.data.disabled = false;
								}
							} else if (page === pages.length - 1) {
								if (index === 3 || index === 4) {
									component.data.disabled = true;
								}
								else {
									component.data.disabled = false;
								}
							} else {
								component.data.disabled = false;
							}

							return component.data;
						})
					}]
				});

				collector.resetTimer();
			});

			collector.on('end', async (collected, reason) => {
				await msg.edit({
					components: [{
						type: 1,
						components: msg.components[0].components.map((component) => {
							component.data.disabled = true;
							return component.data;
						})
				    }]
				});
			});
		}
		else {
			const definition = data.list[0];

			return ctx.interaction.reply({
				embeds: [{
					title: 'Definition',
					description: definition.definition,
					color: 16705372,
					fields: [{
						name: 'Example',
						value: definition.example,
					}, {
						name: 'Author',
						value: definition.author,
					}, {
						name: 'Rating',
						value: `${definition.thumbs_up} 👍🏻 | ${definition.thumbs_down} 👎🏻`,
					}],
					footer: {
						text: 'Powered by Urban Dictionary',
					},
				}],
			});
		}
	},
});