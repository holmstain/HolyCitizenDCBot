import { Client, EmbedBuilder } from 'discord.js';

const helpcommand = {
    name: "help",
    description: "Hizmet için buradayım!",
    type: 1,
    options: [],
    
    run: async(client, interaction) => {
        const categories = [];
        
        client.commands.forEach((command) => 
            categories.includes(command.category) ? false : categories.push(command.category)
    );
    
    const fields = client.commands.map(command => ({
        name: `/${command.name}`,
        value: command.description || 'No description available',
        inline: false
      }));
    
    const embed = new EmbedBuilder()
      .setAuthor({ name: "HolyCitizen" })
      .setColor(0x0099FF)
      .setDescription('Hizmet verdiğim komutlar şunlar:')
      .setTitle('Yardıma Geldim!')
      .setThumbnail(client.user.avatarURL())
      .addFields(fields)
      .setTimestamp()
      .setFooter({ text: 'Holmstain Tarafından Oluşturuldu 💚💚💚' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

export default helpcommand;