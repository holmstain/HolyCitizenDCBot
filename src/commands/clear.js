
import PermissionsBitField  from 'discord.js';

export const clearCommand = {
    name: 'clear',
    description: 'Belirli bir kanaldaki mesajları siler.',
    execute(message, args) {
        // Sadece mesajları silebilecek olan kullanıcıların izni olduğunu kontrol edelim
        if (!message.member.permissions.has(PermissionsBitField.FLAGS.MANAGE_MESSAGES)) {
            return message.reply('Bu komutu kullanma izniniz yok.');
        }

        // Silinecek mesaj sayısını alalım
        const amount = parseInt(args[0]);

        // amount geçerli bir sayı mı kontrol edelim
        if (isNaN(amount)) {
            return message.reply('Lütfen geçerli bir sayı girin.');
        } else if (amount <= 0 || amount > 99) {
            return message.reply('Silinecek mesaj sayısı 1 ile 100 arasında olmalıdır.');
        }

        // Mesajları silme işlemi
        message.channel.bulkDelete(amount)
            .then(() => {
                message.reply(`${amount} adet mesaj başarıyla silindi.`)
                    .then(msg => {
                        setTimeout(() => msg.delete(), 500); // 5 saniye sonra cevabı sil
                    });
            })
            .catch(err => {
                console.error('Hata oluştu:', err);
                message.reply('Mesajları silerken bir hata oluştu.');
            });
    },
};