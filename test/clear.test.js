import assert from "node:assert/strict";
import { Collection, SnowflakeUtil } from "discord.js";
import test from "node:test";
import clearCommand from "../src/commands/clear.js";

const now = Date.now();
const recentSnowflake = () => SnowflakeUtil.generate(now);

test("clear fetches at most 100 messages and bulk-deletes only deletable ones", async () => {
  const fetched = [];
  const deleted = [];
  const interaction = {
    memberPermissions: { has: () => true },
    channel: {
      messages: {
        fetch: async (options) => {
          fetched.push(options);
          const map = new Collection();
          for (let i = 0; i < 250; i += 1) map.set(recentSnowflake(), { id: recentSnowflake() });
          return map;
        },
      },
      bulkDelete: async (messages) => {
        deleted.push(...messages);
      },
    },
    deferReply: async () => {},
    editReply: async () => {},
    locale: "en-US",
  };

  await clearCommand.execute(null, interaction);

  assert.equal(fetched[0].limit, 100);
  assert.ok(deleted.length <= 100, `bulkDelete received ${deleted.length} messages (max 100)`);
});

test("clear replies clearNothing when nothing is deletable", async () => {
  let replied;
  const interaction = {
    memberPermissions: { has: () => true },
    channel: {
      messages: {
        fetch: async () => new Collection(),
      },
      bulkDelete: async () => {
        throw new Error("bulkDelete should not be called");
      },
    },
    deferReply: async () => {},
    editReply: async (response) => { replied = response; },
    locale: "en-US",
  };

  await clearCommand.execute(null, interaction);

  assert.equal(replied.embeds[0].data.description, "No deletable messages (must be within 14 days).");
});
