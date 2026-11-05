import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { translate } from "../services/i18n.js";

const descriptionKeys = {
  ban: "commandBan",
  basvuru: "commandBasvuru",
  clear: "commandClear",
  destek: "commandDestek",
  help: "commandHelp",
  kapat: "commandKapat",
  kick: "commandKick",
  level: "commandLevel",
  ping: "commandPing",
};

const helpcommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Kullanılabilir komutları listeler")
    .setDescriptionLocalizations({ "en-US": "Lists the available commands" }),

  execute: async (client, interaction) => {
    const fields = client.commands.map(({ data }) => ({
      name: `/${data.name}`,
      value: translate(interaction.locale, descriptionKeys[data.name]),
      inline: false,
    }));

    const embed = new EmbedBuilder()
      .setAuthor({ name: "HolyCitizen Bot" })
      .setColor(0x0099ff)
      .setDescription(translate(interaction.locale, "helpAvailable"))
      .setTitle(translate(interaction.locale, "helpTitle"))
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(fields)
      .setTimestamp()
      .setFooter({ text: "Holmstain Tarafından Oluşturuldu 💚💚💚" });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

export default helpcommand;