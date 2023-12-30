const App = require('../../../../Structures/Core/App');
const { PermissionsBitField } = require('discord.js');
const Owners = require('../../../../Database/Schemas/owners');

module.exports = new App({
	name: 'mute',
	description: 'Mutes a member in the server!',
	usage: 'mute <member> [duration] [reason]',
	aliases: ['m', 'silence', 'shutup', 'stfu', 'timeout', 'tmute', 'tempmute'],
	userPermissions: ['Moderate Members'],
	options: [{
		name: 'member',
		description: 'The member you want to mute!',
		required: true,
		type: 6,
	},
	{
		name: 'duration',
		description: 'The time for muting the user!',
		required: false,
		type: 3,
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
		const time = ctx.interaction.options.getString('duration') || '28d';
		if (member?.user?.id === ctx.interaction.user?.id) {
			ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI}} | Why don't you just keep quiet instead of punishing yourself?`,
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

			if (member?.user?.id === ctx.interaction.guild.ownerId || (owner_data && owner_data.additional_owners.includes(member?.user?.id))) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | You can't punish an owner.`,
					ephemeral: true,
				});
			}

			if (member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | You can't punish an administrator.`,
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

			const multipliers = {
				ms: 1,
				s: 1000,
				m: 60 * 1000,
				h: 60 * 60 * 1000,
				d: 24 * 60 * 60 * 1000,
			};

			const timeUnit = time.slice(-1);
			if (!multipliers[timeUnit]) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | Invalid time unit! Please use one of the following: \`ms\`, \`s\`, \`m\`, \`h\`, \`d\``,
					ephemeral: true,
				});
			}

			const timeValue = parseInt(time.slice(0, -1));
			if (isNaN(timeValue)) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | Invalid time value! Please enter a valid time`,
					ephemeral: true,
				});
			}

			const timeInMs = timeValue * multipliers[timeUnit];
			if (timeInMs > 2419200000) {
				return ctx.interaction.editReply({
					content: `${process.env.FAILURE_EMOJI} | You can't mute someone for more than 28 days! It's too rude..`,
				});
			}

			await member?.timeout(timeInMs, `${reason} - (${ctx.interaction.user?.id})`);
			ctx.interaction.reply({
				content: `${process.env.SUCCESS_EMOJI} | Successfully muted ${member?.user?.globalName || member?.user?.username}!`,
			}).then(async (msg) => {
				await member?.user?.send({
					content: `You were muted in ${ctx.interaction.guild.name} for ${time}!\nReason: ${reason}`,
				}).catch(() => {
					return msg.edit({
						content: `${process.env.SUCCESS_EMOJI} | Successfully muted ${member?.user?.globalName || member?.user?.username} for ${time}! | I couldn't DM the user?.`,
					});
				});
			});
		}
	},
});