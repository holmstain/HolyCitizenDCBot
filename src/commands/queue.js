import  { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders"

const queueommand = {
    name: "queue ",
    description: "Dinlenen içeriğe ekleme yapma",
    type: 1,
    options: [],
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Dinlenen içeriğe ekleme yapma"),

    execute: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        // check if there are songs in the queue
        if (!queue || !queue.playing)
        {
            await interaction.reply("Sırada içerik yok!");
            return;
        }

        // Get the first 10 songs in the queue
        const queueString = queue.tracks.slice(0, 10).map((song, i) => {
            return `${i}) [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
        }).join("\n")

        // Get the current song
        const currentSong = queue.current

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Şu anda oynatılan**\n` + 
                        (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "yok!") +
                        `\n\n**Sırada**\n${queueString}`
                    )
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
    }
};

export default queueommand