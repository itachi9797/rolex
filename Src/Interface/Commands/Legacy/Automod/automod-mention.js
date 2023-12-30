const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'automod-mention',
	description: 'Toggles the mention spam filter on or off',
	aliases: ['am-mention'],

	/**
     @param {Rolex} ctx
    */
	run: async (ctx) => {
		await ctx.message.channel?.sendTyping();

		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});

		if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must have \`Manage Server\` permissions to use this command.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I do not have \`Manage Server\` permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I do not have \`Moderate Members\` permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const action = ctx.message.content.split(' ').slice(1).shift()?.toLowerCase();

		if (!action) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must specify an option! Available options: \`enable\`, \`disable\`.`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		ctx.message.guild.autoModerationRules.fetch().then(async (rules) => {

			const mention_limit = ctx.message.content.split(' ').slice(2).shift()?.toLowerCase();

			if (!mention_limit && action === 'enable') {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You must specify a mention limit!`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			if (action === 'enable' && isNaN(parseInt(mention_limit))) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | The mention limit must be a number!`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			if (parseInt(mention_limit) < 1 || parseInt(mention_limit) > 50) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | The mention limit must be between 1 and 50!`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}


			let punishment = ctx.message.content.split(' ').slice(3).shift()?.toLowerCase() || 'block message';

			if (action === 'enable' && !['block message', 'timeout user'].includes(punishment)) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You must specify a valid punishment! Available punishments: \`Block Message\`, \`Timeout User\`.`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			punishment === 'block message' ? punishment = 1 : punishment = 3;


			const rule = rules.filter(r => r.triggerType === 5);
			if (action === 'enable') {
				if (rule.size === 1) {
					if (rule.map(r => r.enabled)[0] === true) {
						await ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | The mention spam filter is already enabled!`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					else {
						await ctx.message.guild.autoModerationRules.edit(rule.map(r => r.id)[0], {
							name: 'Block Mention Spam',
							eventType: 1,
							triggerType: 5,
							triggerMetadata: {
								mentionTotalLimit: parseInt(mention_limit),
							},
							actions: [{
								type: parseInt(punishment),
								metadata: {
									durationSeconds: 300,
								},
							}],
							enabled: true,
						});
						await ctx.message.reply({
							content: `${process.env.SUCCESS_EMOJI} | The mention spam filter has been enabled!`,
						});
					}
				}
				else {
					await ctx.message.guild.autoModerationRules.create({
						name: 'Block Mention Spam',
						eventType: 1,
						triggerType: 5,
						triggerMetadata: {
							mentionTotalLimit: parseInt(mention_limit),
						},
						actions: [{
							type: parseInt(punishment),
							metadata: {
								durationSeconds: 300,
							},
						}],
						enabled: true,
					});
					await ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | The mention spam filter has been enabled!`,
					});
				}
			}
			else if (action === 'disable') {
				if (rule.size === 0) {
					await ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | The mention spam filter is already disabled!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
				else {
					await ctx.message.guild.autoModerationRules.delete(rule.map(r => r.id)[0]);
					await ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | The mention spam filter has been disabled!`,
					});
				}
			}
			else {
				await ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You must specify an option! Available options: \`enable\`, \`disable\`.`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		});
	},
});