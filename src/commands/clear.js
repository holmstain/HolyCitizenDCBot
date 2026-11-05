import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
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
    const messages = await interaction.channel.messages.fetch();
    await interaction.channel.bulkDelete(messages);
    await interaction.editReply({
      embeds: [new EmbedBuilder().setDescription(translate(interaction.locale, "clearDone"))],
    });
  },
};

export default clearCommand;
