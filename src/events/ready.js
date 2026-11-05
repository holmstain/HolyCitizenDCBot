import { REST, Routes } from "discord.js";

export const registerCommands = async (rest, applicationId, commands) => {
  await rest.put(
    Routes.applicationCommands(applicationId),
    { body: commands },
  );
};

const ready = async (client) => {
  const applicationId = process.env.CLIENT_ID; // Bot uygulama ID'si
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  const commands = client.commands.map((command) => command.data.toJSON());

  await registerCommands(rest, applicationId, commands);

  console.log(`${client.user.tag} Hizmette!`);
};

export default ready;