import assert from "node:assert/strict";
import test from "node:test";
import { getGuildSettings } from "../src/services/guildSettings.js";

test("malformed GUILD_SETTINGS does not throw; falls back to env defaults", () => {
  const previousSettings = process.env.GUILD_SETTINGS;
  const previousFallback = process.env.SUPPORT_ROLE_ID;
  process.env.GUILD_SETTINGS = "{ not valid json }";
  process.env.SUPPORT_ROLE_ID = "fallback-role";

  try {
    const settings = getGuildSettings("guild-1");
    assert.equal(settings.supportRoleId, "fallback-role");
  } finally {
    if (previousSettings === undefined) {
      delete process.env.GUILD_SETTINGS;
    } else {
      process.env.GUILD_SETTINGS = previousSettings;
    }
    if (previousFallback === undefined) {
      delete process.env.SUPPORT_ROLE_ID;
    } else {
      process.env.SUPPORT_ROLE_ID = previousFallback;
    }
  }
});
