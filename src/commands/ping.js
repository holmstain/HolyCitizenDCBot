import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { translate } from "../services/i18n.js";

const pingcommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botun bağlantı gecikmesini gösterir")
    .setDescriptionLocalizations({ "en-US": "Shows the bot connection latency" }),

  execute: async (client, interaction) => {
    await interaction.reply({
      embeds: [new EmbedBuilder().setDescription(translate(interaction.locale, "pingOutput", { ping: client.ws.ping }))],
      ephemeral: true,
    });
  },
};

export default pingcommand;