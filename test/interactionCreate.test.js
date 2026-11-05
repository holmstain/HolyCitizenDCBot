import assert from "node:assert/strict";
import test from "node:test";
import interactionCreate from "../src/events/interactionCreate.js";

test("dispatches a matching guild command once", async () => {
  let executions = 0;
  const command = {
    execute: async () => {
      executions += 1;
    },
  };
  const client = { commands: new Map([["ping", command]]) };
  const interaction = {
    commandName: "ping",
    guildId: "guild-id",
    isChatInputCommand: () => true,
  };

  await interactionCreate(client, interaction);

  assert.equal(executions, 1);
});

test("ignores interactions outside guild chat commands", async () => {
  const client = { commands: new Map() };
  const interaction = {
    isChatInputCommand: () => false,
  };

  await interactionCreate(client, interaction);
});
