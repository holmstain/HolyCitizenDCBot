import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
const app = express()
const port = 3000


const ready = async (client) => {

  
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  try {
    const response = rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID, // Bot uygulama ID'si
        process.env.GUILD_ID // Komutların yükleneceği guild ID'si
      ),
      { body: client.commands
      }
    );
  } catch (error) {
    console.error(error);
  }
  console.log(`${client.user.tag} Hizmette!`);
};


export default ready;