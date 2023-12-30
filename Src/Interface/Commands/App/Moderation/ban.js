const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'ban',
	description: 'Ban a member in the server!',
	usage: 'ban <user> [reason]',
	userPermissions: ['Ban Members'],
	aliases: ['hackban', 'fuckban', 'fuckyou', 'fuckoff'],
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
				content: `${process.env.FAILURE_EMOJI} | Why don't you just leave?`,
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

			if (ctx.interaction.guild.members.cache.get(user?.id)) {

				if (user?.id === ctx.interaction.guild.ownerId || (owner_data && owner_data.additional_owners.includes(user?.id))) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | You can't punish an owner.`,
						ephemeral: true,
					});
				}

				if (ctx.interaction.member?.user?.id !== ctx.interaction.guild.ownerId && ctx.interaction.member?.roles.highest.position <= ctx.interaction.guild.members.cache.get(user?.id).roles.highest.position) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | You cannot do this action on this user due to role hierarchy.`,
						ephemeral: true,
					});
				}

				if (ctx.interaction.guild.members.cache.get(user?.id).roles.highest.position >= ctx.interaction.guild.members.me.roles.highest.position) {
					return ctx.interaction.reply({
						content: `${process.env.FAILURE_EMOJI} | The user has higher or equal position to me.`,
						ephemeral: true,
					});
				}

				await ctx.interaction.guild.members.ban(user?.id, {
					reason: `${reason} - (${ctx.interaction.user?.id})`,
				});
				ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully banned ${user?.globalName || user?.username}!`,
				});

				await user?.send({
					content: `You were banned from ${ctx.interaction.guild.name}!\nReason: ${reason}`,
				}).catch(() => {
					return ctx.interaction.editReply({
						content: `${process.env.SUCCESS_EMOJI} | Successfully banned ${user?.globalName || user?.username}! | I couldn't DM the user?.`,
					});
				});
			}
			else {
				await ctx.interaction.guild.members.ban(user?.id, {
					reason: `${reason} - (${ctx.interaction.user?.id})`,
				});
				ctx.interaction.reply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully banned ${user?.globalName || user?.username}!`,
				});
			}
		}
	},
});