import { Client, EmbedBuilder } from 'discord.js';

const pingcommand = {
  name: "ping",
  description: "Bot'un ping değerlerini öğrenirsiniz",
  type: 1,
  options: [],

  run: async(client, interaction) => {
    interaction.reply({ embeds: [ new EmbedBuilder().setDescription(`Server Ping: ***${client.ws.ping}ms***`) ], ephemeral: true })
}
};

export default pingcommand;