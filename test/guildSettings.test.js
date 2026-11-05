import assert from "node:assert/strict";
import test from "node:test";
import { getGuildSettings } from "../src/services/guildSettings.js";

test("reads independent feature settings for each guild", () => {
  const previousSettings = process.env.GUILD_SETTINGS;
  process.env.GUILD_SETTINGS = JSON.stringify({
    first: { autoRoleId: "role-1" },
    second: { autoRoleId: "role-2" },
  });

  try {
    assert.equal(getGuildSettings("first").autoRoleId, "role-1");
    assert.equal(getGuildSettings("second").autoRoleId, "role-2");
  } finally {
    if (previousSettings === undefined) {
      delete process.env.GUILD_SETTINGS;
    } else {
      process.env.GUILD_SETTINGS = previousSettings;
    }
  }
});