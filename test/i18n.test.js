import assert from "node:assert/strict";
import test from "node:test";
import { languageFor, translate } from "../src/services/i18n.js";

test("selects English for English Discord locales and Turkish otherwise", () => {
  assert.equal(languageFor("en-US"), "en");
  assert.equal(languageFor("tr"), "tr");
  assert.equal(languageFor(undefined), "tr");
});

test("translates messages and interpolates values", () => {
  assert.equal(translate("en-GB", "levelMissing", { user: "@Alex" }), "@Alex has not earned XP yet.");
  assert.equal(translate("tr", "levelMissing", { user: "@Ada" }), "@Ada henüz XP kazanmadı.");
});