const { GiveawaysManager } = require('../../Giveaways/index');
const giveawayModel = require('../../Database/Schemas/giveaways');
const fs = require('fs');

module.exports = class extends GiveawaysManager {
	async getAllGiveaways() {
		return await giveawayModel.find().lean().exec();
	}

	async saveGiveaway(messageId, giveawayData) {
		await giveawayModel.create(giveawayData);
		return true;
	}

	async editGiveaway(messageId, giveawayData) {
		await giveawayModel.updateOne({
			messageId,
		}, giveawayData).exec();
		return true;
	}

	async deleteGiveaway(messageId) {
		await giveawayModel.deleteOne({
			messageId,
		}).exec();
		return true;
	}

	async LoadEvents() {
		const directories = fs.readdirSync('./Src/Giveaway Events');
		for (const file of directories) {
			const event = require(`../../Giveaway Events/${file}`);
			this.on(event.name, (...args) => event.run(this.client, ...args));
			switch (file) {
				case 'Error':
					process.on(event.name, (...args) => event.run(this.client, ...args));
					break;
			}
		}
	}
};