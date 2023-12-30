const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/guildprefix');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'prefix',
	description: 'Set your custom prefix for the server.',
	aliases: ['setprefix'],
	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});
		if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Server\` permissions!`
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		const data = await Schema.findOne({
			Guild: ctx.message.guild.id,
		});

		const prefix = ctx.message.content.split(' ').slice(1).join(' ');

		if (!prefix) {
			return ctx.message.reply({
				content: `The current prefix is set to \`${data ? data.prefix : process.env.PREFIX}\``,
			});
		}

		if (prefix.indexOf(' ') >= 0) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Prefix cannot have spaces!`,
			});
		}

		if (prefix.length > 5) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Prefix cannot be more than 5 characters!`,
			});
		}

		if (prefix === process.env.PREFIX) {
			if (data) {
				await Schema.findOneAndDelete({
					Guild: ctx.message.guild.id,
				});
			}
			return ctx.message.reply({
				content: `${process.env.SUCCESS_EMOJI} | Prefix has been reset to \`${process.env.PREFIX}\``,
			});
		}

		if (data) {
			await Schema.findOneAndDelete({
				Guild: ctx.message.guild.id,
			});
			await Schema.create({
				Guild: ctx.message.guild.id,
				prefix: prefix,
			});
			return ctx.message.reply({
				content: `${process.env.SUCCESS_EMOJI} | Prefix has been set to \`${prefix}\``,
			});
		}
		else {
			await Schema.create({
				Guild: ctx.message.guild.id,
				prefix: prefix,
			});
			return ctx.message.reply({
				content: `${process.env.SUCCESS_EMOJI} | Prefix has been set to \`${prefix}\``,
			});
		}
	},
});