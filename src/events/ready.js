import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import dotenv from 'dotenv'
dotenv.config()


const ready = async (client) => {

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  try {
    const response = rest.put(
      Routes.applicationGuildCommands(
          client.user.id,
          '1167933101968740472'
      ),
      { body: client.commands }
  );
  } catch (error) {
    console.error(error);
  }

    console.log(`${client.user.tag} Hizmette!`);
};

export default ready;