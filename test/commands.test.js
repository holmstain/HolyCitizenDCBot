import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";

const commandFiles = (await readdir(new URL("../src/commands/", import.meta.url)))
  .filter((file) => file.endsWith(".js"))
  .sort();
const commands = await Promise.all(
  commandFiles.map(async (file) => {
    const module = await import(new URL(`../src/commands/${file}`, import.meta.url));
    return module.default;
  }),
);

test("all slash commands have valid, unique names and serializable definitions", () => {
  const commandData = commands.map((command) => command.data.toJSON());
  const names = commandData.map(({ name }) => name);

  assert.equal(new Set(names).size, names.length);
  assert.deepEqual(names.sort(), ["ban", "basvuru", "clear", "destek", "help", "kapat", "kick", "level", "ping"]);

  for (const data of commandData) {
    assert.match(data.name, /^[a-z0-9_-]{1,32}$/);
    assert.ok(data.description.length > 0 && data.description.length <= 100);
    for (const option of data.options ?? []) {
      assert.match(option.name, /^[a-z0-9_-]{1,32}$/);
      assert.ok(option.description.length > 0 && option.description.length <= 100);
    }
  }
});

test("every slash command has an executable handler", () => {
  for (const command of commands) {
    assert.equal(typeof command.execute, "function", command.data.name);
  }
});
