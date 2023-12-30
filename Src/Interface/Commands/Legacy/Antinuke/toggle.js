const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/antinuke');
const Owners = require('../../../../Database/Schemas/owners');
const { separateWords } = require('../../../../Structures/Utils/Functions/separateWords');

module.exports = new App({
	name: 'toggle',
	description: 'Toggle antinuke features for your server!',

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.message.guild.id,
		});

		if (ctx.message.author?.id !== ctx.message.guild.ownerId && !(owner_data && owner_data.additional_owners.includes(ctx.message.author?.id))) {
			return ctx.message.reply({
				content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`,
			}).then(message => {
				setTimeout(() => {
					message.delete();
				}, 15000);
			});
		}

		await Schema.findOne({
			Guild: ctx.message.guild.id,
		}).then(async (data) => {
			if (!data) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | Antinuke is disabled for this server!`,

				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			const ops = ctx.message.content.split(' ').slice(1).join(' ');

			if (!ops) {
				return ctx.message.reply({
					content: `${process.env.FAILURE_EMOJI} | Please provide a valid option! To see a list of options run \`-status\` command!`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}

			switch (ops.toLowerCase()) {
				case 'anti webhook update':
					data.antiwebhookUpdate = !data.antiwebhookUpdate;
					break;
				case 'anti bot add':
					data.antibot = !data.antibot;
					break;
				case 'anti channel create':
					data.antiChannelCreate = !data.antiChannelCreate;
					break;
				case 'anti channel delete':
					data.antiChannelDelete = !data.antiChannelDelete;
					break;
				case 'anti channel update':
					data.antiChannelUpdate = !data.antiChannelUpdate;
					break;
				case 'anti expression delete':
					data.antiEmojiDelete = !data.antiEmojiDelete;
					break;
				case 'anti everyone/here ping':
					data.antiEveryone = !data.antiEveryone;
					break;
				case 'anti server update':
					data.antiserver = !data.antiserver;
					break;
				case 'anti invite delete':
					data.antiInviteDelete = !data.antiInviteDelete;
					break;
				case 'anti member roles update':
					data.antimember = !data.antimember;
					break;
				case 'anti prune':
					data.antiprune = !data.antiprune;
					break;
				case 'anti role create':
					data.antiRoleCreate = !data.antiRoleCreate;
					break;
				case 'anti role delete':
					data.antiRoleDelete = !data.antiRoleDelete;
					break;
				case 'anti role update':
					data.antiRoleUpdate = !data.antiRoleUpdate;
					break;
				case 'anti unban':
					data.antiunban = !data.antiunban;
					break;
				case 'anti vanity update':
					data.antiVanitySteal = !data.antiVanitySteal;
					break;
				case 'anti webhook create':
					data.antiwebhookCreate = !data.antiwebhookCreate;
					break;
				case 'anti webhook delete':
					data.antiwebhookDelete = !data.antiwebhookDelete;
					break;
				case 'anti ban':
					data.antiban = !data.antiban;
					break;
				case 'anti kick':
					data.antikick = !data.antikick;
					break;

				default:
					return ctx.message.reply({
						content: `${process.env.FAILURE_EMOJI} | Please provide a valid option! To see a list of options run \`-status\` command!`,
					}).then(message => {
						setTimeout(() => {
							message.delete();
						}, 15000);
					});
			}

			await data.save().then(async () => {
				return ctx.message.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully toggled ${separateWords(ops)}!`,
				}).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			});
		});
	},
});