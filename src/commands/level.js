import { SlashCommandBuilder } from "discord.js";
import { xpForNextLevel } from "../services/leveling.js";
import { translate } from "../services/i18n.js";

const levelCommand = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Senin veya başka bir üyenin seviyesini gösterir")
    .setDescriptionLocalizations({ "en-US": "Shows your level or another member's level" })
    .addUserOption((option) =>
      option.setName("user").setDescription("Seviyesini görmek istediğin üye"),
    ),

  execute: async (client, interaction) => {
    const target = interaction.options.getUser("user") ?? interaction.user;
    const record = await client.leveling.get(interaction.guildId, target.id);

    if (!record) {
      await interaction.reply({
        content: translate(interaction.locale, "levelMissing", { user: target }),
        ephemeral: true,
      });
      return;
    }

    const level = record.level ?? 0;
    await interaction.reply({
      content: translate(interaction.locale, "levelStatus", {
        user: target,
        level,
        xp: record.xp,
        nextXp: xpForNextLevel(level),
        messages: record.messages,
      }),
      ephemeral: true,
    });
  },
};

export default levelCommand;