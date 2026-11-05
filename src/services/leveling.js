import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export const levelForXp = (xp) => Math.floor((Math.sqrt(1 + (8 * xp) / 100) - 1) / 2);
export const xpForNextLevel = (level) => 100 * (level + 1);

export const createLevelingStore = ({ filePath, cooldownMs = 60_000, now = Date.now, random = Math.random }) => {
  let records;
  let loading;
  let pendingWrite = Promise.resolve();

  const load = async () => {
    if (!loading) {
      loading = readFile(filePath, "utf8")
        .then((contents) => JSON.parse(contents))
        .catch((error) => {
          if (error.code === "ENOENT") {
            return {};
          }
          throw error;
        })
        .then((loadedRecords) => {
          records = loadedRecords;
        });
    }
    await loading;
  };

  const save = () => {
    const snapshot = JSON.stringify(records, null, 2);
    pendingWrite = pendingWrite.then(async () => {
      await mkdir(dirname(filePath), { recursive: true });
      const temporaryPath = `${filePath}.tmp`;
      await writeFile(temporaryPath, snapshot);
      await rename(temporaryPath, filePath);
    });
    return pendingWrite;
  };

  return {
    async award(guildId, userId) {
      await load();
      const guildRecords = (records[guildId] ??= {});
      const record = (guildRecords[userId] ??= { xp: 0, messages: 0, lastAwardAt: null });
      const currentTime = now();

      if (record.lastAwardAt !== null && currentTime - record.lastAwardAt < cooldownMs) {
        return { awarded: false, record };
      }

      const oldLevel = levelForXp(record.xp);
      const amount = 15 + Math.floor(random() * 11);
      record.xp += amount;
      record.messages += 1;
      record.lastAwardAt = currentTime;
      record.level = levelForXp(record.xp);
      await save();

      return {
        awarded: true,
        amount,
        record: { ...record },
        leveledUp: record.level > oldLevel,
      };
    },

    async get(guildId, userId) {
      await load();
      const record = records[guildId]?.[userId];
      return record ? { ...record } : null;
    },

    async top(guildId, limit = 10) {
      await load();
      return Object.entries(records[guildId] ?? {})
        .map(([userId, record]) => ({ userId, ...record }))
        .sort((left, right) => right.xp - left.xp)
        .slice(0, limit);
    },
  };
};