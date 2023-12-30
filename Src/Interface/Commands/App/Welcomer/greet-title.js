const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/welcomer');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'greet-title',
	description: 'Setups welcome title.',
	usage: 'greet-title',
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

		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {

			if (data) {
				if (!data.channel) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | You haven't set a channel for the welcomer, please set a channel first.`,
					});
				}
				if (data.embed === false) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | You haven't set the welcomer to embed, please set it to embed first.`,
					});
				}
				ctx.interaction.reply({
					embeds: [{
						title: 'Welcome Message Setup',
						description: 'Here are some keywords, which you can use in your welcome message.\nSend your message in this channel?.\nIf you want to cancel the setup simply type `cancel`.\n\n```xml\n<<user?.username>> = Username of new member\n<<user?.displayname>> = The display name of the new member\n<<server.name>> = Name of the server```',
						color: 16705372,
					}],
				});

				const message = await ctx.interaction.channel?.awaitMessages({
					filter: (m) => m.author?.id === ctx.interaction.user?.id && m.content.length > 0,
					max: 1,
					time: 60000,
					errors: ['time'],
				}).catch(() => {
					ctx.interaction.channel?.send({
						embeds: [{
							description: 'You took too long to respond.  Run the command again to set it up.',
							color: 16705372,
						}],
					});
				});

				if (!message) return;

				if (message.first().content.toLowerCase() === 'cancel') {
					ctx.interaction.channel?.send({
						content: 'Cancelled the setup. Run the command again to set it up.',
					});
					return;
				}

				if (message.first().content.toLowerCase() === 'remove') {
					ctx.interaction.channel?.send({
						content: `${process.env.SUCCESS_EMOJI} | Sucessfully removed the title.`,
					});
					data.title = null;
					await data.save();
					return;
				}

				const member = ctx.interaction.member;

				let data_message = message.first().content;

				if (message.first().content) {
					data_message = message.first().content.replace(/<<server.name>>/g, member?.guild.name).replace(/<<user?.username>>/g, member?.user?.username).replace(/<<user?.displayname>>/g, member?.user?.globalName || member?.user?.username);
				}

				if (data_message.length > 150) {
					return ctx.interaction.channel?.send({
						content: `${process.env.FAILURE_EMOJI} | The title cannot be more than 150 characters.`,
					});
				}

				data.title = message.first().content;
				await data.save();
				ctx.interaction.channel?.send({
					content: `${process.env.SUCCESS_EMOJI} | Sucessfully set the title.`,
				});

			}
			else {
				ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | There is no welcomer setup in this server!`,
					ephemeral: true,
				});
			}
		});
	},
});