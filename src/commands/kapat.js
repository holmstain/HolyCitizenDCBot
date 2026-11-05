import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { translate } from "../services/i18n.js";

const closeTicketCommand = {
  data: new SlashCommandBuilder()
    .setName("kapat")
    .setDescription("Bu destek kanalını kapatır")
    .setDescriptionLocalizations({ "en-US": "Closes this support channel" }),

  execute: async (_client, interaction) => {
    const ownerId = interaction.channel.topic?.match(/^ticket-owner:(\d+)$/)?.[1];
    const isSupport = interaction.memberPermissions?.has(PermissionFlagsBits.ManageChannels);
    if (!ownerId || (ownerId !== interaction.user.id && !isSupport)) {
      await interaction.reply({ content: translate(interaction.locale, "closeDenied"), ephemeral: true });
      return;
    }

    await interaction.reply({ content: translate(interaction.locale, "closeDone"), ephemeral: true });
    await interaction.channel.delete(`Destek talebi ${interaction.user.tag} tarafından kapatıldı`);
  },
};

export default closeTicketCommand;