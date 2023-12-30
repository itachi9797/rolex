const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'automod-spam',
	description: 'Toggles the spam filter on or off',
	usage: 'automod-spam <enable | disable>',
	aliases: ['am-spam'],
	userPermissions: ['Manage Server'],
	options: [{
		name: 'enable',
		description: 'Enables the spam filter',
		type: 1,
	},
	{
		name: 'disable',
		description: 'Disables the spam filter',
		type: 1,
	},
	],


	/**
     @param {Rolex} ctx
    */
	run: async (ctx) => {
		const action = ctx.interaction.options.getSubcommand();

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

		await ctx.interaction.deferReply();
		ctx.interaction.guild.autoModerationRules.fetch().then(async (rules) => {

			const rule = rules.filter(r => r.triggerType === 3);
			if (action === 'enable') {
				if (rule.size === 1) {
					if (rule.map(r => r.enabled)[0] === true) {
						await ctx.interaction.editReply({
							content: `${process.env.FAILURE_EMOJI} | The spam filter is already enabled!`,
						}).then(() => {
							setTimeout(() => {
								ctx.interaction.deleteReply();
							}, 15000);
						});
					}
					else {
						await ctx.interaction.guild.autoModerationRules.edit(rule.map(r => r.id)[0], {
							name: 'Block Suspected Spam Content',
							eventType: 1,
							triggerType: 3,
							actions: [{
								type: 1,
							}],
							enabled: true,
						});
						await ctx.interaction.editReply({
							content: `${process.env.SUCCESS_EMOJI} | The spam filter has been enabled!`,
						});
					}
				}
				else {
					await ctx.interaction.guild.autoModerationRules.create({
						name: 'Block Suspected Spam Content',
						eventType: 1,
						triggerType: 3,
						actions: [{
							type: 1,
						}],
						enabled: true,
					});
					await ctx.interaction.editReply({
						content: `${process.env.SUCCESS_EMOJI} | The spam filter has been enabled!`,
					});
				}
			}
			else if (action === 'disable') {
				if (rule.size === 0) {
					await ctx.interaction.editReply({
						content: `${process.env.FAILURE_EMOJI} | The spam filter is already disabled!`,
					}).then(() => {
						setTimeout(() => {
							ctx.interaction.deleteReply();
						}, 15000);
					});
				}
				else {
					await ctx.interaction.guild.autoModerationRules.delete(rule.map(r => r.id)[0]);
					await ctx.interaction.editReply({
						content: `${process.env.SUCCESS_EMOJI} | The spam filter has been disabled!`,
					});
				}
			}
		});
	},
});