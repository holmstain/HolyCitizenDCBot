import { SlashCommandBuilder } from "discord.js";
import { createSupportTicket } from "../services/workflows.js";
import { translate } from "../services/i18n.js";
import { getGuildSettings } from "../services/guildSettings.js";

const supportCommand = {
  data: new SlashCommandBuilder()
    .setName("destek")
    .setDescription("Yetkililerle özel bir destek kanalı açar")
    .setDescriptionLocalizations({ "en-US": "Opens a private support channel with the team" }),

  execute: async (_client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { channel, created } = await createSupportTicket(
      interaction.guild,
      interaction.member,
      getGuildSettings(interaction.guildId).supportRoleId,
    );
    await interaction.editReply(
      created
        ? translate(interaction.locale, "supportCreated", { channel })
        : translate(interaction.locale, "supportExists", { channel }),
    );
  },
};

export default supportCommand;