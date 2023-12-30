const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/welcomer');
const Owners = require('../../../../Database/Schemas/owners');
const { PermissionsBitField } = require('discord.js');

module.exports = new App({
	name: 'greet-message',
	description: 'Setups welcome message.',
	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});
		if (!ctx.message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !(owner_data && owner_data.additional_owners.includes(ctx.message.member?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | You do not have \`Manage Server\` permissions!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		await Schema.findOne({
			Guild: ctx.message.guild.id,
		}).then(async (data) => {

			if (data) {
				if (!data.channel) {
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | You haven't set a channel for the welcomer, please set a channel first.`,
					});
				}
				ctx.message.reply({
					embeds: [{
						title: 'Welcome Message Setup',
						description: 'Here are some keywords, which you can use in your welcome message.\nSend your message in this channel?.\nIf you want to cancel the setup simply type `cancel`.\n\n```xml\n<<user?.mention>> = To mention the new member\n<<user?.username>> = Username of new member\n<<user?.displayname>> = The display name of the new member\n<<user?.id>> = User id of the new member\n<<server.name>> = Name of the server\n<<server.membercount>> = Total members of the server\n<<user?.joined_at>> = Member\'s server joining time\n<<user?.created_at>> = Member\'s account creation date```',
						color: 16705372,
					}],
				});

				const message = await ctx.message.channel?.awaitMessages({
					filter: (m) => m.author?.id === ctx.message.author?.id && m.content.length > 0,
					max: 1,
					time: 120000,
					errors: ['time'],
				}).catch(() => {
					ctx.message.channel?.send({
						embeds: [{
							description: 'You took too long to respond.  Run the command again to set it up.',
							color: 16705372,
						}],
					});
				});

				if (!message) return;

				if (message.first().content.toLowerCase() === 'cancel') {
					ctx.message.channel?.send({
						content: 'Cancelled the setup. Run the command again to set it up.',
					});
					return;
				}

				if (message.first().content.toLowerCase() === 'remove') {
					ctx.message.channel?.send({
						content: `${process.env.SUCCESS_EMOJI} | Sucessfully removed the footer.`,
					});
					data.content = null;
					await data.save();
					return;
				}

				const member = ctx.message.member;

				let data_message = message.first().content;

				if (message.first().content) {
					data_message = message.first().content.replace(/<<server.name>>/g, member?.guild.name).replace(/<<server.membercount>>/g, member?.guild.memberCount).replace(/<<user?.mention>>/g, member?.user?.toString()).replace(/<<user?.created_at>>/g, `<t:${Math.floor(member?.user?.createdTimestamp / 1000)}:F>`).replace(/<<user?.joined_at>>/g, `<t:${Math.floor(member?.joinedAt / 1000)}:F>`).replace(/<<user?.id>>/g, member?.user?.id).replace(/<<user?.username>>/g, member?.user?.username).replace(/<<user?.displayname>>/g, member?.user?.globalName || member?.user?.username);
				}

				if (data_message.length > 2000) {
					return ctx.message.channel?.send({
						content: `${process.env.FAILURE_EMOJI} | Your message is too long, please make it shorter.`,
					});
				}

				data.content = message.first().content;
				await data.save();

				ctx.message.channel?.send({
					content: `${process.env.SUCCESS_EMOJI} | Welcome message is sucessfully setted. `,
				});
			}
			else {
				ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | You haven't set a channel for the welcomer, please set a channel first.`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		});

	},
});