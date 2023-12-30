const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/guildprefix');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'prefix',
	description: 'Set your custom prefix for the server.',
	usage: 'prefix [prefix]',
	userPermissions: 'Manage Server',
	aliases: ['setprefix'],
	options: [{
		name: 'prefix',
		description: 'The prefix you want to set',
		required: false,
		type: 3,
	}],
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

		const prefix = ctx.interaction.options.getString('prefix');
		const data = await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		});

		if (!prefix) {
			return ctx.interaction.reply({
				content: `The current prefix is set to \`${data ? data.prefix : process.env.PREFIX}\``,
			});
		}

		if (prefix.indexOf(' ') >= 0) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | Prefix cannot have spaces!`,
			});
		}

		if (prefix.length > 5) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | Prefix cannot be more than 5 characters!`,
			});
		}

		if (prefix === process.env.PREFIX) {
			if (data) {
				await Schema.findOneAndDelete({
					Guild: ctx.interaction.guild.id,
				});
			}
			return ctx.interaction.reply({
				content: `${process.env.SUCCESS_EMOJI} | Prefix has been reset to \`${process.env.PREFIX}\``,
			});
		}

		if (data) {
			await Schema.findOneAndDelete({
				Guild: ctx.interaction.guild.id,
			});
			await Schema.create({
				Guild: ctx.interaction.guild.id,
				prefix: prefix,
			});
			return ctx.interaction.reply({
				content: `${process.env.SUCCESS_EMOJI} | Prefix has been set to \`${prefix}\``,
			});
		}
		else {
			await Schema.create({
				Guild: ctx.interaction.guild.id,
				prefix: prefix,
			});
			return ctx.interaction.reply({
				content: `${process.env.SUCCESS_EMOJI} | Prefix has been set to \`${prefix}\``,
			});
		}
	},
});