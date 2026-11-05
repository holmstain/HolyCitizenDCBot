import assert from "node:assert/strict";
import { PermissionFlagsBits } from "discord.js";
import test from "node:test";
import {
  createApplicationReview,
  createSupportTicket,
  handleApplicationDecision,
} from "../src/services/workflows.js";

test("creates a private support ticket only once per member", async () => {
  const channels = [];
  const createdOptions = [];
  const guild = {
    roles: {
      everyone: { id: "guild-1" },
      cache: { has: (roleId) => roleId === "support-role" },
    },
    channels: {
      cache: { find: (predicate) => channels.find(predicate) },
      create: async (options) => {
        const channel = { ...options };
        channels.push(channel);
        createdOptions.push(options);
        return channel;
      },
    },
  };
  const member = { id: "123", user: { username: "Citizen" } };

  const first = await createSupportTicket(guild, member, "support-role");
  const second = await createSupportTicket(guild, member, "support-role");
  const overwrites = createdOptions[0].permissionOverwrites;

  assert.equal(first.created, true);
  assert.equal(second.created, false);
  assert.equal(createdOptions.length, 1);
  assert.deepEqual(overwrites[0].deny, [PermissionFlagsBits.ViewChannel]);
  assert.ok(overwrites.some(({ id, allow }) => id === member.id && allow.includes(PermissionFlagsBits.ViewChannel)));
  assert.ok(overwrites.some(({ id }) => id === "support-role"));
});

test("requires Manage Roles before approving an application", async () => {
  let replied;
  let granted = false;
  const previousRoleId = process.env.APPROVED_ROLE_ID;
  process.env.APPROVED_ROLE_ID = "approved-role";

  try {
    const interaction = {
      customId: "application:approve:applicant-1",
      memberPermissions: { has: () => false },
      reply: async (response) => { replied = response; },
      guild: {
        roles: { fetch: async () => ({ position: 1 }) },
        members: {
          fetchMe: async () => ({ roles: { highest: { position: 2 } } }),
          fetch: async () => ({ roles: { add: async () => { granted = true; } } }),
        },
      },
    };

    await handleApplicationDecision(interaction);

    assert.equal(replied.ephemeral, true);
    assert.equal(granted, false);
  } finally {
    if (previousRoleId === undefined) {
      delete process.env.APPROVED_ROLE_ID;
    } else {
      process.env.APPROVED_ROLE_ID = previousRoleId;
    }
  }
});

test("sends application answers and review buttons to the configured private channel", async () => {
  let reviewMessage;
  const previousSettings = process.env.GUILD_SETTINGS;
  process.env.GUILD_SETTINGS = JSON.stringify({
    "guild-1": { applicationReviewChannelId: "review-channel" },
  });

  try {
    const interaction = {
      locale: "en-US",
      guildId: "guild-1",
      user: { id: "applicant-1", tag: "Applicant#0001" },
      fields: { getTextInputValue: (key) => `answer-${key}` },
      guild: {
        channels: {
          fetch: async (id) => ({
            id,
            isTextBased: () => true,
            send: async (message) => { reviewMessage = message; },
          }),
        },
      },
    };

    await createApplicationReview(interaction);

    assert.equal(reviewMessage.embeds[0].data.fields.length, 3);
    assert.equal(reviewMessage.components[0].components[0].data.custom_id, "application:approve:applicant-1");
    assert.equal(reviewMessage.components[0].components[1].data.custom_id, "application:reject:applicant-1");
    assert.deepEqual(reviewMessage.allowedMentions, { users: ["applicant-1"] });
  } finally {
    if (previousSettings === undefined) {
      delete process.env.GUILD_SETTINGS;
    } else {
      process.env.GUILD_SETTINGS = previousSettings;
    }
  }
});