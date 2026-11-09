export const getGuildSettings = (guildId) => {
  let settingsByGuild = {};
  if (process.env.GUILD_SETTINGS) {
    try {
      settingsByGuild = JSON.parse(process.env.GUILD_SETTINGS);
    } catch (error) {
      console.error("[GUILD_SETTINGS] GUILD_SETTINGS JSON çözümlenemedi, ortam değişkeni fallback kullanılıyor.");
      settingsByGuild = {};
    }
    if (!settingsByGuild || typeof settingsByGuild !== "object" || Array.isArray(settingsByGuild)) {
      settingsByGuild = {};
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