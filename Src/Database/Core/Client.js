const mongoose = require('mongoose');
const { dependencies } = require('../../../package.json');

module.exports = class RolexDB {
	constructor() {}

	async start() {
		await mongoose.connect(process.env.MONGO_STRING, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}).then(() => {
			console.log('——————————[Database Info]——————————');
			console.log(`[RolexDB] - Connected ✅ || [Database Type] - MongoDB || [Version] - ${dependencies['mongoose']}`);
		}).catch(e => console.log(e));
	}
};