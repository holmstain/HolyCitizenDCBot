import EmbedBuilder from 'discord.js'
import Translate from '../process_tools.js'

const emptyChannel = (queue) => {
    if (queue.metadata.lyricsThread) {
        queue.metadata.lyricsThread.delete();
        queue.setMetadata({
            channel: queue.metadata.channel
        });
    }

    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: await Translate(`Nobody is in the voice channel, leaving the voice channel!  <❌>`)})
        .setColor('#2f3136');

        queue.metadata.channel.send({ embeds: [embed] });
    })()
}

export default emptyChannel