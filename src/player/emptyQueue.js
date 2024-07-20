import EmbedBuilder from 'discord.js'
import Translate from '../../process_tools.js'

const emptyQueue = (queue) => {

    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: await Translate('No more songs in the queue!  <❌>')})
        .setColor('#2f3136');

        queue.metadata.channel.send({ embeds: [embed] });
    })()
}


export default emptyQueue