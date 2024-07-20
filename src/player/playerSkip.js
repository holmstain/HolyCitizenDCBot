import EmbedBuilder from 'discord.js'
import Translate from "../../process_tools.js"

const playerSkip = (queue, track) => {

    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: await Translate(`Skipping <**${track.title}**> due to an issue! <❌>`)})
        .setColor('#EE4B2B');

        queue.metadata.channel.send({ embeds: [embed], iconURL: track.thumbnail });
    })()
}

export default playerSkip