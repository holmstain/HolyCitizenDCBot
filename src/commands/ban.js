import {Client, EmbedBuilder, InteractionType, ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
const interaction = InteractionType;

const banCommand = {
        name: "Ban",
        description: "Üyenin binaya girişini yasakla!",
        type: 1,
        options: [{
          name: 'yasaklanacak-meclis-uyesi',
          description: 'The user to ban',
          type: ApplicationCommandOptionType.Mentionable,
          required: true,
        }, {
          name: 'yasaklama-sebebi',
          description: 'The reason for the ban',
          type: ApplicationCommandOptionType.String,
          required: true,
        }],
        defaultMemberPermissions: [PermissionFlagsBits.BanMembers],

    run: async(client, interaction) => {
        const targetUserId = interaction.options.get('yasaklanacak-meclis-uyesi').value;
        const reason = interaction.options.get('yasaklama-sebebi')?.value || "Sebep belirtilmedi!"

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);
        if (!targetUser) {
            await interaction.editReply('Kişi binada değil!')
            return;
        }

        if(targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply('Başkan KOVULAMAZ!')
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if(targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("Bu kullanıcı binadan uzaklaştırılamadı!")
            return;
        }

        if(targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("Kişi binadan uzaklaştırılamadı(aynı roldeyiz!)!")
            return;
        }

        // Ban The targetUser
        try {
            await targetUser.ban({reason:reason});
            await interaction.editReply(`${targetUser} binadan uzaklaştırıldı \n Yasaklama-Sebebi: ${reason}`);
        } catch(error) {
            console.log(`${error} hatası alındı!`)
        }
    },
}

export default banCommand;