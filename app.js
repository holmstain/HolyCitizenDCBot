import { Client, GatewayIntentBits, Collection, IntentsBitField } from "discord.js"
import "dotenv/config"

const prefix = "/"


const client = new Client({
    intents: [GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, IntentsBitField.Flags.GuildMembers ],
    presence: {activities: [{name: "Holmstain", type: "WATCHING"}]}
})

client.once('ready', () => {
    console.log(`Hizmete Hazır!`);
});

client.commands = new Collection();

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Komutu çalıştırırken bir hata oluştu.');
    }
});

const repliedMessages = new Set();
client.on('messageCreate', message => {
    // Bot'un kendisine yanıt vermemesi için kontrol
    if (message.author.bot)
        return;

    // Eğer mesaj ID'si zaten Set içinde ise dönüş yap
    if (repliedMessages.has(message.id))
        return;
    const greetings = ["sa", "merhaba", "selamlar", "selam"];
    if (greetings.includes(message.content.toLowerCase())) {
        message.reply("Merhaba, Hoşgeldin!");
        repliedMessages.add(message.id);
    }
})

client.on('messageCreate', message => {
    // Bot'un kendisine yanıt vermemesi için kontrol
    if (message.author.bot)
        return;

    // Eğer mesaj ID'si zaten Set içinde ise dönüş yap
    if (repliedMessages.has(message.id))
        return;
    const greetings = ["nasılsın"];
    if (greetings.includes(message.content.toLowerCase())) {
        message.reply("Ben botum kral (mk aveli)");
        repliedMessages.add(message.id);
    }
})

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const event = args.shift().toLowerCase();

    if (event === 'clear') {
        // Sadece mesajları silebilecek olan kullanıcıların izni olduğunu kontrol edelim
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('Bu komutu kullanma izniniz yok.');
        }

        // Silinecek mesaj sayısını alalım
        const amount = parseInt(args[0]);

        // amount geçerli bir sayı mı kontrol edelim
        if (isNaN(amount)) {
            return message.reply('Lütfen geçerli bir sayı girin.');
        } else if (amount <= 0 || amount > 100) {
            return message.reply('Silinecek mesaj sayısı 1 ile 100 arasında olmalıdır.');
        }

        // Mesajları silme işlemi
        try {
            await message.channel.bulkDelete(amount);
            message.reply(`${amount} adet mesaj başarıyla silindi.`);
        } catch (err) {
            console.error('Hata oluştu:', err);
            message.reply('Mesajları silerken bir hata oluştu.');
        }
    }
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.systemChannel; // Sunucunun sistem kanalına hoş geldin mesajı gönderelim

    if (!channel) return;

    channel.send(`Hoş geldin, ${member.user}! Yeni Meclis Gözcümüzü Karşılayalım!`);
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'hoşgeldin') {
        const channel = message.guild.channels.cache.find(ch => ch.name === 'genel'); // 'genel' isimli kanalı bulalım

        if (!channel) return message.reply('Genel kanal bulunamadı.');

        channel.send(`Hoş geldin ${user}! Burası çok eğlenceli olacak.`);
    }
});
client.login(process.env.TOKEN)


// Status
// Activity
// Presence