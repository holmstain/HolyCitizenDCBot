import assert from "node:assert/strict";
import test from "node:test";
import { registerCommands } from "../src/events/ready.js";

test("registers slash commands globally for every authorized guild", async () => {
  let request;
  const rest = {
    put: async (...args) => { request = args; },
  };
  const commands = [{ name: "level" }];

  await registerCommands(rest, "application-1", commands);

  assert.equal(request[0], "/applications/application-1/commands");
  assert.deepEqual(request[1].body, commands);
});