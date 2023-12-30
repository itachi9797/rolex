const App = require('../../../../Structures/Core/App');
const Owners = require('../../../../Database/Schemas/owners');
const { EmbedBuilder } = require('discord.js');

module.exports = new App({
	name: 'owner',
	description: 'Adds/removes/resets/shows owners for the antinuke system!',
	usage: 'owner <add | remove | reset | show> [user]',
	aliases: ['owners'],
	userPermissions: ['Server Owner'],
	options: [{
		name: 'add',
		description: 'Add a trusted member to the owner list for better security!',
		type: 1,
		options: [{
			name: 'user',
			description: 'The user you want to add in owner list',
			type: 6,
			required: true,
		}],
	},
	{
		name: 'remove',
		description: 'Removes a member from the owner list for better security!',
		type: 1,
		options: [{
			name: 'user',
			description: 'The user you want to remove from owner list',
			type: 6,
			required: true,
		}],
	},
	{
		name: 'reset',
		description: 'Resets the owner list for better security!',
		type: 1,
	},
	{
		name: 'show',
		description: 'Shows the owner list for better security!',
		type: 1,
	},
	],
	/**
     * @param {Rolex} ctx
     */
	run: async (ctx) => {
		await Owners.findOne({
			Guild: ctx.interaction.guild.id,
		}).then(async (data) => {
			const subcommand = ctx.interaction.options.getSubcommand();
			switch (subcommand) {
				case 'add':
					if (ctx.interaction.user?.id !== ctx.interaction.guild.ownerId) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`,
							ephemeral: true,
						});
					}
					if (!data) {
						data = new Owners({
							Guild: ctx.interaction.guild.id,
							additional_owners: [],
						});
					}
					const user = ctx.interaction.options.getUser('user');
					if (user?.id === ctx.interaction.guild.ownerId) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | The server owner doesn't need to be added in the owner list!`,
							ephemeral: true,
						});
					}
					if (user?.id === ctx.client.user?.id) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | Why do you need to add me in the owner list?`,
							ephemeral: true,
						});
					}
					if (data.additional_owners.includes(user?.id)) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | This user is already in the owner list!`,
							ephemeral: true,
						});
					}
					if (data.additional_owners.length >= 5) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | You can only add 5 owners to the owner list!`,
							ephemeral: true,
						});
					}
					data.additional_owners.push(user?.id);
					await data.save();
					ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Added **${user?.globalName || user?.username}** to the owner list!`,
					});
					break;
				case 'remove':
					if (ctx.interaction.user?.id !== ctx.interaction.guild.ownerId) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`,
							ephemeral: true,
						});
					}
					const user2 = ctx.interaction.options.getUser('user');
					if (!data || !data.additional_owners.includes(user2?.id)) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | This user is not in the owner list!`,
							ephemeral: true,
						});
					}
					if (data.additional_owners.length <= 1) {
						await data.deleteOne();
						return ctx.interaction.reply({
							content: `${process.env.SUCCESS_EMOJI} | Removed **${user2?.globalName !== null ? user2?.globalName : user2?.username}** from the owner list!`,
						});
					}
					data.additional_owners = data.additional_owners.filter((x) => x !== user2?.id);
					await data.save();
					ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Removed **${user2?.globalName !== null ? user2?.globalName : user2?.username}** from the owner list!`,
					});
					break;
				case 'reset':
					if (ctx.interaction.user?.id !== ctx.interaction.guild.ownerId) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`,
							ephemeral: true,
						});
					}
					await data.deleteOne();
					ctx.interaction.reply({
						content: `${process.env.SUCCESS_EMOJI} | Owner list was reset successfully!`,
					});
					break;
				case 'show':
					if (ctx.interaction.user?.id !== ctx.interaction.guild.ownerId && !(data && data.additional_owners.includes(ctx.interaction.user?.id))) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | Security commands can only be used by the server owner!`,
							ephemeral: true,
						});
					}
					if (!data || !data.additional_owners.length) {
						return ctx.interaction.reply({
							content: `${process.env.FAILURE_EMOJI} | No additional owners found!`,
							ephemeral: true,
						});
					}
					const description = (await Promise.all(data.additional_owners
						.map((r) => r)
						.map(async (r, i) =>
							`\`${i + 1}\` | ${(ctx.client.users.cache.get(r) ? ctx.client.users.cache.get(r) : (await ctx.client.users.fetch(r))).globalName !== null ? ctx.client.users.cache.get(r).globalName : ctx.client.users.cache.get(r).username} | <@${r}>)`))).join('\n');

					const embed = new EmbedBuilder()
						.setColor(16705372)
						.setTitle(`Total Additional Owners: ${data.additional_owners.length}`)
						.setDescription(description);

					ctx.interaction.reply({
						embeds: [embed],
					});
					break;
			}
		});
	},
});