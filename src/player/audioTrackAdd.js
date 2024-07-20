import  EmbedBuilder  from 'discord.js'
import Translate from '../../process_tools.js'

const audioTrackAdd = (queue, track) => {
    if (!client.config.app.extraMessages) return;
    return (
    async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: await Translate(`Track <${track.title}> added in the queue <✅>`), iconURL: track.thumbnail })
        .setColor('#2f3136');

        queue.metadata.channel.send({ embeds: [embed] });
    })()
}

export default audioTrackAdd