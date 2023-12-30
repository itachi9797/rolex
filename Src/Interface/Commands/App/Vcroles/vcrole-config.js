const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Schema = require('../../../../Database/Schemas/vc-role');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'vcrole-config',
	description: 'Shows the configuration for the VC roles.',
	usage: 'vcrole-config',
	userPermissions: ['Manage Server'],


	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.interaction.guild.id,
		});
		if (!ctx.interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Server\` permissions!`,
				ephemeral: true,
			});
		}
		if (ctx.interaction.member?.id !== ctx.interaction.guild.ownerId && ctx.interaction.member?.roles.highest.position <= ctx.interaction.guild.members.me.roles.highest.position && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | You must be above me to use this command.`,
				ephemeral: true,
			});
		}
		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {
			if (!data) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no configuration for VC roles in this server!`,
					ephemeral: true,
				});
			}

			let description, description2;
			let flag = false,
				flag2 = false;

			if (data.humanrole.length > 0) {
				description = data.humanrole
					.map((r) => r)
					.map((r, i) => `\`[${i + 1}]\` | <@&${r}> | \`[${r}]\``)
					.join('\n');
				flag = true;
			}

			if (data.botrole.length > 0) {
				description2 = data.botrole
					.map((r) => r)
					.map((r, i) => `\`[${i + 1}]\` | <@&${r}> | \`[${r}]\``)
					.join('\n');
				flag2 = true;
			}

			if (flag && flag2) {
				await ctx.interaction.reply({
					embeds: [{
						title: 'VC Role Configuration',
						fields: [{
							name: 'Human Roles',
							value: description,
						},
						{
							name: 'Bot Roles',
							value: description2,
						},
						],
						color: 16705372,
					}],
				});
			}
			else if (flag && !flag2) {
				await ctx.interaction.reply({
					embeds: [{
						title: 'VC Role Configuration',
						fields: [{
							name: 'Human Roles',
							value: description,
						}],
						color: 16705372,
					}],
				});
			}
			else if (!flag && flag2) {
				await ctx.interaction.reply({
					embeds: [{
						title: 'VC Role Configuration',
						fields: [{
							name: 'Bot Roles',
							value: description2,
						}],
						color: 16705372,
					}],
				});
			}
		});
	},
});