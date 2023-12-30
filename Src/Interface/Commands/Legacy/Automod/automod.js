const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'automod',
	description: 'Toggles all automod features.',


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
			}).then(message => { setTimeout(() => { message.delete(); }, 15000); });
		}

		if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I do not have \`Manage Server\` permissions!`,
			}).then(message => { setTimeout(() => { message.delete(); }, 15000); });
		}

		if (!ctx.message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | I do not have \`Moderate Members\` permissions!`,
			}).then(message => { setTimeout(() => { message.delete(); }, 15000); });
		}

		const action = ctx.message.content.split(' ').slice(1).shift()?.toLowerCase();

		if (!action) {
			return ctx.message.reply({ content: `${process.env.FAILURE_EMOJI} | You must specify an action! Available actions: \`Enable\`, \`Disable\`` }).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const rules = await ctx.message.guild.autoModerationRules.fetch();

		if (action === 'enable') {
			if (rules.filter(r => r.triggerType === 3).size === 1) {
				if (rules.filter(r => r.triggerType === 3).map(r => r.enabled)[0] === false) {
					await ctx.message.guild.autoModerationRules.edit(rules.filter(r => r.triggerType === 3).map(r => r.id)[0], {
						name: 'Block Suspected Spam Content',
						eventType: 1,
						triggerType: 3,
						actions: [
							{
								type: 1,
								metadata: {
									custom_message: 'Please do not spam in this server.',
								},
							},
						],
						enabled: true,
					});
				}
			}
			else {
				await ctx.message.guild.autoModerationRules.create({
					name: 'Block Suspected Spam Content',
					eventType: 1,
					triggerType: 3,
					actions: [
						{
							type: 1,
							metadata: {
								custom_message: 'Please do not spam in this server.',
							},
						},
					],
					enabled: true,
				});
			}

			if (rules.filter(r => r.triggerType === 4).size === 1) {
				await ctx.message.guild.autoModerationRules.edit(rules.filter(r => r.triggerType === 4).map(r => r.id)[0], {
					name: 'Block Commonly Flagged Words',
					eventType: 1,
					triggerType: 4,
					actions: [
						{
							type: 1,
							metadata: {
								custom_message: 'Please do not use that word in this server.',
							},
						},
					],
					triggerMetadata: {
						presets: [ 1, 2, 3 ],
					},
					enabled: true,
				});
			}
			else {
				await ctx.message.guild.autoModerationRules.create({
					name: 'Block Commonly Flagged Words',
					eventType: 1,
					triggerType: 4,
					actions: [
						{
							type: 1,
							metadata: {
								custom_message: 'Please do not use that word in this server.',
							},
						},
					],
					triggerMetadata: {
						presets: [ 1, 2, 3 ],
					},
					enabled: true,
				});
			}

			if (rules.filter(r => r.triggerType === 5).size === 1) {
				await ctx.message.guild.autoModerationRules.edit(rules.filter(r => r.triggerType === 5).map(r => r.id)[0], {
					name: 'Block Mention Spam',
					eventType: 1,
					triggerType: 5,
					triggerMetadata: {
						mentionTotalLimit: 10,
					},
					actions: [
						{
							type: 1,
							metadata: {
								custom_message: 'Please do not spam mentions in this server.',
							},
						},
						{
							type: 3,
							metadata: {
								durationSeconds: 300,
							},
						},
					],
					enabled: true,
				});
			}
			else {
				await ctx.message.guild.autoModerationRules.create({
					name: 'Block Mention Spam',
					eventType: 1,
					triggerType: 5,
					triggerMetadata: {
						mentionTotalLimit: 10,
					},
					actions: [
						{
							type: 1,
							metadata: {
								custom_message: 'Please do not spam mentions in this server.',
							},
						},
						{
							type: 3,
							metadata: {
								durationSeconds: 300,
							},
						},
					],
					enabled: true,
				});
			}

			return ctx.message.reply({
				content: `${process.env.SUCCESS_EMOJI} | All automod features have been enabled.`,
			});
		}
		else if (action === 'disable') {
			rules.forEach(async (rule) => {
				await ctx.message.guild.autoModerationRules.delete(rule);
			});

			return ctx.message.reply({
				content: `${process.env.SUCCESS_EMOJI} | All automod features have been disabled.`,
			});
		}
		else {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You must specify a valid action! Available actions: \`Enable\`, \`Disable\``,
			}).then(message => { setTimeout(() => { message.delete(); }, 15000); });
		}
	},
});
