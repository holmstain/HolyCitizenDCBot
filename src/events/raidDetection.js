import { ChannelType } from "discord.js";
import { translate } from "../services/i18n.js";

export const createRaidDetector = ({
  threshold = Number(process.env.RAID_JOIN_THRESHOLD ?? 5),
  windowMs = Number(process.env.RAID_WINDOW_MS ?? 10_000),
  alertCooldownMs = 60_000,
  now = Date.now,
} = {}) => {
  const joinsByGuild = new Map();
  const lastAlertByGuild = new Map();

  return async (member) => {
    const currentTime = now();
    const recentJoins = (joinsByGuild.get(member.guild.id) ?? [])
      .filter((timestamp) => currentTime - timestamp <= windowMs);
    recentJoins.push(currentTime);
    joinsByGuild.set(member.guild.id, recentJoins);

    if (recentJoins.length < threshold) {
      return false;
    }

    const lastAlert = lastAlertByGuild.get(member.guild.id);
    if (lastAlert !== undefined && currentTime - lastAlert < alertCooldownMs) {
      return false;
    }

    const channel = member.guild.systemChannel ?? member.guild.channels.cache
      .filter((candidate) => candidate.type === ChannelType.GuildText)
      .sort((left, right) => left.rawPosition - right.rawPosition)
      .first();

    if (!channel) {
      return false;
    }

    lastAlertByGuild.set(member.guild.id, currentTime);
    await channel.send({
      content: translate(member.guild.preferredLocale, "raidAlert", {
        seconds: Math.round(windowMs / 1000),
        count: recentJoins.length,
      }),
      allowedMentions: { parse: [] },
    });
    return true;
  };
};

const detectRaid = createRaidDetector();

export const notifyRaidIfDetected = async (member) => {
  try {
    await detectRaid(member);
  } catch (error) {
    console.error(`[ANTI-RAID] ${member.guild.id} için uyarı gönderilemedi.`, error);
  }
};