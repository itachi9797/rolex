const App = require('../../../../Structures/Core/App');
const Schema = require('../../../../Database/Schemas/badge');

module.exports = new App({
	name: 'badge',
	description: 'Shows the badge of a user',
	usage: 'badge <add | remove | reset> <user> <badge>',
	/**
     * @param {Rolex} ctx
     */

	run: async (ctx) => {

		if (!ctx.client.owners.includes(ctx.message.author?.id) && !ctx.client.mods.includes(ctx.message.author?.id)) return;
		const args = ctx.message.content.split(' ').slice(1);
		const action = args[0];

		if (!args[0] || (args[0] !== 'add' && args[0] !== 'remove' && args[0] !== 'reset')) return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid action. Available actions are \`add\`, \`remove\`, \`reset\`.`);
		if (!args[1]) return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a user to add badge to.`);

		let user;

		if (ctx.message.content.match(/<@(\d+)>/) !== null && args[1] === ctx.message.content.match(/<@(\d+)>/)[0]) {
			try {
				user = await ctx.client.users.fetch(ctx.message.content.match(/<@(\d+)>/)[1]);
			}
			catch (e) {
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		}
		else if (ctx.message.mentions.members.first() && ctx.message.mentions.members.first() === args[1]) {
			try {
				user = await ctx.client.users.fetch(ctx.message.mentions.members.first().id);
			}
			catch (e) {
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		}
		else {
			try {
				user = await ctx.client.users.fetch(args[1]);
			}
			catch (e) {
				return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid user!`).then(message => {
					setTimeout(() => {
						message.delete();
					}, 15000);
				});
			}
		}

		if (!args[2] && args[0] !== 'reset') return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a badge to add/remove`);
		if (args[0] === 'reset') {
			const data = await Schema.findOne({
				User: user?.id,
			});
			if (!data) return ctx.message.reply(`${process.env.FAILURE_EMOJI} | The user doesn't have any badges`);

			if (ctx.client.mods.includes(ctx.message.author?.id)) {
				if (data.Badges.map((b) => b.value).includes('Team') || data.Badges.map((b) => b.value).includes('Developer')) {
					const badges = data.Badges.filter((b) => b.value === 'Team' || b.value === 'Developer');
					await data.updateOne({
						Badges: badges,
					});
					return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | Successfully removed all Badge from \`${user?.globalName || user?.username}\`.`);
				} else {
					await data.deleteOne();
					return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | Successfully removed all Badge from \`${user?.globalName || user?.username}\`.`);
				}
			} else {
				await data.deleteOne();
				return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | Successfully removed all Badge from \`${user?.globalName || user?.username}\`.`);
			}
		}

		const badge = args[2].charAt(0).toUpperCase() + args[2].slice(1).toLowerCase();

		const badges = ['Team', 'Developer', 'Staff', 'Sponsor', 'Supporter', 'Partner', 'Friend', 'Bug_hunter'];
		const badges_name = {
			Team: `<:owner:993945290337964153> • ${ctx.client.user?.globalName || ctx.client.user?.username}'s Team Member`,
			Developer: `<:Active_Developer:1044479260292808785> • ${ctx.client.user?.globalName || ctx.client.user?.username}'s Developer`,
			Staff: `<:Discord_Staff:969270359704629418> • ${ctx.client.user?.globalName || ctx.client.user?.username}'s Support Staff`,
			Sponsor: `<a:sponser:979707180724932668> • ${ctx.client.user?.globalName || ctx.client.user?.username}'s Sponsor`,
			Supporter: `<:Early_Supporter:969268917660975144> • ${ctx.client.user?.globalName || ctx.client.user?.username}'s Early Supporter`,
			Partner: `<:Discord_Partnered_Server_Owner:969270590110331010> • ${ctx.client.user?.globalName || ctx.client.user?.username}'s Partner`,
			Friend: '<a:owner_friend:979707310840623124> • My Owner\'s Friend',
			Bug_hunter: `<:Bug_Hunter:969270237855899689> • ${ctx.client.user?.globalName || ctx.client.user?.username}'s Bug Hunter`,
		};

		if (!badges.includes(badge)) return ctx.message.reply(`${process.env.FAILURE_EMOJI} | Please provide a valid badge. Available badges are: \n${badges.map(b => `\`${b}\``).join(', ')}`);

		if (ctx.client.mods.includes(ctx.message.author?.id) && (badge === 'Team' || badge === 'Developer')) return ctx.message.reply(`${process.env.FAILURE_EMOJI} | You can't add/remove \`${badge}\` badge!`);

		const data = await Schema.findOne({
			User: user?.id,
		});

		switch (action) {
			case 'add':
				if (!data) {
					Schema.create({
						User: user?.id,
						Badges: [{
							name: badges_name[badge],
							value: badge,
						} ],
					});
					return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | Successfully given \`${badge}\` badge to \`${user?.globalName || user?.username}\``);
				}
				else {
					if (data && data.Badges.map((b) => b.value).includes(badge)) return ctx.message.reply(`${process.env.FAILURE_EMOJI} | The user already has this badge`);

					data.Badges.push({
						name: badges_name[badge],
						value: badge,
					});
					await data.save();
					return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | Successfully given \`${badge}\` badge to \`${user?.globalName || user?.username}\``);
				}
			case 'remove':
				if (!data || (data && !data.Badges.map((badge_rmv) => badge_rmv.value).includes(badge))) return ctx.message.reply(`${process.env.FAILURE_EMOJI} | The user doesn't have this badge`);
				if (data.Badges.length === 1) {
					await data.deleteOne();
					return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | Successfully removed \`${badge}\` Badge from \`${user?.globalName || user?.username}\`.`);
				}
				data.Badges.splice(data.Badges.findIndex(e => e.value === badge), 1);
				await data.save();
				return ctx.message.reply(`${process.env.SUCCESS_EMOJI} | Successfully removed \`${badge}\` Badge from \`${user?.globalName || user?.username}\`.`);
		}
	},
});