const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/antinuke');
const Owners = require('../../../../Database/Schemas/owners');
const { separateWords } = require('../../../../Structures/Utils/Functions/separateWords');

module.exports = new App({
	name: 'toggle',
	description: 'Toggle antinuke features for your server!',
	usage: 'toogle <features>',
	userPermissions: ['Server Owner'],
	options: [{
		name: 'options',
		description: 'Toggle\'s the antinuke features as per the given options',
		required: true,
		type: 3,
		choices: [
			{
				name: 'Anti Bot Add',
				value: 'AntiBot',
			},
			{
				name: 'Anti Channel Create',
				value: 'AntiChannelCreate',
			},
			{
				name: 'Anti Channel Delete',
				value: 'AntiChannelDelete',
			},
			{
				name: 'Anti Channel Update',
				value: 'AntiChannelUpdate',
			},
			{
				name: 'Anti Expression Delete',
				value: 'AntiExpressionDelete',
			},
			{
				name: 'Anti Mentions',
				value: 'AntiMentions',
			},
			{
				name: 'Anti Server Update',
				value: 'AntiServer',
			},
			{
				name: 'Anti Invite Delete',
				value: 'AntiInviteDelete',
			},
			{
				name: 'Anti Member Roles Update',
				value: 'AntiMemberRolesUpdate',
			},
			{
				name: 'Anti Prune',
				value: 'AntiPrune',
			},
			{
				name: 'Anti Role Create',
				value: 'AntiRoleCreate',
			},
			{
				name: 'Anti Role Delete',
				value: 'AntiRoleDelete',
			},
			{
				name: 'Anti Role Update',
				value: 'AntiRoleUpdate',
			},
			{
				name: 'Anti Unban',
				value: 'AntiUnban',
			},
			{
				name: 'Anti Vanity Update',
				value: 'AntiVanitySteal',
			},
			{
				name: 'Anti Webhook Create',
				value: 'AntiWebhookCreate',
			},
			{
				name: 'Anti Webhook Update',
				value: 'AntiWebhookUpdate',
			},
			{
				name: 'Anti Webhook Delete',
				value: 'AntiWebhookDelete',
			},
			{
				name: 'Anti Ban',
				value: 'AntiBan',
			},
			{
				name: 'Anti Kick',
				value: 'AntiKick',
			},
		],
	}],

	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		const owner_data = await Owners.findOne({
			Guild: ctx.interaction.guild.id,
		});

		if (ctx.interaction.user?.id !== ctx.interaction.guild.ownerId && !(owner_data && owner_data.additional_owners.includes(ctx.interaction.user?.id))) {
			return ctx.interaction.reply({
				content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`,
				ephemeral: true,
			});
		}

		await Schema.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {
			if (!data) {
				return ctx.interaction.reply({
					content: `${process.env.FAILURE_EMOJI} | Antinuke is disabled for this server!`,
					ephemeral: true,
				});
			}
			const ops = ctx.interaction.options.getString('options');
			switch (ops.toLowerCase()) {
				case 'antiwebhookupdate':
					data.antiwebhookUpdate = !data.antiwebhookUpdate;
					break;
				case 'antibot':
					data.antibot = !data.antibot;
					break;
				case 'antichannelcreate':
					data.antiChannelCreate = !data.antiChannelCreate;
					break;
				case 'antichanneldelete':
					data.antiChannelDelete = !data.antiChannelDelete;
					break;
				case 'antichannelupdate':
					data.antiChannelUpdate = !data.antiChannelUpdate;
					break;
				case 'antiexpressiondelete':
					data.antiEmojiDelete = !data.antiEmojiDelete;
					break;
				case 'antimentions':
					data.antiEveryone = !data.antiEveryone;
					break;
				case 'antiserver':
					data.antiserver = !data.antiserver;
					break;
				case 'antiinvitedelete':
					data.antiInviteDelete = !data.antiInviteDelete;
					break;
				case 'antimemberrolesupdate':
					data.antimember = !data.antimember;
					break;
				case 'antiprune':
					data.antiprune = !data.antiprune;
					break;
				case 'antirolecreate':
					data.antiRoleCreate = !data.antiRoleCreate;
					break;
				case 'antiroledelete':
					data.antiRoleDelete = !data.antiRoleDelete;
					break;
				case 'antiroleupdate':
					data.antiRoleUpdate = !data.antiRoleUpdate;
					break;
				case 'antiunban':
					data.antiunban = !data.antiunban;
					break;
				case 'antivanitysteal':
					data.antiVanitySteal = !data.antiVanitySteal;
					break;
				case 'antiwebhookcreate':
					data.antiwebhookCreate = !data.antiwebhookCreate;
					break;
				case 'antiwebhookdelete':
					data.antiwebhookDelete = !data.antiwebhookDelete;
					break;
				case 'antiban':
					data.antiban = !data.antiban;
					break;
				case 'antikick':
					data.antikick = !data.antikick;
					break;
			}
			await data.save();
			
			return ctx.interaction.reply({
				content: `${process.env.SUCCESS_EMOJI} | Successfully toggled ${separateWords(ops)}!`
			});
		});
	},
});