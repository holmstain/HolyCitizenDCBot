import dotenv from 'dotenv'
dotenv.config()
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { DisTube } from 'distube';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { SpotifyPlugin } from '@distube/spotify';

// Discord.js client oluşturma
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel]
});

// DisTube botunu kurma
const distube = new DisTube(client, {
    plugins: [new SpotifyPlugin(), new YtDlpPlugin(),],
    emitNewSongOnly: true,
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'play') {
        const query = options.getString('query');

        if (!interaction.member.voice.channel) {
            await interaction.reply('Öncelikle bir ses kanalına katılmalısınız!');
            return;
        }

        const voiceChannel = interaction.member.voice.channel;

        await interaction.reply(`Müzik aranıyor: \`${query}\`...`);

        try {
            await distube.play(voiceChannel, query, {
                member: interaction.member,
                textChannel: interaction.channel,
                interaction
            });
            await interaction.editReply(`Müzik çalınıyor: \`${query}\``);
        } catch (error) {
            await interaction.editReply('Müzik çalınırken bir hata oluştu.');
            console.error(error);
        }
    }
});

// Slash komutları kaydetme
client.on('ready', async () => {
    const commands = [
        {
            name: 'play',
            description: 'YouTube\'dan müzik çalar',
            options: [
                {
                    name: 'query',
                    type: 'STRING',
                    description: 'YouTube URL veya arama terimi',
                    required: true,
                },
            ],
        },
    ];

    await client.application.commands.set(commands);
    console.log('Slash komutları kaydedildi');
});

// Token ile giriş yapma
client.login(process.env.DISCORD_TOKEN);