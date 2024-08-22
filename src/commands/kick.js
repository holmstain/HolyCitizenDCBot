import {Client, EmbedBuilder, InteractionType, ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
const interaction = InteractionType;

const kickCommand = {
        name: "kick",
        description: "Üyeyi binadan uzaklastır",
        type: 1,
        options: [{
          name: 'binadan-uzaklastırılacak-kisi',
          description: 'Binadan uzaklaştırılacak kişi',
          type: ApplicationCommandOptionType.Mentionable,
          required: true,
        }, {
          name: 'uzaklastırma-sebebi',
          description: 'uzaklastırma sebebi',
          type: ApplicationCommandOptionType.String,
          required: true,
        }],
        defaultMemberPermissions: [PermissionFlagsBits.KickMembers],

    run: async(client, interaction) => {
        const targetUserId = interaction.options.get('binadan-uzaklastırılacak-kisi').value;
        const reason = interaction.options.get('uzaklastırma-sebebi')?.value || "Sebep belirtilmedi!"

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);
        if (!targetUser) {
            await interaction.editReply('Kişi binada değil!')
            return;
        }

        if(targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply('Başkan binadan atılamaz!')
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if(targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("Bu kullanıcı binadan atılamadı!!")
            return;
        }

        if(targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("Kişi binadan atılamadı(aynı roldeyiz!)!")
            return;
        }

        // Ban The targetUser
        try {
            await targetUser.kick({reason:reason});
            await interaction.editReply(`${targetUser} binadan uzaklaştırıldı \n Binadan atılma sebebi: ${reason}`);
        } catch(error) {
            console.log(`${error} hatası alındı!`)
        }
    },
}

export default kickCommand;