import  EmbedBuilder from 'discord.js'
import  Translate from '../../process_tools.js'

const error = (queue, error) => {

    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: await Translate(`Bot had an unexpected error, please check the console imminently!`)})
        .setColor('#EE4B2B');

        queue.metadata.channel.send({ embeds: [embed] });

        console.log((`Error emitted from the Bot <${error}>`))
    })()
}

export default error