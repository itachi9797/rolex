const { Client, GatewayIntentBits, Partials, Collection, version } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const RolexDatabase = require('../../Database/Core/Client');

module.exports = class RolexBot extends Client {
	constructor(required = {
		fetchAllMembers: true,
		restTimeOffset: 1,
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildInvites,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildWebhooks,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildPresences,
			GatewayIntentBits.GuildModeration,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildEmojisAndStickers,
		],
		partials: [
			Partials.Channel,
			Partials.User,
			Partials.Message,
		],
		allowedMentions: {
			repliedUser: false,
			parse: ['users'],
		},
	}) {
		super(required);
		this.slashCommands = new Collection();
		this.commands = new Collection();
		this.aliases = new Collection();
		this.db = new RolexDatabase();
		this.slash = [];
		this.owners = ['747337455782461482', '770657521769775172', '884306174424526859' ];
		this.mods = ['1088762231795220501'];
		this.RegisterRolex(true);
		this.start(true);
	}

	LoadComponents() {
		const directories = fs.readdirSync('./Src/Components');
		for (const subfolder of directories) {
			const comps = fs.readdirSync(`./Src/Components/${subfolder}`).filter((e) => e.endsWith('.js'));
			for (const files of comps) {
				const comp = require(`../../Components/${subfolder}/${files}`);
				this.on(comp.name, (...args) => comp.run(this, ...args));
				switch (subfolder) {
					case 'Error':
						process.on(comp.name, (...args) => comp.run(this, ...args));
						break;
				}
			}
		}
	}

	LoadApp() {
		const directories = fs.readdirSync('./Src/Interface/Commands/App');
		for (const subfolder of directories) {
			const cmds = fs.readdirSync(`./Src/Interface/Commands/App/${subfolder}`).filter((e) => e.endsWith('.js'));
			for (const files of cmds) {
				const cmd = require(`../../Interface/Commands/App/${subfolder}/${files}`);
				this.slashCommands.set(cmd.name, cmd);
				this.slash.push(cmd);
			}
		}
	}

	LoadLegacy() {
		const directories = fs.readdirSync('./Src/Interface/Commands/Legacy');
		for (const subfolder of directories) {
			const cmds = fs.readdirSync(`./Src/Interface/Commands/Legacy/${subfolder}`).filter((e) => e.endsWith('.js'));
			for (const files of cmds) {
				const cmd = require(`../../Interface/Commands/Legacy/${subfolder}/${files}`);
				this.commands.set(cmd.name, cmd);

				if (cmd.aliases) {
					cmd.aliases.forEach((alias) => {
						this.aliases.set(alias, cmd.name);
					});
				}
			}
		}
	}

	RegisterRolex(Boolean) {
		switch (Boolean) {
			case false:
				console.log('[IMPORTANT] - Rolex is not registering!');
				break;
			case true:
				this.LoadApp();
				this.LoadLegacy();
				this.LoadComponents();
				this.RegisterSlash();
				break;
		}
	}

	RegisterSlash() {
		const rest = new REST({
			version: '10',
		}).setToken(process.env.TOKEN);
		(async () => {
			try {
				console.log('Started refreshing application (/) commands.');

				await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: this.slash });

				console.log('Successfully reloaded application (/) commands.');
			}
			catch (error) {
				console.error(error);
			}
		})();
	}

	launch(token) {
		this.login(token).then(async () => {
			console.log('——————————[Basic Info]——————————'),
			console.log(`Total Commands: ${this.slashCommands.size}`),
			console.log(`Developer: ${process.env.DEVELOPER_NAME}`),
			console.log('——————————[Statistics]——————————'),
			console.log(`Running on Node ${process.version} on ${process.platform} ${process.arch}`),
			console.log(`RSS: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`),
			console.log(`Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`),
			console.log('Discord.js Verion: ' + version),
			console.log('——————————[Connections]——————————'),
			console.log(`✅ Successfully Connected To ${this.user?.username} (${this.user?.id})`);
		});
	}

	start(boolean) {
		switch (boolean) {
			case false:
				console.log('[IMPORTANT] - RolexDB will not start!');
				break;
			case true:
				this.db.start();
				break;
		}
	}
};
