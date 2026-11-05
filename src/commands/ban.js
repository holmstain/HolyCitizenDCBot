import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { translate } from "../services/i18n.js";

const banCommand = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Üyenin sunucuya girişini yasaklar")
    .setDescriptionLocalizations({ "en-US": "Bans a member from the server" })
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("Yasaklanacak üye").setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Yasaklama sebebi").setRequired(true),
    ),

  execute: async (_client, interaction) => {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply({ content: translate(interaction.locale, "banPermission"), ephemeral: true });
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
      await interaction.editReply(translate(interaction.locale, "banOwner"));
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
    await targetMember.ban({ reason });
    await interaction.editReply(translate(interaction.locale, "banDone", { user: targetMember.user.tag, reason }));
  },
};

export default banCommand;