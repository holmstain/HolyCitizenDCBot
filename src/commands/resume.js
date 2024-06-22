import { SlashCommandBuilder } from "@discordjs/builders"

const resumecommand = {
    name: "resume ",
    description: "Dinlenen içeriğe devam et!",
    type: 1,
    options: [],
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song"),
	execute: async ({ client, interaction }) => {
        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

        // Check if the queue is empty
		if (!queue)
        {
            await interaction.reply("No songs in the queue");
            return;
        }

        // Pause the current song
		queue.setPaused(false);

        await interaction.reply("Player has been resumed.")
	},
}

export default resumecommand;