import {
  createApplicationReview,
  handleApplicationDecision,
} from "../services/workflows.js";
import { translate } from "../services/i18n.js";

const interactionCreate = async (client, interaction) => {
  if (!interaction.guildId) {
    return;
  }

  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) {
        await command.execute(client, interaction);
      }
      return;
    }

    if (interaction.isModalSubmit?.() && interaction.customId === "application:submit") {
      await createApplicationReview(interaction);
      await interaction.reply({ content: translate(interaction.locale, "applicationSent"), ephemeral: true });
      return;
    }

    if (interaction.isButton?.() && interaction.customId.startsWith("application:")) {
      await handleApplicationDecision(interaction);
    }
  } catch (error) {
    console.error(`[INTERACTION] ${interaction.customId ?? interaction.commandName} başarısız.`, error);

    const response = {
      content: translate(interaction.locale, "genericError"),
      ephemeral: true,
    };

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(response);
    } else {
      await interaction.reply(response);
    }
  }
};

export default interactionCreate;