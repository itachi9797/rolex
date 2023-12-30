const Component = require('../../Structures/Core/Component');
const db = require('../../Database/Schemas/antinuke');
const Owners = require('../../Database/Schemas/owners');
const { UserFlagsBitField, PermissionsBitField } = require('discord.js');

module.exports = new Component({
	name: 'guildAuditLogEntryCreate',
	/**
     * @param {Rolex} client
     */
	run: async (client, auditLogEntry, guild) => {
		if (auditLogEntry === undefined) return;

		let executor;
		if (guild.members.cache.get(auditLogEntry.executor?.id) === undefined) {
			try {
				executor = await guild.members.fetch(auditLogEntry.executor?.id);
			}
			catch {
				return;
			}
		}
		else {
			executor = guild.members.cache.get(auditLogEntry.executor?.id);
		}

		if (executor === undefined) return;

		if (auditLogEntry.executor?.id === client.user?.id) return;

		if (auditLogEntry.executor?.id === guild.ownerId) return;

		const owner_data = await Owners.findOne({
			Guild: guild.id,
		});

		if (owner_data && owner_data.additional_owners.includes(auditLogEntry.executor?.id)) return;

		await db.findOne({
			Guild: guild.id,
		}).then(async (data) => {
			if (data) {
				if (data.whitelist.includes(auditLogEntry.executor?.id)) return;
				switch (auditLogEntry.action) {
					case 1:
						switch (data.antiserver) {
							case true:
								if (auditLogEntry.changes[0].key === 'owner_id') return;

								if (auditLogEntry.targetType !== 'Guild') return;

								if (auditLogEntry.actionType !== 'Update') return;

								if (auditLogEntry.changes.map(e => e.key) === 'vanity_url_code') {
									switch (data.punishment.toLowerCase()) {
										case 'ban':
											if (executor?.bannable) {
												try {
													await executor?.ban({
														reason: 'Vanity Update | Not Whitelisted!',
													});
												}
												catch {
													return;
												}
											}
											break;
										case 'kick':
											if (executor?.kickable) {
												try {
													await executor?.kick({
														reason: 'Vanity Update | Not Whitelisted!',
													});
												}
												catch {
													return;
												}
											}
											break;
									}
								}
								else {
									switch (data.punishment.toLowerCase()) {
										case 'ban':
											if (executor?.bannable) {
												try {
													await executor?.ban({
														reason: 'Server Update | Not Whitelisted!',
													});
												}
												catch {
													return;
												}
											}
											if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) return;
											try {
												await guild.edit({
													name: auditLogEntry.changes.filter(e => e.key === 'name').map(e => e.old).toString() || guild.name,
													icon: auditLogEntry.changes.filter(e => e.key === 'icon_hash').map(e => e.old) ? `https://cdn.discordapp.com/icons/${auditLogEntry.target?.id}/${auditLogEntry.changes.filter(e => e.key === 'icon_hash').map(e => e.old).toString()}${auditLogEntry.changes.filter(e => e.key === 'icon_hash').map(e => e.old).toString().startsWith('a_') ? '.gif' : '.png'}` : guild.iconURL(),
													verificationLevel: parseInt(auditLogEntry.changes.filter(e => e.key === 'verification_level').map(e => e.old).toString()) || auditLogEntry.target?.verificationLevel,
													explicitContentFilter: parseInt(auditLogEntry.changes.filter(e => e.key === 'explicit_content_filter').map(e => e.old).toString()) || auditLogEntry.target?.explicitContentFilter,
													afkChannel: auditLogEntry.changes.filter(e => e.key === 'afk_channel_id').map(e => e.old).toString() || auditLogEntry.target?.afkChannelId,
													systemChannel: auditLogEntry.changes.filter(e => e.key === 'system_channel_id').map(e => e.old).toString() || auditLogEntry.target?.systemChannelId,
													afkTimeout: parseInt(auditLogEntry.changes.filter(e => e.key === 'afk_timeout').map(e => e.old).toString()) || auditLogEntry.target?.afkTimeout,
													defaultMessageNotifications: parseInt(auditLogEntry.changes.filter(e => e.key === 'default_message_notifications').map(e => e.old).toString()) || auditLogEntry.target?.defaultMessageNotifications,
													systemChannelFlags: parseInt(auditLogEntry.changes.filter(e => e.key === 'system_channel_flags').map(e => e.old).toString()) || parseInt(auditLogEntry.target?.systemChannelFlags.bitfield),
													rulesChannel: auditLogEntry.changes.filter(e => e.key === 'rules_channel_id').map(e => e.old).toString() || auditLogEntry.target?.rulesChannelId,
													publicUpdatesChannel: auditLogEntry.changes.filter(e => e.key === 'public_updates_channel_id').map(e => e.old).toString() || auditLogEntry.target?.publicUpdatesChannelId,
													preferredLocale: auditLogEntry.changes.filter(e => e.key === 'preferred_locale').map(e => e.old).toString() || auditLogEntry.target?.preferredLocale,
													premiumProgressBarEnabled: Boolean(auditLogEntry.changes.filter(e => e.key === 'premium_progress_bar_enabled').map(e => e.old).toString()) || auditLogEntry.target?.premiumProgressBarEnabled,
													description: auditLogEntry.changes.filter(e => e.key === 'description').map(e => e.old).toString() || auditLogEntry.target?.description,
													features: auditLogEntry.changes.filter(e => e.key === 'features').map(e => e.old) || auditLogEntry.target?.features,
												}, `Reverted to previous condition, got updated by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`);
											}
											catch {
												return;
											}
											break;
										case 'kick':
											if (executor?.kickable) {
												try {
													await executor?.kick({
														reason: 'Server Update | Not Whitelisted!',
													});
												}
												catch {
													return;
												}
											}
											if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) return;
											try {
												await guild.edit({
													name: auditLogEntry.changes.filter(e => e.key === 'name').map(e => e.old).toString() || guild.name,
													icon: auditLogEntry.changes.filter(e => e.key === 'icon_hash').map(e => e.old) ? `https://cdn.discordapp.com/icons/${auditLogEntry.target?.id}/${auditLogEntry.changes.filter(e => e.key === 'icon_hash').map(e => e.old).toString()}${auditLogEntry.changes.filter(e => e.key === 'icon_hash').map(e => e.old).toString().startsWith('a_') ? '.gif' : '.png'}` : guild.iconURL(),
													verificationLevel: parseInt(auditLogEntry.changes.filter(e => e.key === 'verification_level').map(e => e.old).toString()) || auditLogEntry.target?.verificationLevel,
													explicitContentFilter: parseInt(auditLogEntry.changes.filter(e => e.key === 'explicit_content_filter').map(e => e.old).toString()) || auditLogEntry.target?.explicitContentFilter,
													afkChannel: auditLogEntry.changes.filter(e => e.key === 'afk_channel_id').map(e => e.old).toString() || auditLogEntry.target?.afkChannelId,
													systemChannel: auditLogEntry.changes.filter(e => e.key === 'system_channel_id').map(e => e.old).toString() || auditLogEntry.target?.systemChannelId,
													afkTimeout: parseInt(auditLogEntry.changes.filter(e => e.key === 'afk_timeout').map(e => e.old).toString()) || auditLogEntry.target?.afkTimeout,
													defaultMessageNotifications: parseInt(auditLogEntry.changes.filter(e => e.key === 'default_message_notifications').map(e => e.old).toString()) || auditLogEntry.target?.defaultMessageNotifications,
													systemChannelFlags: parseInt(auditLogEntry.changes.filter(e => e.key === 'system_channel_flags').map(e => e.old).toString()) || parseInt(auditLogEntry.target?.systemChannelFlags.bitfield),
													rulesChannel: auditLogEntry.changes.filter(e => e.key === 'rules_channel_id').map(e => e.old).toString() || auditLogEntry.target?.rulesChannelId,
													publicUpdatesChannel: auditLogEntry.changes.filter(e => e.key === 'public_updates_channel_id').map(e => e.old).toString() || auditLogEntry.target?.publicUpdatesChannelId,
													preferredLocale: auditLogEntry.changes.filter(e => e.key === 'preferred_locale').map(e => e.old).toString() || auditLogEntry.target?.preferredLocale,
													premiumProgressBarEnabled: Boolean(auditLogEntry.changes.filter(e => e.key === 'premium_progress_bar_enabled').map(e => e.old).toString()) || auditLogEntry.target?.premiumProgressBarEnabled,
													description: auditLogEntry.changes.filter(e => e.key === 'description').map(e => e.old).toString() || auditLogEntry.target?.description,
													features: auditLogEntry.changes.filter(e => e.key === 'features').map(e => e.old) || auditLogEntry.target?.features,
												}, `Reverted to previous condition, got updated by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`);
											}
											catch {
												return;
											}

											break;
									}
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 10:
						switch (data.antiChannelCreate) {
							case true:
								if (auditLogEntry.actionType !== 'Create') return;

								if (auditLogEntry.targetType !== 'Channel') return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Channel Create | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (guild.channels.cache.get(auditLogEntry.target?.id)?.deletable) {
											try {
												await guild.channels.cache.get(auditLogEntry.target?.id)?.delete({
													reason: `The channel got created by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
												}).catch();
											}
											catch {
												return;
											}
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Channel Create | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (guild.channels.cache.get(auditLogEntry.target?.id)?.deletable) {
											try {
												await guild.channels.cache.get(auditLogEntry.target?.id)?.delete({
													reason: `The channel got created by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
												}).catch();
											}
											catch {
												return;
											}
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 11:
						switch (data.antiChannelUpdate) {
							case true:

								if (auditLogEntry.targetType !== 'Channel') return;

								if (auditLogEntry.actionType !== 'Update') return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Channel Update | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										if (!guild.channels.cache.get(auditLogEntry.target?.id)?.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.ManageChannels) && !guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return;

										try {
											await guild.channels.cache.get(auditLogEntry.target?.id)?.edit({
												name: auditLogEntry.changes.filter(e => e.key === 'name').map(e => e.old).toString() || null,
												topic: auditLogEntry.changes.filter(e => e.key === 'topic').map(e => e.old).toString() || null,
												nsfw: auditLogEntry.changes.filter(e => e.key === 'nsfw').map(e => e.old).toString() || null,
												bitrate: auditLogEntry.changes.filter(e => e.key === 'bitrate').map(e => e.old).toString() || null,
												userLimit: auditLogEntry.changes.filter(e => e.key === 'user_limit').map(e => e.old).toString() || null,
												permissionOverwrites: auditLogEntry.changes.filter(e => e.key === 'permission_overwrites').map(e => e.old).toString() || null,
												rateLimitPerUser: auditLogEntry.changes.filter(e => e.key === 'rate_limit_per_user').map(e => e.old).toString() || null,
												rtcRegion: auditLogEntry.changes.filter(e => e.key === 'rtc_region').map(e => e.old).toString() || null,
												videoQualityMode: auditLogEntry.changes.filter(e => e.key === 'video_quality_mode').map(e => e.old).toString() || null,
												reason: `Channel got updated by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Channel Update | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										if (!guild.channels.cache.get(auditLogEntry.target?.id)?.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.ManageChannels) && !guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return;
										try {
											await guild.channels.cache.get(auditLogEntry.target?.id)?.edit({
												name: auditLogEntry.changes.filter(e => e.key === 'name').map(e => e.old).toString() || null,
												topic: auditLogEntry.changes.filter(e => e.key === 'topic').map(e => e.old).toString() || null,
												nsfw: auditLogEntry.changes.filter(e => e.key === 'nsfw').map(e => e.old).toString() || null,
												bitrate: auditLogEntry.changes.filter(e => e.key === 'bitrate').map(e => e.old).toString() || null,
												userLimit: auditLogEntry.changes.filter(e => e.key === 'user_limit').map(e => e.old).toString() || null,
												permissionOverwrites: auditLogEntry.changes.filter(e => e.key === 'permission_overwrites').map(e => e.old).toString() || null,
												rateLimitPerUser: auditLogEntry.changes.filter(e => e.key === 'rate_limit_per_user').map(e => e.old).toString() || null,
												rtcRegion: auditLogEntry.changes.filter(e => e.key === 'rtc_region').map(e => e.old).toString() || null,
												videoQualityMode: auditLogEntry.changes.filter(e => e.key === 'video_quality_mode').map(e => e.old).toString() || null,
												reason: `Channel got updated by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 12:
						switch (data.antiChannelDelete) {
							case true:

								if (auditLogEntry.actionType !== 'Delete') return;

								if (auditLogEntry.targetType !== 'Channel') return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Channel Delete | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return;
										try {
											await guild.channels.create({
												name: auditLogEntry.target?.name,
												type: auditLogEntry.target?.type || null,
												topic: auditLogEntry.target?.topic || null,
												nsfw: auditLogEntry.target?.nsfw || null,
												bitrate: auditLogEntry.target?.bitrate || null,
												userLimit: auditLogEntry.target?.userLimit || null,
												permissionOverwrites: auditLogEntry.target?.permissionOverwrites || null,
												rateLimitPerUser: auditLogEntry.target?.rateLimitPerUser || null,
												rtcRegion: auditLogEntry.target?.rtcRegion || null,
												reason: `Channel got deleted by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Channel Delete | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return;
										try {
											await guild.channels.create({
												name: auditLogEntry.target?.name,
												type: auditLogEntry.target?.type || null,
												topic: auditLogEntry.target?.topic || null,
												nsfw: auditLogEntry.target?.nsfw || null,
												bitrate: auditLogEntry.target?.bitrate || null,
												userLimit: auditLogEntry.target?.userLimit || null,
												permissionOverwrites: auditLogEntry.target?.permissionOverwrites || null,
												rateLimitPerUser: auditLogEntry.target?.rateLimitPerUser || null,
												rtcRegion: auditLogEntry.target?.rtcRegion || null,
												reason: `Channel got deleted by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 20:
						switch (data.antikick) {
							case true:

								if (auditLogEntry.targetType !== 'User') return;

								if (auditLogEntry.actionType !== 'Delete') return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Member Kick | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Member Kick | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 21:
						switch (data.antiprune) {
							case true:

								if (auditLogEntry.targetType !== 'User') return;

								if (auditLogEntry.actionType !== 'Delete') return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Member Prune | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Member Prune | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 22:
						switch (data.antiban) {
							case true:

								if (auditLogEntry.targetType !== 'User') return;

								if (auditLogEntry.actionType !== 'Delete') return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Member Ban | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return;
										try {
											await guild.members.unban(auditLogEntry.target?.id, `Member unbanned, banned by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`);
										}
										catch {
											return;
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Member Ban | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return;
										try {
											await guild.members.unban(auditLogEntry.target?.id, `Member unbanned, banned by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`);
										}
										catch {
											return;
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 23:
						switch (data.antiunban) {
							case true:

								if (auditLogEntry.targetType !== 'User') return;

								if (auditLogEntry.actionType !== 'Create') return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Member Unban | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return;
										try {
											await guild.members.ban(auditLogEntry.target?.id, {
												reason: `Banned member, unbanned by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Member Unban | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return;
										try {
											await guild.members.ban(auditLogEntry.target?.id, {
												reason: `Banned member, unbanned by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 25:
						switch (data.antimember) {
							case true:
								let target;
								if (guild.members.cache.get(auditLogEntry.target?.id) === undefined) {
									try {
										target = await guild.members.fetch(auditLogEntry.target?.id);
									}
									catch {
										return;
									}
								}
								else {
									target = guild.members.cache.get(auditLogEntry.target?.id);
								}
								if (client.guilds.cache.get(guild.id) === undefined) return;

								if (auditLogEntry.targetType !== 'User') return;

								if (auditLogEntry.actionType !== 'Update') return;

								const removedRoles = [];
								const addedRoles = [];

								const dangerousPermissions = [
									PermissionsBitField.Flags.Administrator,
									PermissionsBitField.Flags.BanMembers,
									PermissionsBitField.Flags.KickMembers,
									PermissionsBitField.Flags.ManageChannels,
									PermissionsBitField.Flags.ManageGuildExpressions,
									PermissionsBitField.Flags.ManageGuild,
									PermissionsBitField.Flags.ManageMessages,
									PermissionsBitField.Flags.ManageNicknames,
									PermissionsBitField.Flags.ManageRoles,
									PermissionsBitField.Flags.ManageWebhooks,
									PermissionsBitField.Flags.ManageThreads,
									PermissionsBitField.Flags.ManageEvents,
									PermissionsBitField.Flags.ModerateMembers,
									PermissionsBitField.Flags.MentionEveryone,
									PermissionsBitField.Flags.MoveMembers,
									PermissionsBitField.Flags.MuteMembers,
									PermissionsBitField.Flags.DeafenMembers,
									PermissionsBitField.Flags.ViewAuditLog,
									PermissionsBitField.Flags.ViewGuildInsights,
								];

								auditLogEntry.changes.forEach((change) => {
									if (change.key === '$remove') {
										for (let i = 0; i < change.new.length; i++) {
											if (guild.roles.cache.get(change.new[i].id) && guild.roles.cache.get(change.new[i].id).position < guild.members.me.roles.highest.position && !guild.roles.cache.get(change.new[i].id).managed && dangerousPermissions.some((p) => guild.roles.cache.get(change.new[i].id).permissions.has(p))) {
												removedRoles.push(guild.roles.cache.get(change.new[i].id));
											}
										}
									}

									if (change.key === '$add') {
										for (let i = 0; i < change.new.length; i++) {
											if (guild.roles.cache.get(change.new[i].id) && guild.roles.cache.get(change.new[i].id).position < guild.members.me.roles.highest.position && !guild.roles.cache.get(change.new[i].id).managed && dangerousPermissions.some((p) => guild.roles.cache.get(change.new[i].id).permissions.has(p))) {
												addedRoles.push(guild.roles.cache.get(change.new[i].id));
											}
										}
									}
								});

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable && (removedRoles.length > 0 || addedRoles.length > 0)) {
											try {
												await executor?.ban({
													reason: 'Member Roles Update | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return;

										if (removedRoles.length > 0) {
											try {
												await target?.roles.add(removedRoles, `Member roles updated, removed roles by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`);
											}
											catch {
												return;
											}
										}
										if (addedRoles.length > 0) {
											try {
												await target?.roles.remove(addedRoles, `Member roles updated, added roles by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`);
											}
											catch {
												return;
											}
										}
										break;
									case 'kick':
										if (executor?.kickable && (removedRoles.length > 0 || addedRoles.length > 0)) {
											try {
												await executor?.kick({
													reason: 'Member Roles Update | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return;

										if (removedRoles.length > 0) {
											try {
												await target?.roles.add(removedRoles, `Member roles updated, removed roles by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`);
											}
											catch {
												return;
											}
										}
										if (addedRoles.length > 0) {
											try {
												await target?.roles.remove(addedRoles, `Member roles updated, added roles by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`);
											}
											catch {
												return;
											}
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 28:
						switch (data.antibot) {
							case true:
								let target;
								if (guild.members.cache.get(auditLogEntry.target?.id) === undefined) {
									try {
										target = await guild.members.fetch(auditLogEntry.target?.id);
									}
									catch {
										return;
									}
								}
								else {
									target = guild.members.cache.get(auditLogEntry.target?.id);
								}
								if (auditLogEntry.actionType !== 'Create') return;

								if (auditLogEntry.targetType !== 'User') return;

								if (auditLogEntry.target?.id === client.user?.id) return;

								if (target?.user?.flags?.has(UserFlagsBitField.Flags.VerifiedBot)) return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Unverified Bot Add | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (target?.kickable) {
											try {
												await target?.ban({
													reason: `The bot that got added by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
												});
											}
											catch {
												return;
											}
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Unverified Bot Add | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (target?.kickable) {
											try {
												await target?.kick(`The bot that got added by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`);
											}
											catch {
												return;
											}
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 30:
						switch (data.antiRoleCreate) {
							case true:
								if (auditLogEntry.targetType !== 'Role') return;

								if (auditLogEntry.actionType !== 'Create') return;

								if (auditLogEntry.target?.managed) return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Role Created | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles) && guild.roles.cache.get(auditLogEntry.target?.id).position < guild.members.me.roles.highest.position) return;

										try {
											await guild.roles.cache.get(auditLogEntry.target?.id)?.delete({
												reason: `Role deleted, created by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Role Created | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles && guild.roles.cache.get(auditLogEntry.target?.id).position < guild.members.me.roles.highest.position)) return;
										try {
											await guild.roles.cache.get(auditLogEntry.target?.id)?.delete({
												reason: `Role deleted, created by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
										break;
								}
								break;
							case false:
								return;
						}
						break;
					case 31:
						switch (data.antiRoleUpdate) {
							case true:

								if (auditLogEntry.targetType !== 'Role') return;

								if (auditLogEntry.actionType !== 'Update') return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Role Updated | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return;
										try {
											await guild.roles.cache.get(auditLogEntry.target?.id).edit({
												name: auditLogEntry.changes.filter(e => e.key === 'name').map(x => x.old).toString() || auditLogEntry.target?.name,
												color: parseInt(auditLogEntry.changes.filter(e => e.key === 'color').map(x => x.old).toString()) || auditLogEntry.target?.color,
												hoist: Boolean(auditLogEntry.changes.filter(e => e.key === 'hoist').map(x => x.old).toString()) || auditLogEntry.target?.hoist,
												permissions: auditLogEntry.changes.filter(e => e.key === 'permissions').map(x => x.old).toString() || auditLogEntry.target?.permissions,
												mentionable: Boolean(auditLogEntry.changes.filter(e => e.key === 'mentionable').map(x => x.old).toString()) || auditLogEntry.target?.mentionable,
												icon: auditLogEntry.changes.filter(e => e.key === 'icon').map(x => x.old).toString() || auditLogEntry.target?.icon,
												position: auditLogEntry.changes.filter(e => e.key === 'position').map(x => x.old).toString() || auditLogEntry.target?.position,
												unicodeEmoji: auditLogEntry.changes.filter(e => e.key === 'unicode_emoji').map(x => x.old).toString() || auditLogEntry.target?.unicodeEmoji,
											}, `Role updated to old state, new state caused by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`);
										}
										catch {
											return;
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Role Updated | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return;
										try {
											await guild.roles.cache.get(auditLogEntry.target?.id).edit({
												name: auditLogEntry.changes.filter(e => e.key === 'name').map(x => x.old).toString() || auditLogEntry.target?.name,
												color: parseInt(auditLogEntry.changes.filter(e => e.key === 'color').map(x => x.old).toString()) || auditLogEntry.target?.color,
												hoist: Boolean(auditLogEntry.changes.filter(e => e.key === 'hoist').map(x => x.old).toString()) || auditLogEntry.target?.hoist,
												permissions: auditLogEntry.changes.filter(e => e.key === 'permissions').map(x => x.old).toString() || auditLogEntry.target?.permissions,
												mentionable: Boolean(auditLogEntry.changes.filter(e => e.key === 'mentionable').map(x => x.old).toString()) || auditLogEntry.target?.mentionable,
												icon: auditLogEntry.changes.filter(e => e.key === 'icon').map(x => x.old).toString() || auditLogEntry.target?.icon,
												position: auditLogEntry.changes.filter(e => e.key === 'position').map(x => x.old).toString() || auditLogEntry.target?.position,
												unicodeEmoji: auditLogEntry.changes.filter(e => e.key === 'unicode_emoji').map(x => x.old).toString() || auditLogEntry.target?.unicodeEmoji,
											}, `Role updated to old state, new state caused by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`);
										}
										catch {
											return;
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 32:
						if (auditLogEntry.target?.managed) return;
						switch (data.antiRoleDelete) {
							case true:
								if (auditLogEntry.targetType !== 'Role') return;

								if (auditLogEntry.actionType !== 'Delete') return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Role Deleted | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return;
										try {
											await guild.roles.create({
												name: auditLogEntry.changes.filter(e => e.key === 'name').map(x => x.old).toString(),
												color: parseInt(auditLogEntry.changes.filter(e => e.key === 'color').map(x => x.old).toString()),
												hoist: Boolean(auditLogEntry.changes.filter(e => e.key === 'hoist').map(x => x.old).toString()),
												permissions: BigInt(auditLogEntry.changes.filter(e => e.key === 'permissions').map(x => x.old).toString()),
												mentionable: Boolean(auditLogEntry.changes.filter(e => e.key === 'mentionable').map(x => x.old).toString()),
												unicodeEmoji: auditLogEntry.changes.filter(e => e.key === 'unicode_emoji').map(x => x.old).toString() || null,
												reason: `Role created, deleted by (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Role Deleted | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return;
										try {
											await guild.roles.create({
												name: auditLogEntry.changes.filter(e => e.key === 'name').map(x => x.old).toString(),
												color: parseInt(auditLogEntry.changes.filter(e => e.key === 'color').map(x => x.old).toString()),
												hoist: Boolean(auditLogEntry.changes.filter(e => e.key === 'hoist').map(x => x.old).toString()),
												permissions: BigInt(auditLogEntry.changes.filter(e => e.key === 'permissions').map(x => x.old).toString()),
												mentionable: Boolean(auditLogEntry.changes.filter(e => e.key === 'mentionable').map(x => x.old).toString()),
												unicodeEmoji: auditLogEntry.changes.filter(e => e.key === 'unicode_emoji').map(x => x.old).toString() || null,
												reason: `Role created, deleted by (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 42:
						switch (data.antiInviteDelete) {
							case true:

								if (auditLogEntry.targetType !== 'Invite') return;

								if (auditLogEntry.actionType !== 'Delete') return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Invite Deleted | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Invite Deleted | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 50:
						switch (data.antiwebhookCreate) {
							case true:
								if (auditLogEntry.targetType !== 'Webhook') return;

								if (auditLogEntry.actionType !== 'Create') return;

								if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) return;

								const hookie = await guild.channels.cache.get(auditLogEntry.target?.channelId)?.fetchWebhooks();

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Webhook Create | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										try {
											hookie?.filter(e => e.id === auditLogEntry.target?.id).first()?.delete().catch();
										}
										catch {
											return;
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Webhook Create | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										try {
											hookie?.filter(e => e.id === auditLogEntry.target?.id).first()?.delete().catch();
										}
										catch {
											return;
										}
										break;
									case false:
										return;
									default:
										return;
								}
						}
						break;
					case 51:

						switch (data.antiwebhookUpdate) {
							case true:

								if (auditLogEntry.targetType !== 'Webhook') return;

								if (auditLogEntry.actionType !== 'Update') return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Webhook Update | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) return;
										const hookie_one = (await guild.fetchWebhooks()).filter(e => e.id === auditLogEntry.target?.id).first();
										if (!hookie_one) return;
										try {
											hookie_one?.edit({
												name: auditLogEntry.changes.filter(e => e.key === 'name').map(e => e.old).toString() || hookie_one?.name,
												avatar: auditLogEntry.changes.filter(e => e.key === 'avatar_hash').map(e => e.old) ? `https://cdn.discordapp.com/avatars/${auditLogEntry.target?.id}/${auditLogEntry.changes.filter(e => e.key === 'avatar_hash').map(e => e.old).toString()}.png` : hookie_one?.avatarURL(),
												channel: auditLogEntry.changes.filter(e => e.key === 'channel_id').map(e => e.old).toString() || hookie_one?.channelId,
											}, `Webhook updated to old state, New state caused by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`);
										}
										catch {
											return;
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Webhook Update | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) return;
										const hookie_two = (await guild.fetchWebhooks()).filter(e => e.id === auditLogEntry.target?.id).first();
										if (!hookie_two) return;
										try {
											hookie_two?.edit({
												name: auditLogEntry.changes.filter(e => e.key === 'name').map(e => e.old).toString() || hookie_two?.name,
												avatar: auditLogEntry.changes.filter(e => e.key === 'avatar_hash').map(e => e.old) ? `https://cdn.discordapp.com/avatars/${auditLogEntry.target?.id}/${auditLogEntry.changes.filter(e => e.key === 'avatar_hash').map(e => e.old).toString()}.png` : hookie_two?.avatarURL(),
												channel: auditLogEntry.changes.filter(e => e.key === 'channel_id').map(e => e.old).toString() || hookie_two?.channelId,
											}, `Webhook updated to old state, New state caused by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`);
										}
										catch {
											return;
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 52:
						switch (data.antiwebhookDelete) {
							case true:

								if (auditLogEntry.targetType !== 'Webhook') return;

								if (auditLogEntry.actionType !== 'Delete') return;
								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Webhook Delete | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) return;
										try {
											await guild.channels.createWebhook({
												channel: auditLogEntry.target?.channelId,
												name: auditLogEntry.target?.name,
												avatar: auditLogEntry.changes.filter(e => e.key === 'avatar_hash').map(e => e.old) ? `https://cdn.discordapp.com/avatars/${auditLogEntry.target?.id}/${auditLogEntry.changes.filter(e => e.key === 'avatar_hash').map(e => e.old).toString()}.png` : null,
												reason: `Webhook created, deleted by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Webhook Delete | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) return;
										try {
											await guild.channels.createWebhook({
												channel: auditLogEntry.target?.channelId,
												name: auditLogEntry.target?.name,
												avatar: auditLogEntry.changes.filter(e => e.key === 'avatar_hash').map(e => e.old) ? `https://cdn.discordapp.com/avatars/${auditLogEntry.target?.id}/${auditLogEntry.changes.filter(e => e.key === 'avatar_hash').map(e => e.old).toString()}.png` : null,
												reason: `Webhook created, deleted by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 62:
						switch (data.antiEmojiDelete) {
							case true:

								if (auditLogEntry.targetType !== 'Emoji') return;

								if (auditLogEntry.actionType !== 'Delete') return;
								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Emoji Deleted | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) return;
										await guild.emojis.create({
											attachment: `https://cdn.discordapp.com/emojis/${auditLogEntry.target?.id}.gif?size=44&quality=lossless`,
											name: auditLogEntry.changes.filter(e => e.key === 'name').map(e => e.old).toString(),
											reason: `The emoji got deleted by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
										}).catch(() => {
											return guild.emojis.create({
												attachment: `https://cdn.discordapp.com/emojis/${auditLogEntry.target?.id}.webp?size=44&quality=lossless`,
												name: auditLogEntry.changes.filter(e => e.key === 'name').map(e => e.old).toString(),
												reason: `The emoji got deleted by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											}).catch(() => {
												return;
											});
										});

										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Emoji Deleted | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) return;
										await guild.emojis.create({
											attachment: `https://cdn.discordapp.com/emojis/${auditLogEntry.target?.id}.gif?size=44&quality=lossless`,
											name: auditLogEntry.changes.filter(e => e.key === 'name').map(e => e.old).toString(),
											reason: `The emoji got deleted by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
										}).catch(() => {
											return guild.emojis.create({
												attachment: `https://cdn.discordapp.com/emojis/${auditLogEntry.target?.id}.webp?size=44&quality=lossless`,
												name: auditLogEntry.changes.filter(e => e.key === 'name').map(e => e.old).toString(),
												reason: `The emoji got deleted by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											}).catch(() => {
												return;
											});
										});
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					case 92:
						switch (data.antiEmojiDelete) {
							case true:
								if (auditLogEntry.targetType !== 'Sticker') return;

								if (auditLogEntry.actionType !== 'Delete') return;

								switch (data.punishment.toLowerCase()) {
									case 'ban':
										if (executor?.bannable) {
											try {
												await executor?.ban({
													reason: 'Sticker Deleted | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}
										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) return;
										try {
											await guild.stickers.create({
												file: `https://cdn.discordapp.com/stickers/${auditLogEntry.target?.id}${auditLogEntry.target?.format === 1 ? '.png' : `${auditLogEntry.target?.format === 2 ? '.apng' : '.lottie'}`}`,
												name: auditLogEntry.target?.name,
												description: auditLogEntry.target?.description,
												tags: auditLogEntry.target?.usernames,
												reason: `The sticker got deleted by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
										break;
									case 'kick':
										if (executor?.kickable) {
											try {
												await executor?.kick({
													reason: 'Sticker Deleted | Not Whitelisted!',
												});
											}
											catch {
												return;
											}
										}

										if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) return;
										try {
											await guild.stickers.create({
												file: `https://cdn.discordapp.com/stickers/${auditLogEntry.target?.id}${auditLogEntry.target?.format === 1 ? '.png' : `${auditLogEntry.target?.format === 2 ? '.apng' : '.lottie'}`}`,
												name: auditLogEntry.target?.name,
												description: auditLogEntry.target?.description,
												tags: auditLogEntry.target?.usernames,
												reason: `The sticker got deleted by ${auditLogEntry.executor?.globalName !== null ? auditLogEntry.executor?.globalName : auditLogEntry.executor?.username} (${auditLogEntry.executor?.id})`,
											});
										}
										catch {
											return;
										}
										break;
								}
								break;
							case false:
								return;
							default:
								return;
						}
						break;
					default:
						return;
				}
			}
			else return;

		});
	},
});