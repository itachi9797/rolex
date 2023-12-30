const Component = require('../../Structures/Core/Component');
const db = require('../../Database/Schemas/globalafk');
const db2 = require('../../Database/Schemas/guildafk');

module.exports = new Component({
	name: 'messageCreate',
	/**
     * @param {Rolex} client
     * @param {Message} message
     */
	run: async (client, message) => {
		if (message.webhookId !== null) return;
		if (message.author?.bot) return;

		const data = await db.findOne({
			User: message.author?.id,
		});

		const data2 = await db2.findOne({
			Guild: message.guild.id,
			User: message.author?.id,
		});

		if (data || data2) {
			let user;
			if (client.users.cache.get(message.author?.id) !== undefined) {
				user = client.users.cache.get(message.author?.id);
			}
			else {
				user = await client.users.fetch(message.author?.id);
			}

			await message.reply({
				content: `Welcome back **${user?.globalName || user?.username}**, I removed you afk. You went afk <t:${(data2 ? data2.timestamp : data.timestamp)}:R>`,
			}).then(m => setTimeout(() => m.delete(), 20000));
			data2 ? await data2.deleteOne() : await data.deleteOne();
		}

		if (message.mentions.users.map(e => e.id).includes(message.author?.id)) return;
		for (let i = 0; i < message.mentions.users.map(e => e.id).length; i++) {
			let temp_data = await db.findOne({
				User: message.mentions.users.map(e => e.id)[i],
			});

			let temp_data2 = await db2.findOne({
				Guild: message.guild.id,
				User: message.mentions.users.map(e => e.id)[i],
			});

			if (temp_data || temp_data2) {
				let user;
				if (client.users.cache.get(message.mentions.users.map(e => e.id)[i]) === undefined) {
					user = await client.users.fetch(message.mentions.users.map(e => e.id)[i]);
				} else {
					user = client.users.cache.get(message.mentions.users.map(e => e.id)[i]);
				}
				message.reply({
					content: `Shhh! **${user?.globalName || user?.username}** went afk <t:${(temp_data2 ? temp_data2.timestamp : temp_data.timestamp)}:R>: ${(temp_data2 ? temp_data2.reason : temp_data.reason)}`,
				});
			}
		}
	},
});