const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'unmute',
	description: 'Unmutes a member in the server!',
	usage: 'unmute <member> [duration] [reason]',
	userPermissions: ['Moderate Members'],
	aliases: ['unshut', 'umute'],
	options: [{
		name: 'member',
		description: 'The member you want to unmute!',
		required: true,
		type: 6,
	},
	{
		name: 'reason',
		description: 'The reason for muting the user!',
		required: false,
		type: 3,
	},
	],

	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {
		const member = ctx.interaction.options.getMember('member');
		const reason = ctx.interaction.options.getString('reason') || 'No Reason Specified';
		if (member?.user?.id === ctx.interaction.user?.id) {
			ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI}} | How tf you can unmute yourself?`,
				ephemeral: true,
			});
		}
		else {
			const owner_data = await Owners.findOne({
				Guild: ctx.interaction.guild.id,
			});
			if (!ctx.interaction.member?.permissions.has(PermissionsBitField.Flags.ModerateMembers) && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.member?.id))) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | You do not have \`Moderate Members\` permissions!`,
					ephemeral: true,
				});
			}

			if (!ctx.interaction.guild.members.cache.get(member?.id)) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | The member is not in the server!`,
					ephemeral: true,
				});
			}

			if (ctx.interaction.member?.user?.id !== ctx.interaction.guild.ownerId && ctx.interaction.member?.roles.highest.position <= member?.roles.highest.position) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | You cannot do this action on this user due to role hierarchy.`,
					ephemeral: true,
				});
			}

			if (!ctx.interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | I do not have \`Moderate Members\` permissions!`,
					ephemeral: true,
				});
			}

			if (ctx.interaction.guild.members.me.roles.highest.position <= member?.roles.highest.position) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | The user has higher or equal position to me.`,
					ephemeral: true,
				});
			}

			await member?.timeout(null, `${reason} - (${ctx.interaction.user?.id})`);
			ctx.interaction.reply({
				content: `${process.env.SUCCESS_EMOJI} | Successfully unmuted ${member?.user?.globalName || member?.user?.username}!`,
			});

			await member?.user?.send({
				content: `Your were unmuted in ${ctx.interaction.guild.name}!\nReason: ${reason}`,
			}).catch(() => {
				return ctx.interaction.editReply({
					content: `${process.env.SUCCESS_EMOJI} | Successfully unmuted ${member?.user?.globalName || member?.user?.username}! | I couldn't DM the user?.`,
				});
			});
		}
	},
});