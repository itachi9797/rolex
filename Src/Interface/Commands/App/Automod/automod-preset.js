const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'automod-preset',
	description: 'Blocks messages containing a word from the automod list set by default',
	usage: 'automod-preset <enable | disable> <Profanity | Sexual Content | Hate Speech>',
	aliases: ['am-preset'],
	userPermissions: ['Manage Server'],
	options: [{
		name: 'enable',
		description: 'Enables the keyword preset filter',
		type: 1,
		options: [{
			name: 'presets',
			description: 'The presets you want to use',
			type: 3,
			required: true,
			choices: [{
				name: 'Profanity',
				value: '1',
			},
			{
				name: 'Sexual Content',
				value: '2',
			},
			{
				name: 'Hate Speech',
				value: '3',
			},
			],

		}],
	},
	{
		name: 'disable',
		description: 'Disables the keyword preset filter',
		type: 1,
	},
	],


	/**
     @param {Rolex} ctx
    */
	run: async (ctx) => {
		await ctx.interaction.deferReply();

		const owner_data = await Owners.findOne({
			Guild: ctx.interaction.guild.id,
		});

		if (!ctx.interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.editReply({
				content: `${process.env.FAILURE_EMOJI} | You must have \`Manage Server\` permissions to use this command.`,
			}).then(() => {
				setTimeout(() => {
					ctx.interaction.deleteReply();
				}, 15000);
			});
		}

		if (!ctx.interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
			return ctx.interaction.editReply({
				content: `${process.env.FAILURE_EMOJI} | I do not have \`Manage Server\` permissions!`,
			}).then(() => {
				setTimeout(() => {
					ctx.interaction.deleteReply();
				}, 15000);
			});
		}

		if (!ctx.interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | I do not have \`Moderate Members\` permissions!`,
			}).then(() => {
				setTimeout(() => {
					ctx.interaction.deleteReply();
				}, 15000);
			});
		}

		const action = ctx.interaction.options.getSubcommand();
		ctx.interaction.guild.autoModerationRules.fetch().then(async (rules) => {

			const rule = rules.filter(r => r.triggerType === 4);
			if (action === 'enable') {
				if (rule.size === 1) {
					if (rule.map(r => r.enabled)[0] === true && rule.map(r => r.triggerMetadata.presets)[0].includes(parseInt(ctx.interaction.options.getString('presets')))) {
						await ctx.interaction.editReply({
							content: `${process.env.FAILURE_EMOJI} | The keyword preset filter is already enabled!`,
						}).then(() => {
							setTimeout(() => {
								ctx.interaction.deleteReply();
							}, 15000);
						});
					}
					else {
						await ctx.interaction.guild.autoModerationRules.edit(rule.map(r => r.id)[0], {
							name: 'Block Commonly Flagged Words',
							eventType: 1,
							triggerType: 4,
							actions: [{
								type: 1,
							}],
							triggerMetadata: {
								presets: rule.map(r => r.triggerMetadata.presets)[0].includes(parseInt(ctx.interaction.options.getString('presets'))) ? rule.map(r => r.triggerMetadata.presets)[0] : rule.map(r => r.triggerMetadata.presets)[0].concat(parseInt(ctx.interaction.options.getString('presets'))),
							},
							enabled: true,
						});
						await ctx.interaction.editReply({
							content: `${process.env.SUCCESS_EMOJI} | The keyword preset filter has been enabled!`,
						});
					}
				}
				else {
					await ctx.interaction.guild.autoModerationRules.create({
						name: 'Block Commonly Flagged Words',
						eventType: 1,
						triggerType: 4,
						actions: [{
							type: 1,
						}],
						triggerMetadata: {
							presets: rule.map(r => r.triggerMetadata.presets)[0] ? rule.map(r => r.triggerMetadata.presets)[0].concat(parseInt(ctx.interaction.options.getString('presets'))) : [parseInt(ctx.interaction.options.getString('presets'))],
						},
						enabled: true,
					});
					await ctx.interaction.editReply({
						content: `${process.env.SUCCESS_EMOJI} | The keyword preset filter has been enabled!`,
					});
				}
			}
			else if (action === 'disable') {
				if (rule.size === 0) {
					await ctx.interaction.editReply({
						content: `${process.env.FAILURE_EMOJI} | The keyword preset filter is already disabled!`,
					}).then(() => {
						setTimeout(() => {
							ctx.interaction.deleteReply();
						}, 15000);
					});
				}
				else {
					await ctx.interaction.guild.autoModerationRules.delete(rule.map(r => r.id)[0]);
					await ctx.interaction.editReply({
						content: `${process.env.SUCCESS_EMOJI} | The keyword preset filter has been disabled!`,
					});
				}
			}
		});
	},
});