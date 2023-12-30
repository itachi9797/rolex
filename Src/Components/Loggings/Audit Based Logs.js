const Component = require('../../Structures/Core/Component');
const { separateWords } = require('../../Structures/Utils/Functions/separateWords');
const db = require('../../Database/Schemas/loggings');
const { PermissionsBitField } = require('discord.js');

module.exports = new Component({
	name: 'guildAuditLogEntryCreate',
	/**
     * @param {Rolex} client
     */
	run: async (client, auditLogEntry, guild) => {
		if (auditLogEntry === undefined) return;

		if (guild.members.cache.get(auditLogEntry.executor?.id) === undefined) {
			try {
				await guild.members.fetch(auditLogEntry.executor?.id);
			}
			catch {
				return;
			}
		}

		await db.findOne({
			Guild: guild.id,
		}).then(async (data) => {
			if (data) {
				switch (auditLogEntry.action) {
					case 1:
						if (!guild.channels.cache.get(data.server)) return;

						if (!guild.channels.cache.get(data.server).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.server).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						if (auditLogEntry.targetType !== 'Guild') return;

						if (auditLogEntry.actionType !== 'Update') return;

						await guild.channels.cache.get(data.server).send({
							embeds: [{
								author: {
									name: auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username,
									icon_url: auditLogEntry.executor?.displayAvatarURL({ size: 2048 }),
								},
								description: 'Server has been updated.',
								fields: [{
									name: 'Old values',
									value: `${auditLogEntry.changes.map((x) => `${x.key.charAt(0).toUpperCase() + x.key.slice(1).toLowerCase()}: \`${x.old}\``).join('\n').replace(/_/g, ' ').replace(/undefined/g, 'None').replace(/`true`/g, '<:tick:968773535914922014>').replace(/`false`/g, '<:cross:968773791943626762>')}`,
									inline: true,
								},
								{
									name: 'New values',
									value: `${auditLogEntry.changes.map((x) => `${x.key.charAt(0).toUpperCase() + x.key.slice(1).toLowerCase()}: \`${x.new}\``).join('\n').replace(/_/g, ' ').replace(/undefined/g, 'None').replace(/`true`/g, '<:tick:968773535914922014>').replace(/`false`/g, '<:cross:968773791943626762>')}`,
									inline: true,
								},
								],
								color: 16705372,
								timestamp: new Date(Date.now()).toISOString(),
								footer: {
									text: `Powered by ${client.user?.globalName || client.user?.username}`,
									icon_url: client.user?.displayAvatarURL({ size: 2048 }),
								},
							}],
						}).catch();
						break;
					case 10:
						if (!guild.channels.cache.get(data.channel)) return;

						if (auditLogEntry.targetType !== 'Channel') return;

						if (auditLogEntry.actionType !== 'Create') return;

						if (!guild.channels.cache.get(data.channel).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.channel).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						await guild.channels.cache.get(data.channel).send({
							embeds: [{
								author: {
									name: auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username,
									icon_url: auditLogEntry.executor?.displayAvatarURL({ size: 2048 }),
								},
								title: 'Channel Created',
								description: `New channel (<#${auditLogEntry.target?.id}>) created by <@${auditLogEntry.executor?.id}>`,
								color: 3066993,
								fields: [{
									name: 'Name',
									value: `${auditLogEntry.target?.name} (ID: ${auditLogEntry.target?.id})`,
									inline: true,
								},
								{
									name: 'Type',
									value: auditLogEntry.target?.type,
									inline: true,
								},
								{
									name: 'Position',
									value: auditLogEntry.target?.position,
									inline: true,
								},
								{
									name: 'Category',
									value: auditLogEntry.target?.parent ? auditLogEntry.target?.parent.name : 'No category',
									inline: true,
								},
								],
								timestamp: new Date(Date.now()).toISOString(),
								footer: {
									text: `Powered by ${client.user?.globalName || client.user?.username}`,
									icon_url: client.user?.displayAvatarURL({ size: 2048 }),
								},
							}],
						}).catch();
						break;
					case 11:
						if (!guild.channels.cache.get(data.channel)) return;

						if (auditLogEntry.targetType !== 'Channel') return;

						if (auditLogEntry.actionType !== 'Update') return;

						if (!guild.channels.cache.get(data.channel).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.channel).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						await guild.channels.cache.get(data.channel).send({
							embeds: [{
								author: {
									name: auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username,
									icon_url: auditLogEntry.executor?.displayAvatarURL({ size: 2048 }),
								},
								title: 'Channel Updated',
								description: `Channel (<#${auditLogEntry.target?.id}>) updated by <@${auditLogEntry.executor?.id}>`,
								fields: [{
									name: 'Old values',
									value: `${auditLogEntry.changes.map((x) => `${x.key.charAt(0).toUpperCase() + x.key.slice(1).toLowerCase()}: \`${x.old}\``).join('\n').replace(/_/g, ' ').replace(/undefined/g, 'None').replace(/`true`/g, '<:tick:968773535914922014>').replace(/`false`/g, '<:cross:968773791943626762>')}`,
									inline: true,
								},
								{
									name: 'New values',
									value: `${auditLogEntry.changes.map((x) => `${x.key.charAt(0).toUpperCase() + x.key.slice(1).toLowerCase()}: \`${x.new}\``).join('\n').replace(/_/g, ' ').replace(/undefined/g, 'None').replace(/`true`/g, '<:tick:968773535914922014>').replace(/`false`/g, '<:cross:968773791943626762>')}`,
									inline: true,
								},
								],
								color: 16705372,
								timestamp: new Date(Date.now()).toISOString(),
								footer: {
									text: `Powered by ${client.user?.globalName || client.user?.username}`,
									icon_url: client.user?.displayAvatarURL({ size: 2048 }),
								},
							}],
						}).catch();
						break;
					case 12:
						if (!guild.channels.cache.get(data.channel)) return;

						if (auditLogEntry.targetType !== 'Channel') return;

						if (auditLogEntry.actionType !== 'Delete') return;

						if (!guild.channels.cache.get(data.channel).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.channel).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						await guild.channels.cache.get(data.channel).send({
							embeds: [{
								author: {
									name: auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username,
									icon_url: auditLogEntry.executor?.displayAvatarURL({ size: 2048 }),
								},
								title: 'Channel Deleted',
								description: `Channel (<#${auditLogEntry.target?.id}>) deleted by <@${auditLogEntry.executor?.id}>`,
								color: 15158332,
								fields: [{
									name: 'Name',
									value: `${auditLogEntry.target?.name} (ID: ${auditLogEntry.target?.id})`,
									inline: true,
								},
								{
									name: 'Type',
									value: auditLogEntry.target?.type,
									inline: true,
								},
								],
								timestamp: new Date(Date.now()).toISOString(),
								footer: {
									text: `Powered by ${client.user?.globalName || client.user?.username}`,
									icon_url: client.user?.displayAvatarURL({ size: 2048 }),
								},
							}],
						}).catch();
						break;
					case 20:
						if (!guild.channels.cache.get(data.mod)) return;

						if (!guild.channels.cache.get(data.mod).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.mod).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						if (client.guilds.cache.get(guild.id) === undefined) return;

						if (auditLogEntry.targetType !== 'User') return;

						if (auditLogEntry.actionType !== 'Delete') return;

						await guild.channels.cache.get(data.mod).send({
							embeds: [{
								author: {
									name: auditLogEntry.target?.username,
									icon_url: auditLogEntry.target?.displayAvatarURL({
										dynamic: true,
									}),
								},
								description: 'Member has been kicked from the server.',
								fields: [{
									name: 'Responsible mod',
									value: `<@${auditLogEntry.executor?.id}>`,
									inline: true,
								},
								{
									name: 'User',
									value: `${auditLogEntry.target?.username} (ID: ${auditLogEntry.target?.id})`,
									inline: true,
								},
								{
									name: 'Reason',
									value: `${auditLogEntry.reason || 'No reason provided.'}`,
									inline: true,
								},
								],
								color: 15158332,
								timestamp: new Date(Date.now()).toISOString(),
								footer: {
									text: `Powered by ${client.user?.globalName || client.user?.username}`,
									icon_url: client.user?.displayAvatarURL({ size: 2048 }),
								},
							}],
						}).catch();
						break;
					case 22:
						if (!guild.channels.cache.get(data.mod)) return;

						if (!guild.channels.cache.get(data.mod).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.mod).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;


						if (auditLogEntry.targetType !== 'User') return;

						if (auditLogEntry.actionType !== 'Delete') return;

						await guild.channels.cache.get(data.mod).send({
							embeds: [{
								author: {
									name: auditLogEntry.target?.username,
									icon_url: auditLogEntry.target?.displayAvatarURL({
										dynamic: true,
									}),
								},
								description: 'Member have been banned from the server.',
								fields: [{
									name: 'Responsible mod',
									value: `<@${auditLogEntry.executor?.id}>`,
									inline: true,
								},
								{
									name: 'User',
									value: `${auditLogEntry.target?.username} (ID: ${auditLogEntry.target?.id})`,
									inline: true,
								},
								{
									name: 'Reason',
									value: `${auditLogEntry.reason || 'No reason provided.'}`,
									inline: true,
								},
								],
								color: 15158332,
								timestamp: new Date(Date.now()).toISOString(),
								footer: {
									text: `Powered by ${client.user?.globalName || client.user?.username}`,
									icon_url: client.user?.displayAvatarURL({ size: 2048 }),
								},
							}],
						}).catch();
						break;
					case 23:
						if (!guild.channels.cache.get(data.mod)) return;

						if (!guild.channels.cache.get(data.mod).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.mod).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						if (auditLogEntry.targetType !== 'User') return;

						if (auditLogEntry.actionType !== 'Create') return;

						await guild.channels.cache.get(data.mod).send({
							embeds: [{
								author: {
									name: auditLogEntry.target?.username,
									icon_url: auditLogEntry.target?.displayAvatarURL({
										dynamic: true,
									}),
								},
								description: 'Member has been unbanned from the server.',
								fields: [{
									name: 'Responsible mod',
									value: `<@${auditLogEntry.executor?.id}>`,
									inline: true,
								},
								{
									name: 'User',
									value: `${auditLogEntry.target?.username} (ID: ${auditLogEntry.target?.id})`,
									inline: true,
								},
								{
									name: 'Reason',
									value: `${auditLogEntry.reason || 'No reason provided.'}`,
									inline: true,
								},
								],
								color: 3066993,
								timestamp: new Date(Date.now()).toISOString(),
								footer: {
									text: `Powered by ${client.user?.globalName || client.user?.username}`,
									icon_url: client.user?.displayAvatarURL({ size: 2048 }),
								},
							}],
						}).catch();
						break;
					case 24:
						if (!guild.channels.cache.get(data.member)) return;

						if (auditLogEntry.targetType !== 'User') return;

						if (auditLogEntry.actionType !== 'Update') return;

						if (!guild.channels.cache.get(data.member).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.member).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						await guild.channels.cache.get(data.member).send({
							embeds: [{
								author: {
									name: auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username,
									icon_url: auditLogEntry.executor?.displayAvatarURL({ size: 2048 }),
								},
								title: 'Member Updated',
								description: `Member <@${auditLogEntry.target?.id}> updated by <@${auditLogEntry.executor?.id}>`,
								fields: [{
									name: 'Old values',
									value: `${auditLogEntry.changes.map((x) => `${x.key.charAt(0).toUpperCase() + x.key.slice(1).toLowerCase()}: \`${x.old}\``).join('\n').replace(/_/g, ' ').replace(/undefined/g, 'None').replace(/`true`/g, '<:tick:968773535914922014>').replace(/`false`/g, '<:cross:968773791943626762>')}`,
									inline: true,
								},
								{
									name: 'New values',
									value: `${auditLogEntry.changes.map((x) => `${x.key.charAt(0).toUpperCase() + x.key.slice(1).toLowerCase()}: \`${x.new}\``).join('\n').replace(/_/g, ' ').replace(/undefined/g, 'None').replace(/`true`/g, '<:tick:968773535914922014>').replace(/`false`/g, '<:cross:968773791943626762>')}`,
									inline: true,
								},
								],
								color: 16705372,

							}],
						}).catch();
						break;
					case 25:
						if (!guild.channels.cache.get(data.member)) return;

						if (auditLogEntry.targetType !== 'User') return;

						if (auditLogEntry.actionType !== 'Update') return;

						if (!guild.channels.cache.get(data.member).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.member).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						const addedRoles = auditLogEntry.changes.filter((x) => x.key === '$add')[0];
						const removedRoles = auditLogEntry.changes.filter((x) => x.key === '$remove')[0];

						if (!addedRoles && !removedRoles) return;

						if (addedRoles !== undefined && removedRoles !== undefined) {
							await guild.channels.cache.get(data.member).send({
								embeds: [{
									author: {
										name: auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username,
										icon_url: auditLogEntry.executor?.displayAvatarURL({ size: 2048 }),
									},
									title: 'Member Updated',
									description: `Member <@${auditLogEntry.target?.id}> updated by <@${auditLogEntry.executor?.id}>`,
									fields: [{
										name: 'Added roles',
										value: `${addedRoles.new.map((x) => `<@&${x.id}>`).join('\n')}`,
										inline: true,
									},
									{
										name: 'Removed roles',
										value: `${removedRoles.new.map((x) => `<@&${x.id}>`).join('\n')}`,
										inline: true,
									},
									],
									color: 16705372,
								}],
							}).catch();
						}
						else if (addedRoles !== undefined && removedRoles === undefined) {
							await guild.channels.cache.get(data.member).send({
								embeds: [{
									author: {
										name: auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username,
										icon_url: auditLogEntry.executor?.displayAvatarURL({ size: 2048 }),
									},
									title: 'Member Updated',
									description: `Member <@${auditLogEntry.target?.id}> updated by <@${auditLogEntry.executor?.id}>`,
									fields: [{
										name: 'Added roles',
										value: `${addedRoles.new.map((x) => `<@&${x.id}>`).join('\n')}`,
										inline: true,
									}],
									color: 3066993,
								}],
							}).catch();
						}
						else if (removedRoles !== undefined && addedRoles === undefined) {
							await guild.channels.cache.get(data.member).send({
								embeds: [{
									author: {
										name: auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username,
										icon_url: auditLogEntry.executor?.displayAvatarURL({ size: 2048 }),
									},
									title: 'Member Updated',
									description: `Member <@${auditLogEntry.target?.id}> updated by <@${auditLogEntry.executor?.id}>`,
									fields: [{
										name: 'Removed roles',
										value: `${removedRoles.new.map((x) => `<@&${x.id}>`).join('\n')}`,
										inline: true,
									}],
									color: 15158332,
								}],
							}).catch();
						}
						else return;
						break;
					case 30:
						if (!guild.channels.cache.get(data.role)) return;

						if (!guild.channels.cache.get(data.role).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.role).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						if (auditLogEntry.targetType !== 'Role') return;

						if (auditLogEntry.actionType !== 'Create') return;

						const perms = auditLogEntry.target?.permissions.toArray();
						let finalperms;
						if (perms?.includes('Administrator')) {
							finalperms = 'Administrator [All permission]';
						}
						else {
							const permstext = [];

							perms.forEach(permission => {
								const normalizedPermission = separateWords(permission);
								permstext.push(normalizedPermission);
							});

							finalperms = permstext.join(', ') || 'The role has no permissions.';
						}

						await guild.channels.cache.get(data.role).send({
							embeds: [{
								author: {
									name: auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username,
									icon_url: auditLogEntry.executor?.displayAvatarURL({ size: 2048 }),
								},
								description: `Role <@&${auditLogEntry.target?.id}> created by <@${auditLogEntry.executor?.id}>.`,
								fields: [{
									name: 'Name',
									value: `${auditLogEntry.target?.name} (ID: ${auditLogEntry.target?.id})`,
									inline: true,
								},
								{
									name: 'Color',
									value: `${auditLogEntry.target?.hexColor}`,
									inline: true,
								},
								{
									name: 'Mentionable',
									value: `${auditLogEntry.target?.mentionable ? '<:tick:968773535914922014>' : '<:cross:968773791943626762>'}`,
									inline: true,
								},
								{
									name: 'Displayed seperately',
									value: `${auditLogEntry.target?.hoist ? '<:tick:968773535914922014>' : '<:cross:968773791943626762>'}`,
									inline: true,
								},
								{
									name: 'Position',
									value: `${auditLogEntry.target?.position}`,
									inline: true,
								},
								{
									name: 'Permissions',
									value: finalperms,
									inline: true,
								},
								],
								color: 3066993,
								timestamp: new Date(Date.now()).toISOString(),
								footer: {
									text: `Powered by ${client.user?.globalName || client.user?.username}`,
									icon_url: client.user?.displayAvatarURL({ size: 2048 }),
								},
							}],
						}).catch();
						break;
					case 31:
						if (!guild.channels.cache.get(data.role)) return;

						if (!guild.channels.cache.get(data.role).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.role).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						if (auditLogEntry.targetType !== 'Role') return;

						if (auditLogEntry.actionType !== 'Update') return;

						await guild.channels.cache.get(data.role).send({
							embeds: [{
								author: {
									name: auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username,
									icon_url: auditLogEntry.executor?.displayAvatarURL({ size: 2048 }),
								},
								description: `Role <@&${auditLogEntry.target?.id}> updated by <@${auditLogEntry.executor?.id}>.`,
								fields: [{
									name: 'Name',
									value: `${auditLogEntry.target?.name} (ID: ${auditLogEntry.target?.id})`,
									inline: true,
								},
								{
									name: 'Old values',
									value: `${auditLogEntry.changes.map((x) => `${x.key.charAt(0).toUpperCase() + x.key.slice(1).toLowerCase()}: \`${x.old}\``).join('\n').replace(/undefined/g, 'None').replace(/`true`/g, '<:tick:968773535914922014>').replace(/`false`/g, '<:cross:968773791943626762>')}`,
									inline: true,
								},
								{
									name: 'New values',
									value: `${auditLogEntry.changes.map((x) => `${x.key.charAt(0).toUpperCase() + x.key.slice(1).toLowerCase()}: \`${x.new}\``).join('\n').replace(/undefined/g, 'None').replace(/`true`/g, '<:tick:968773535914922014>').replace(/`false`/g, '<:cross:968773791943626762>')}`,
									inline: true,
								},
								],
								color: 16705372,
								timestamp: new Date(Date.now()).toISOString(),
								footer: {
									text: `Powered by ${client.user?.globalName || client.user?.username}`,
									icon_url: client.user?.displayAvatarURL({ size: 2048 }),
								},
							}],
						}).catch();
						break;
					case 32:
						if (!guild.channels.cache.get(data.role)) return;

						if (!guild.channels.cache.get(data.role).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.role).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						if (auditLogEntry.targetType !== 'Role') return;

						if (auditLogEntry.actionType !== 'Delete') return;

						await guild.channels.cache.get(data.role).send({
							embeds: [{
								author: {
									name: auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username,
									icon_url: auditLogEntry.executor?.displayAvatarURL({ size: 2048 }),
								},
								description: `Role (${auditLogEntry.changes.filter(e => e.key === 'name').map(e => e.old).toString()}) deleted by <@${auditLogEntry.executor?.id}>.`,
								fields: [{
									name: 'Name',
									value: `${auditLogEntry.changes.filter(e => e.key === 'name').map(e => e.old).toString()} (ID: ${auditLogEntry.target?.id})`,
									inline: true,
								},
								{
									name: 'Color',
									value: `${auditLogEntry.changes.filter(e => e.key === 'color').map(e => e.old).toString()}`,
									inline: true,
								},
								{
									name: 'Mentionable',
									value: `${auditLogEntry.changes.filter(e => e.key === 'mentionable').map(e => e.old).toString() ? '<:tick:968773535914922014>' : '<:cross:968773791943626762>'}`,
									inline: true,
								},
								{
									name: 'Displayed seperately',
									value: `${auditLogEntry.changes.filter(e => e.key === 'hoist').map(e => e.old).toString() ? '<:tick:968773535914922014>' : '<:cross:968773791943626762>'}`,
									inline: true,
								},
								],
								color: 15158332,
								timestamp: new Date(Date.now()).toISOString(),
								footer: {
									text: `Powered by ${client.user?.globalName || client.user?.username}`,
									icon_url: client.user?.displayAvatarURL({ size: 2048 }),
								},
							}],
						}).catch();
						break;
					case 60:
						if (!guild.channels.cache.get(data.server)) return;

						if (!guild.channels.cache.get(data.server).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.server).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						if (auditLogEntry.targetType !== 'Emoji') return;

						if (auditLogEntry.actionType !== 'Create') return;

						await guild.channels.cache.get(data.server).send({
							embeds: [{
								author: {
									name: auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username,
									icon_url: auditLogEntry.executor?.displayAvatarURL({ size: 2048 }),
								},
								description: `Emoji [${auditLogEntry.target?.toString()}](https://cdn.discordapp.com/emojis/${auditLogEntry.target?.id}${auditLogEntry.target?.animated ? '.gif' : '.webp'}?size=${auditLogEntry.target?.animated ? '96' : '44'}&quality=lossless) added by <@${auditLogEntry.executor?.id}>`,
								color: 3066993,
								timestamp: new Date(Date.now()).toISOString(),
								footer: {
									text: `Powered by ${client.user?.globalName || client.user?.username}`,
									icon_url: client.user?.displayAvatarURL({ size: 2048 }),
								},
							}],
						}).catch();
						break;
					case 62:
						if (!guild.channels.cache.get(data.server)) return;

						if (!guild.channels.cache.get(data.server).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.server).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						if (auditLogEntry.targetType !== 'Emoji') return;

						if (auditLogEntry.actionType !== 'Delete') return;

						await guild.channels.cache.get(data.server).send({
							embeds: [{
								author: {
									name: auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username,
									icon_url: auditLogEntry.executor?.displayAvatarURL({ size: 2048 }),
								},
								description: `Emoji [\`${auditLogEntry.changes.filter(e => e.key === 'name').map(e => e.old).toString()}\`](https://cdn.discordapp.com/emojis/${auditLogEntry.target?.id}${auditLogEntry.target?.animated ? '.gif' : '.webp'}?size=${auditLogEntry.target?.animated ? '96' : '44'}&quality=lossless) removed by <@${auditLogEntry.executor?.id}>`,
								color: 15158332,
								timestamp: new Date(Date.now()).toISOString(),
								footer: {
									text: `Powered by ${client.user?.globalName || client.user?.username}`,
									icon_url: client.user?.displayAvatarURL({ size: 2048 }),
								},
							}],
						}).catch();
						break;
					case 90:
						if (!guild.channels.cache.get(data.server)) return;

						if (!guild.channels.cache.get(data.server).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.server).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						if (auditLogEntry.targetType !== 'Sticker') return;

						if (auditLogEntry.actionType !== 'Create') return;

						await guild.channels.cache.get(data.server).send({
							embeds: [{
								description: `Sticker [\`${auditLogEntry.target?.name}\`](https://cdn.discordapp.com/stickers/${auditLogEntry.target?.id}${auditLogEntry.target?.format === 1 ? '.png' : `${auditLogEntry.target?.format === 2 ? '.apng' : '.lottie'}`}) was added by <@${auditLogEntry.executor?.id}>`,
								image: {
									url: `https://cdn.discordapp.com/stickers/${auditLogEntry.target?.id}${auditLogEntry.target?.format === 1 ? '.png' : `${auditLogEntry.target?.format === 2 ? '.apng' : '.lottie'}`}`,
								},
								color: 3066993,
							}],
						}).catch();
						break;
					case 92:
						if (!guild.channels.cache.get(data.server)) return;

						if (!guild.channels.cache.get(data.server).permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) || !guild.channels.cache.get(data.server).permissionsFor(client.user).has(PermissionsBitField.Flags.EmbedLinks)) return;

						if (auditLogEntry.targetType !== 'Sticker') return;

						if (auditLogEntry.actionType !== 'Delete') return;

						await guild.channels.cache.get(data.server).send({
							embeds: [{
								description: `Sticker [\`${auditLogEntry.target?.name}\`](https://cdn.discordapp.com/stickers/${auditLogEntry.target?.id}${auditLogEntry.target?.format === 1 ? '.png' : `${auditLogEntry.target?.format === 2 ? '.apng' : '.lottie'}`}) was removed by <@${auditLogEntry.executor?.id}>`,
								image: {
									url: `https://cdn.discordapp.com/stickers/${auditLogEntry.target?.id}${auditLogEntry.target?.format === 1 ? '.png' : `${auditLogEntry.target?.format === 2 ? '.apng' : '.lottie'}`}`,
								},
								color: 15158332,
							}],
						}).catch();
						break;
				}
			}
			else return;
		});
	},
});