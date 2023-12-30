require('./Src/Structures/Utils/Functions/loadEnv').loadEnv();

const RolexBot = require('./Src/Structures/Client/Client');

const Rolex = new RolexBot();

Rolex.launch(process.env.TOKEN);

const GiveawaysManager = require('./Src/Structures/Client/Giveaways');

const manager = new GiveawaysManager(Rolex, {
	endedGiveawaysLifetime: 1000 * 60 * 60 * 24 * 3,
	default: {
		botsCanWin: false,
		embedColor: '#F1C40F',
		embedColorEnd: '#FF0000',
		reaction: '<a:giveaways:1099213761467924480>',
	},
});

Rolex.giveawaysManager = manager;

manager.LoadEvents();

module.exports = Rolex;