import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createLevelingStore, levelForXp, xpForNextLevel } from "../src/services/leveling.js";

test("awards XP on cooldown, calculates levels, and persists records", async () => {
  const directory = await mkdtemp(join(tmpdir(), "holy-citizen-levels-"));
  const filePath = join(directory, "levels.json");
  let currentTime = 1_000;
  const store = createLevelingStore({
    filePath,
    now: () => currentTime,
    random: () => 0,
  });

  try {
    const first = await store.award("guild-1", "user-1");
    const throttled = await store.award("guild-1", "user-1");

    assert.equal(first.amount, 15);
    assert.equal(first.awarded, true);
    assert.equal(throttled.awarded, false);
    assert.equal(levelForXp(299), 1);
    assert.equal(levelForXp(300), 2);
    assert.equal(xpForNextLevel(1), 200);

    currentTime += 60_000;
    const second = await store.award("guild-1", "user-1");
    assert.equal(second.awarded, true);
    assert.equal(second.record.xp, 30);

    const persisted = JSON.parse(await readFile(filePath, "utf8"));
    assert.equal(persisted["guild-1"]["user-1"].messages, 2);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});