import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { translate } from "../services/i18n.js";

const kickCommand = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Üyeyi sunucudan uzaklaştırır")
    .setDescriptionLocalizations({ "en-US": "Kicks a member from the server" })
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("Uzaklaştırılacak üye").setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Uzaklaştırma sebebi").setRequired(true),
    ),

  execute: async (_client, interaction) => {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.KickMembers)) {
      await interaction.reply({ content: translate(interaction.locale, "kickPermission"), ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    const targetMember = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason");

    if (!targetMember) {
      await interaction.editReply(translate(interaction.locale, "banNotFound"));
      return;
    }

    if (targetMember.id === interaction.guild.ownerId) {
      await interaction.editReply(translate(interaction.locale, "kickOwner"));
      return;
    }

    const requestMember = await interaction.guild.members.fetch(interaction.user.id);
    const botMember = await interaction.guild.members.fetchMe();

    if (targetMember.roles.highest.position >= requestMember.roles.highest.position) {
      await interaction.editReply(translate(interaction.locale, "banHierarchy"));
      return;
    }

    if (targetMember.roles.highest.position >= botMember.roles.highest.position) {
      await interaction.editReply(translate(interaction.locale, "botHierarchy"));
      return;
    }

    // Ban The targetUser
    await targetMember.kick(reason);
    await interaction.editReply(translate(interaction.locale, "kickDone", { user: targetMember.user.tag, reason }));
  },
};

export default kickCommand;