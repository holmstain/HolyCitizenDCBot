export const getGuildSettings = (guildId) => {
  let settingsByGuild = {};
  if (process.env.GUILD_SETTINGS) {
    settingsByGuild = JSON.parse(process.env.GUILD_SETTINGS);
    if (!settingsByGuild || typeof settingsByGuild !== "object" || Array.isArray(settingsByGuild)) {
      throw new TypeError("GUILD_SETTINGS bir sunucu ayarları JSON nesnesi olmalı.");
    }
  }

  return {
    autoRoleId: process.env.AUTO_ROLE_ID,
    supportRoleId: process.env.SUPPORT_ROLE_ID,
    applicationReviewChannelId: process.env.APPLICATION_REVIEW_CHANNEL_ID,
    approvedRoleId: process.env.APPROVED_ROLE_ID,
    ...settingsByGuild[guildId],
  };
};