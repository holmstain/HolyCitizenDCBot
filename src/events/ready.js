require('dotenv').config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

module.exports = async (client) => {

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (error) {
    console.error(error);
  }

    console.log(`${client.user.tag} Aktif!`);
    console.log(`${client.user.tag} created/developed by Akiserius`);
};