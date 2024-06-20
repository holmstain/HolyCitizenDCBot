import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import {Console} from "console";
import dotenv from 'dotenv'
dotenv.config();
import { TOKEN } from './.env'
import { readdirSync } from "fs";

    const INTENTS = Object.values(GatewayIntentBits);
    const PARTIALS = Object.values(Partials);

    const client = new Client ({
        intents: INTENTS,
        allowedMentions: {
            parse: ["users"]
        },
        presence: {activities: [{name: "Holmstain", type: "WATCHING"}]},
        partials: PARTIALS,
        retryLimit: 3
    });

    global.client = client;
    client.commands = (global.commands = []);


    readdirSync('./commands').forEach(f =>{
        if(!f.endsWith(".js")) return;

        async function props(f) {
            const module = await import(`./commands/${f}`);
            return module; // tüm export'ları almak için
          }

        client.commands.push({
            name: props.name.toLowerCase(),
            description: props.description,
            options: props.options,
            dm_permission: props.dm_permission,
            type: 1
        })

        console.log(`[COMMAND] ${props.name} yüklendi!`)
    });

/* Eventleri Yüklüyoruz */

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

const token = process.env.TOKEN;
console.log(`TOKEN: ${token}`);
client.login(TOKEN)


// Status
// Activity
// Presence