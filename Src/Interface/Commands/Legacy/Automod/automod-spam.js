const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'automod-spam',
	description: 'Toggles the spam filter on or off',
	aliases: ['am-spam'],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
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

		await ctx.message.channel?.sendTyping();

		const action = ctx.message.content.split(' ').slice(1).shift()?.toLowerCase();

		if (!action) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must specify an action! Available actions: \`enable\`, \`disable\``,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		ctx.message.guild.autoModerationRules.fetch().then(async (rules) => {

			const rule = rules.filter(r => r.triggerType === 3);
			if (action === 'enable') {
				if (rule.size === 1) {
					if (rule.map(r => r.enabled)[0] === true) {
						await ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | The spam filter is already enabled!`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					else {
						await ctx.message.guild.autoModerationRules.edit(rule.map(r => r.id)[0], {
							name: 'Block Suspected Spam Content',
							eventType: 1,
							triggerType: 3,
							actions: [{
								type: 1,
							}],
							enabled: true,
						});
						await ctx.message.reply({
							content: `${process.env.SUCCESS_EMOJI} | The spam filter has been enabled!`,
						});
					}
				}
				else {
					await ctx.message.guild.autoModerationRules.create({
						name: 'Block Suspected Spam Content',
						eventType: 1,
						triggerType: 3,
						actions: [{
							type: 1,
						}],
						enabled: true,
					});
					await ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | The spam filter has been enabled!`,
					});
				}
			}
			else if (action === 'disable') {
				if (rule.size === 0) {
					await ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | The spam filter is already disabled!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
				else {
					await ctx.message.guild.autoModerationRules.delete(rule.map(r => r.id)[0]);
					await ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | The spam filter has been disabled!`,
					});
				}
			}
			else {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You must specify an action! Available actions: \`enable\`, \`disable\``,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		});
	},
});