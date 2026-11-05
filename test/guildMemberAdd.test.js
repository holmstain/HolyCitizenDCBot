import assert from "node:assert/strict";
import test from "node:test";
import { welcomeMember } from "../src/events/guildMemberAdd.js";

test("welcomes a human in the earliest text channel and assigns configured role", async () => {
  const sent = [];
  const roles = [];
  const channels = [
    { id: "later", rawPosition: 2, type: 0, send: async (message) => sent.push(message) },
    { id: "first", rawPosition: 0, type: 0, send: async (message) => sent.push(message) },
  ];
  const member = {
    id: "member-1",
    user: { bot: false },
    toString: () => "<@member-1>",
    roles: { add: async (...args) => roles.push(args) },
    guild: {
      channels: {
        cache: {
          filter: (predicate) => ({
            sort: (compare) => ({
              first: () => channels.filter(predicate).sort(compare)[0],
            }),
          }),
        },
      },
    },
  };

  await welcomeMember(member, "role-1");

  assert.deepEqual(roles, [["role-1", "Otomatik üye rolü"]]);
  assert.deepEqual(sent, [{
    content: "Hoş geldin <@member-1>!",
    allowedMentions: { users: ["member-1"] },
  }]);
});

test("does not assign a role or welcome bot accounts", async () => {
  const member = { user: { bot: true } };

  await welcomeMember(member, "role-1");
});

test("still welcomes a member when automatic role assignment fails", async () => {
  let welcomed = false;
  const member = {
    id: "member-2",
    user: { bot: false },
    toString: () => "<@member-2>",
    roles: { add: async () => { throw new Error("missing permission"); } },
    guild: {
      channels: {
        cache: {
          filter: () => ({ sort: () => ({ first: () => ({ send: async () => { welcomed = true; } }) }) }),
        },
      },
    },
  };

  await welcomeMember(member, "role-1");
  assert.equal(welcomed, true);
});