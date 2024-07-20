import { Collection, EmbedBuilder } from "discord.js";
import { readdirSync } from "fs";

   
async function props(f) {
  const module = await import(`../commands/${f}`);
  return module.default; // tüm export'ları almak için
}

const interactionCreate = async(client, interaction) => {

  if(interaction.isChatInputCommand()) {
    if (!interaction.guildId) return;
    readdirSync('./commands').forEach(f => {
      props(f).then((value) => {
        const cmd = value;
        if(interaction.commandName.toLowerCase() === cmd.name.toLowerCase()) {
          cmd.run(client, interaction).then((value2) => {
           console.log(value2)
          })
          
        }
      })
    });
  }
};

  
export default interactionCreate;