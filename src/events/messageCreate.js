import { translate } from "../services/i18n.js";

const messageCreate = async (client, message) => {
  if (!message.guildId || message.author.bot) {
    return;
  }

  try {
    const result = await client.leveling.award(message.guildId, message.author.id);
    if (result.leveledUp) {
      await message.channel.send(
        translate(message.guild.preferredLocale, "levelUp", {
          user: message.author,
          level: result.record.level,
        }),
      );
    }
  } catch (error) {
    console.error(`[LEVELING] ${message.author.id} için XP verilemedi.`, error);
  }
};

export default messageCreate;