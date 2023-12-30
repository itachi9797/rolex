const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'automod-preset',
	description: 'Blocks messages containing a word from the automod list set by default',
	aliases: ['am-preset'],

	/**
     * @param {Rolex} ctx
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

			const rule = rules.filter(r => r.triggerType === 4);
			if (action === 'enable') {

				const presets = ctx.message.content.trim().split(' ').slice(2).join(' ').toLowerCase();

				if (!presets) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You must specify a preset! Available presets: \`Profanity\`, \`Sexual Content\`, \`Hate Speech\`.`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				let preset_int;
				if ((presets === 'profanity') || (presets === '1')) {
					preset_int = 1;
				}
				else if ((presets === 'sexual content') || (presets === '2')) {
					preset_int = 2;
				}
				else if ((presets === 'hate speech') || (presets === '3')) {
					preset_int = 3;
				}
				else {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You must specify a valid preset! Available presets: \`Profanity\`, \`Sexual Content\`, \`Hate Speech\`.`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}

				if (rule.size === 1) {
					if (rule.map(r => r.enabled)[0] === true && rule.map(r => r.triggerMetadata.presets)[0].includes(preset_int)) {
						await ctx.message.reply({
							content: `${process.env.FAILURE_EMOJI} | The keyword preset filter is already enabled!`,
						}).then(message => {
							setTimeout(() => {
								message.delete();
							}, 15000);
						});
					}
					else {
						await ctx.message.guild.autoModerationRules.edit(rule.map(r => r.id)[0], {
							name: 'Block Commonly Flagged Words',
							eventType: 1,
							triggerType: 4,
							actions: [{
								type: 1,
							}],
							triggerMetadata: {
								presets: rule.map(r => r.triggerMetadata.presets)[0].includes(preset_int) ? rule.map(r => r.triggerMetadata.presets)[0] : rule.map(r => r.triggerMetadata.presets)[0].concat(preset_int),
							},
							enabled: true,
						});
						await ctx.message.reply({
							content: `${process.env.SUCCESS_EMOJI} | The keyword preset filter has been enabled!`,
						});
					}
				}
				else {
					await ctx.message.guild.autoModerationRules.create({
						name: 'Block Commonly Flagged Words',
						eventType: 1,
						triggerType: 4,
						actions: [{
							type: 1,
						}],
						triggerMetadata: {
							presets: rule.map(r => r.triggerMetadata.presets)[0] ? rule.map(r => r.triggerMetadata.presets)[0].concat(preset_int) : [preset_int],
						},
						enabled: true,
					});
					await ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | The keyword preset filter has been enabled!`,
					});
				}
			}
			else if (action === 'disable') {
				if (rule.size === 0) {
					await ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | The keyword preset filter is already disabled!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
				}
				else {
					await ctx.message.guild.autoModerationRules.delete(rule.map(r => r.id)[0]);
					await ctx.message.reply({
						content: `${process.env.SUCCESS_EMOJI} | The keyword preset filter has been disabled!`,
					});
				}
			}
			else {
				return ctx.message.reply({
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