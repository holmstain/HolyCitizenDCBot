import { ActivityType, Client, Collection, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import ready from "./events/ready.js";
import interactionCreate from "./events/interactionCreate.js";
import guildMemberAdd from "./events/guildMemberAdd.js";
import messageCreate from "./events/messageCreate.js";
import { notifyRaidIfDetected } from "./events/raidDetection.js";
import { createLevelingStore } from "./services/leveling.js";
dotenv.config();

const requiredEnvironmentVariables = ["DISCORD_TOKEN", "CLIENT_ID"];
const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (name) => !process.env[name],
);

if (missingEnvironmentVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvironmentVariables.join(", ")}`,
  );
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
  presence: {
    status: "online",
    activities: [{ name: "Working hard or hardworking", type: ActivityType.Listening }],
  },
});

client.commands = new Collection();
client.leveling = createLevelingStore({
  filePath: fileURLToPath(new URL("../data/levels.json", import.meta.url)),
});

const commandFiles = (await readdir(new URL("./commands/", import.meta.url)))
  .filter((file) => file.endsWith(".js"))
  .sort();

for (const file of commandFiles) {
  const module = await import(new URL(`./commands/${file}`, import.meta.url));
  const command = module.default; // tüm export'ları almak için

  if (!command?.data || typeof command.execute !== "function") {
    throw new TypeError(`Invalid command module: ${file}`);
  }

  const commandName = command.data.name;
  if (client.commands.has(commandName)) {
    throw new Error(`Duplicate command name: ${commandName}`);
  }

  client.commands.set(commandName, command);
  console.log(`[COMMAND] /${commandName} yüklendi!`);
}

/* Eventleri Yüklüyoruz */
client.once(Events.ClientReady, async (readyClient) => {
  try {
    await ready(readyClient);
  } catch (error) {
    console.error("[BOT] Başlatma başarısız.", error);
    await readyClient.destroy();
    process.exitCode = 1;
  }
});

client.on(Events.InteractionCreate, (interaction) => {
  void interactionCreate(client, interaction).catch((error) => {
    console.error("[INTERACTION] İşlem başarısız.", error);
  });
});

client.on(Events.GuildMemberAdd, (member) => {
  void guildMemberAdd(member);
  void notifyRaidIfDetected(member);
});

client.on(Events.MessageCreate, (message) => {
  void messageCreate(client, message);
});

try {
  await client.login(process.env.DISCORD_TOKEN);
} catch (error) {
  console.error("[BOT] Giriş başarısız.", error);
  await client.destroy();
  process.exitCode = 1;
}