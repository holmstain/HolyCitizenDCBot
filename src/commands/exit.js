import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders"

const exitcommand = {
    name: "Exit ",
    description: "Odayı terket",
    type: 1,
    options: [],
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Kick the bot from the channel."),
	execute: async ({ client, interaction }) => {

        // Get the current queue
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue)
		{
			await interaction.reply("There are no songs in the queue")
			return;
		}

        // Deletes all the songs from the queue and exits the channel
		queue.destroy();

        await interaction.reply("Why you do this to me?")
	},
}

export default exitcommand;