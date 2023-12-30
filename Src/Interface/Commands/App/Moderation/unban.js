const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'unban',
	description: 'Bans a member in the server!',
	usage: 'unban <user> [reason]',
	userPermissions: ['Ban Members'],
	options: [{
		name: 'user',
		description: 'The user you wan\'t to issue ban for!',
		required: true,
		type: 6,
	},
	{
		name: 'reason',
		description: 'The reason you wan\'t to ban the user',
		required: false,
		type: 3,
	},
	],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const user = ctx.interaction.options.getUser('user');
		const reason = ctx.interaction.options.getString('reason') || 'No Reason Specified';
		if (user?.id === ctx.interaction.user?.id) {
			ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | How tf you can unban yourself?`,
				ephemeral: true,
			});
		}
		else {
			const owner_data = await Owners.findOne({
				Guild: ctx.interaction.guild.id,
			});
			if (!ctx.interaction.member?.permissions.has(PermissionsBitField.Flags.BanMembers) && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | You do not have \`Ban Members\` permissions!`,
					ephemeral: true,
				});
			}

			if (ctx.interaction.member?.id !== ctx.interaction.guild.ownerId && ctx.interaction.member?.roles.highest.position <= ctx.interaction.guild.members.me.roles.highest.position && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | You must be above me to use this command.`,
					ephemeral: true,
				});
			}

			if (!ctx.interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | I do not have \`Ban Members\` permissions!`,
					ephemeral: true,
				});
			}

			ctx.interaction.guild.bans.fetch().then(async (bans) => {
				const bUser = bans.find(b => b.user?.id == user?.id);
				if (!bUser) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | The given user is not banned`,
						ephemeral: true,
					});
				}

				await ctx.interaction.guild.bans.remove(user?.id, `${reason} - (${ctx.interaction.user?.id})`);

				ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully unbanned ${user?.globalName || user?.username}!`,
				});
			});
		}
	},
});