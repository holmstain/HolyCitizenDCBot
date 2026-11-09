import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createLevelingStore } from "../src/services/leveling.js";

test("corrupt levels.json does not crash; treated as empty store", async () => {
  const directory = await mkdtemp(join(tmpdir(), "holy-citizen-levels-corrupt-"));
  const filePath = join(directory, "levels.json");

  // write invalid JSON
  await writeFile(filePath, "{ not valid json }", "utf8");

  const store = createLevelingStore({ filePath, random: () => 0 });

  try {
    const result = await store.award("guild-1", "user-1");
    assert.equal(result.awarded, true);
    assert.equal(result.record.xp, 15);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
