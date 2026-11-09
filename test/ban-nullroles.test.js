import assert from "node:assert/strict";
import test from "node:test";
import banCommand from "../src/commands/ban.js";

test("ban does not crash when target member roles.highest is null", async () => {
  let edited;
  const interaction = {
    memberPermissions: { has: () => true },
    guild: {
      ownerId: "owner-1",
      members: {
        fetch: async () => ({
          roles: { highest: { position: 5 } },
        }),
        fetchMe: async () => ({
          roles: { highest: { position: 10 } },
        }),
      },
    },
    options: {
      getMember: () => ({
        id: "target-1",
        user: { tag: "Target#0001" },
        roles: { highest: null }, // simüle: rol önbelleği yok
        ban: async () => {},
      }),
      getString: () => "kurallar ihlali",
    },
    deferReply: async () => {},
    editReply: async (response) => { edited = response; },
    locale: "en-US",
    user: { id: "requester-1" },
  };

  // Should not throw TypeError: Cannot read properties of null (reading 'position')
  await banCommand.execute(null, interaction);

  assert.ok(edited, "hierarchy check with null highest should not crash and should reach banDone");
});
