const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'automod-mention',
	description: 'Toggles the mention spam filter on or off',
	usage: 'automod-mention <enable | disable> [action]',
	aliases: ['am-mention'],
	userPermissions: ['Manage Server'],
	options: [{
		name: 'enable',
		description: 'Enables the mention spam filter',
		type: 1,
		options: [{
			name: 'mention-limit',
			description: 'The amount of mentions that will trigger the filter',
			type: 3,
			required: true,
		},
		{
			name: 'action',
			description: 'The action you want to take when the word is detected',
			type: 3,
			required: false,
			choices: [{
				name: 'Block Message',
				value: '1',
			},
			{
				name: 'Timeout User',
				value: '3',
			},
			],
		},
		],
	},
	{
		name: 'disable',
		description: 'Disables the mention spam filter',
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

		const action = ctx.interaction.options.getString('action') || '1';
		ctx.interaction.guild.autoModerationRules.fetch().then(async (rules) => {

			if (isNaN(ctx.interaction.options.getString('mention-limit'))) {
				return ctx.interaction.editReply({
					content: `${process.env.FAILURE_EMOJI} | The mention limit must be a number!`,
				}).then(() => {
					setTimeout(() => {
						ctx.interaction.deleteReply();
					}, 15000);
				});
			}

			if (parseInt(ctx.interaction.options.getString('mention-limit')) < 1 || parseInt(ctx.interaction.options.getString('mention-limit')) > 50) {
				return ctx.interaction.editReply({
					content: `${process.env.FAILURE_EMOJI} | The mention limit must be between 1 and 50!`,
				}).then(() => {
					setTimeout(() => {
						ctx.interaction.deleteReply();
					}, 15000);
				});
			}

			const rule = rules.filter(r => r.triggerType === 5);
			if (action === 'enable') {
				if (rule.size === 1) {
					if (rule.map(r => r.enabled)[0] === true) {
						await ctx.interaction.editReply({
							content: `${process.env.FAILURE_EMOJI} | The mention spam filter is already enabled!`,
						}).then(() => {
							setTimeout(() => {
								ctx.interaction.deleteReply();
							}, 15000);
						});
					}
					else {
						await ctx.interaction.guild.autoModerationRules.edit(rule.map(r => r.id)[0], {
							name: 'Block Mention Spam',
							eventType: 1,
							triggerType: 5,
							triggerMetadata: {
								mentionTotalLimit: parseInt(ctx.interaction.options.getString('mention-limit')),
							},
							actions: [{
								type: parseInt(action),
								metadata: {
									durationSeconds: 300,
								},
							}],
							enabled: true,
						});
						await ctx.interaction.editReply({
							content: `${process.env.SUCCESS_EMOJI} | The mention spam filter has been enabled!`,
						});
					}
				}
				else {
					await ctx.interaction.guild.autoModerationRules.create({
						name: 'Block Mention Spam',
						eventType: 1,
						triggerType: 5,
						triggerMetadata: {
							mentionTotalLimit: parseInt(ctx.interaction.options.getString('mention-limit')),
						},
						actions: [{
							type: parseInt(action),
							metadata: {
								durationSeconds: 300,
							},
						}],
						enabled: true,
					});
					await ctx.interaction.editReply({
						content: `${process.env.SUCCESS_EMOJI} | The mention spam filter has been enabled!`,
					});
				}
			}
			else if (action === 'disable') {
				if (rule.size === 0) {
					await ctx.interaction.editReply({
						content: `${process.env.FAILURE_EMOJI} | The mention spam filter is already disabled!`,
					}).then(() => {
						setTimeout(() => {
							ctx.interaction.deleteReply();
						}, 15000);
					});
				}
				else {
					await ctx.interaction.guild.autoModerationRules.delete(rule.map(r => r.id)[0]);
					await ctx.interaction.editReply({
						content: `${process.env.SUCCESS_EMOJI} | The mention spam filter has been disabled!`,
					});
				}
			}
		});
	},
});