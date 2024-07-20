import  EmbedBuilder  from 'discord.js'
import  Translate  from '../../process_tools.js'

const audioTracksAdd = (queue) => {
    if (!client.config.app.extraMessages) return;
    
    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: await Translate(`All the songs in playlist added into the queue <✅>`)})
        .setColor('#2f3136');

        queue.metadata.channel.send({ embeds: [embed] });
    })()
}

export default audioTracksAdd