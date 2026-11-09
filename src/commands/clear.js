import {
  SnowflakeUtil,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { translate } from "../services/i18n.js";

const clearCommand = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Sohbeti temizler")
    .setDescriptionLocalizations({ "en-US": "Clears messages from this channel" })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  execute: async (_client, interaction) => {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
      await interaction.reply({ content: translate(interaction.locale, "clearPermission"), ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    const MAX_BULK_DELETE = 100;
    const MESSAGE_AGE_LIMIT_MS = 14 * 24 * 60 * 60 * 1000;

    const messages = await interaction.channel.messages.fetch({ limit: MAX_BULK_DELETE });
    const deletable = Array.from(messages.values())
      .filter(
        (message) => Date.now() - SnowflakeUtil.timestampFrom(message.id) < MESSAGE_AGE_LIMIT_MS,
      )
      .slice(0, MAX_BULK_DELETE);

    if (deletable.length === 0) {
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription(translate(interaction.locale, "clearNothing"))],
      });
      return;
    }

    await interaction.channel.bulkDelete(deletable);
    await interaction.editReply({
      embeds: [new EmbedBuilder().setDescription(translate(interaction.locale, "clearDone"))],
    });
  },
};

export default clearCommand;
