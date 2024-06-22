import { Client, EmbedBuilder } from 'discord.js';

const clearCommand = {
    name: "clear",
    description: "Sohbet Temizleme komutu",
    type: 1,
    options: [],

    run: async (client, interaction) => {
        try {
            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                interaction.reply("BİRADER SEN KİMSİN AMK!");
                return;
            }
            const results = await interaction.channel.messages.fetch();
            await interaction.channel.bulkDelete(results);
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Söylenmiş sözler temizlendi`)], ephemeral: true });
        } catch (error) {
            interaction.reply({ embeds: [new EmbedBuilder().setDescription("Konuşulanlar temizlenemedi :) - DEVA")], ephemeral: true });
        }
    }
};

export default clearCommand;
