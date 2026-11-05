import assert from "node:assert/strict";
import test from "node:test";
import { createRaidDetector } from "../src/events/raidDetection.js";

test("alerts once when the join threshold is reached", async () => {
  let currentTime = 1_000;
  const sent = [];
  const channel = { send: async (message) => sent.push(message) };
  const detector = createRaidDetector({
    threshold: 3,
    windowMs: 10_000,
    alertCooldownMs: 30_000,
    now: () => currentTime,
  });
  const member = {
    guild: {
      id: "guild-1",
      systemChannel: channel,
    },
  };

  assert.equal(await detector(member), false);
  currentTime += 1_000;
  assert.equal(await detector(member), false);
  currentTime += 1_000;
  assert.equal(await detector(member), true);
  assert.equal(await detector(member), false);
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0].allowedMentions, { parse: [] });
});