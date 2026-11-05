import {
  ActionRowBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { translate } from "../services/i18n.js";

const applicationCommand = {
  data: new SlashCommandBuilder()
    .setName("basvuru")
    .setDescription("Yetkili ekibine başvuru formu gönderir")
    .setDescriptionLocalizations({ "en-US": "Submits an application to the staff team" }),

  execute: async (_client, interaction) => {
    const modal = new ModalBuilder()
      .setCustomId("application:submit")
      .setTitle(translate(interaction.locale, "applicationTitle"))
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("motivation")
            .setLabel(translate(interaction.locale, "motivationLabel"))
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1000)
            .setRequired(true),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("experience")
            .setLabel(translate(interaction.locale, "experienceLabel"))
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1000)
            .setRequired(true),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("contribution")
            .setLabel(translate(interaction.locale, "contributionLabel"))
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1000)
            .setRequired(true),
        ),
      );

    await interaction.showModal(modal);
  },
};

export default applicationCommand;