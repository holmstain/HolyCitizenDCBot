import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { translate } from "./i18n.js";
import { getGuildSettings } from "./guildSettings.js";

export const createSupportTicket = async (guild, member, supportRoleId) => {
  const topic = `ticket-owner:${member.id}`;
  const existing = guild.channels.cache.find((channel) => channel.topic === topic);
  if (existing) {
    return { channel: existing, created: false };
  }

  const permissionOverwrites = [
    {
      id: guild.roles.everyone.id,
      deny: [PermissionFlagsBits.ViewChannel],
    },
    {
      id: member.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    },
  ];

  if (supportRoleId && guild.roles.cache.has(supportRoleId)) {
    permissionOverwrites.push({
      id: supportRoleId,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    });
  }

  const channel = await guild.channels.create({
    name: `destek-${member.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 90),
    type: ChannelType.GuildText,
    topic,
    permissionOverwrites,
  });

  return { channel, created: true };
};

export const createApplicationReview = async (interaction) => {
  const reviewChannelId = getGuildSettings(interaction.guildId).applicationReviewChannelId;
  if (!reviewChannelId) {
    throw new Error("APPLICATION_REVIEW_CHANNEL_ID yapılandırılmamış.");
  }

  const reviewChannel = await interaction.guild.channels.fetch(reviewChannelId);
  if (!reviewChannel?.isTextBased()) {
    throw new Error("Başvuru inceleme kanalı bulunamadı.");
  }

  const answers = [
    ["motivation", "motivationLabel"],
    ["experience", "experienceLabel"],
    ["contribution", "contributionLabel"],
  ].map(([key, label]) => ({
    name: translate(interaction.locale, label),
    value: interaction.fields.getTextInputValue(key).slice(0, 1024),
  }));
  const embed = new EmbedBuilder()
    .setTitle(`Başvuru: ${interaction.user.tag}`)
    .setDescription(`Başvuran: <@${interaction.user.id}>`)
    .addFields(answers)
    .setTimestamp();
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`application:approve:${interaction.user.id}`)
      .setLabel(translate(interaction.locale, "approve"))
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`application:reject:${interaction.user.id}`)
      .setLabel(translate(interaction.locale, "reject"))
      .setStyle(ButtonStyle.Danger),
  );

  await reviewChannel.send({
    embeds: [embed],
    components: [row],
    allowedMentions: { users: [interaction.user.id] },
  });
};

export const handleApplicationDecision = async (interaction) => {
  const [, decision, userId] = interaction.customId.split(":");
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageRoles)) {
    await interaction.reply({ content: translate(interaction.locale, "applicationDenied"), ephemeral: true });
    return;
  }

  if (decision === "approve") {
    const roleId = getGuildSettings(interaction.guildId).approvedRoleId;
    if (!roleId) {
      await interaction.reply({ content: translate(interaction.locale, "applicationRoleMissing"), ephemeral: true });
      return;
    }

    const role = await interaction.guild.roles.fetch(roleId);
    const botMember = await interaction.guild.members.fetchMe();
    if (!role || role.position >= (botMember.roles.highest?.position ?? 0)) {
      await interaction.reply({ content: translate(interaction.locale, "applicationRoleInvalid"), ephemeral: true });
      return;
    }

    const member = await interaction.guild.members.fetch(userId).catch(() => null);
    if (!member) {
      await interaction.reply({ content: translate(interaction.locale, "applicationMemberMissing"), ephemeral: true });
      return;
    }

    await member.roles.add(role, `Başvuru ${interaction.user.tag} tarafından onaylandı`);
  }

  await interaction.update({
    content: translate(
      interaction.locale,
      decision === "approve" ? "applicationApproved" : "applicationRejected",
      { user: interaction.user },
    ),
    components: [],
  });
};