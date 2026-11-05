import { ChannelType } from "discord.js";
import { translate } from "../services/i18n.js";
import { getGuildSettings } from "../services/guildSettings.js";

export const welcomeMember = async (member, autoRoleId) => {
  if (member.user.bot) {
    return;
  }

  const configuredRoleId = autoRoleId ?? getGuildSettings(member.guild.id).autoRoleId;
  if (configuredRoleId) {
    try {
      await member.roles.add(configuredRoleId, translate(member.guild.preferredLocale, "autoRoleReason"));
    } catch (error) {
      console.error(`[WELCOME] Otomatik rol ${member.id} kullanıcısına atanamadı.`, error);
    }
  }

  const firstTextChannel = member.guild.channels.cache
    .filter((channel) => channel.type === ChannelType.GuildText)
    .sort((left, right) => left.rawPosition - right.rawPosition || left.id.localeCompare(right.id))
    .first();

  if (firstTextChannel) {
    await firstTextChannel.send({
      content: translate(member.guild.preferredLocale, "welcome", { user: member }),
      allowedMentions: { users: [member.id] },
    });
  }
};

const guildMemberAdd = async (member) => {
  try {
    await welcomeMember(member);
  } catch (error) {
    console.error(`[WELCOME] ${member.id} için işlem başarısız.`, error);
  }
};

export default guildMemberAdd;