import { Client, GatewayIntentBits, Partials, Collection, VideoQualityMode, Routes } from "discord.js";
import dotenv from 'dotenv'
import ready from "./events/ready.js";
import interactionCreate from "./events/interactionCreate.js";
dotenv.config()
import { read, readdirSync } from "fs";
import {REST} from 'discord.js'
    
    const INTENTS = Object.values(GatewayIntentBits);
    const PARTIALS = Object.values(Partials);

    const client = new Client ({
        intents: INTENTS,
        disableEveryone: false,
        allowedMentions: {
          parse: ["users", "roles", "everyone"],
      },
        partials: PARTIALS,
        retryLimit: 3
    });

    global.client = client;
    client.commands = (global.commands = []);

    
    async function props(f) {
      const module = await import(`./commands/${f}`);
      return module.default; // tüm export'ları almak için
    }


    readdirSync('./commands').forEach(f =>{
        if(!f.endsWith(".js")) return;
        props(f).then((value) => {
          const props = value;
          client.commands.push({
            name: props.name?.toLowerCase(),
            description: props.description,
            options: props.options,
            dm_permission: props.dm_permission,
            type: 1
        })
        console.log(`[COMMAND] ${props.name} yüklendi!`)
        })
    });

    /* Eventleri Yüklüyoruz */
    client.on('ready', client => {
    ready(client);
    });
    
    client.on('interactionCreate', (interaction) => {
      interactionCreate(client,interaction);
      });

const DISCORD_TOKEN = process.env.DISCORD_TOKEN

client.login(DISCORD_TOKEN).then(app => {
    console.log(`[BOT] Token girişi başarılı.`)
  }).catch(app => {
    console.log(`[BOT] Token girişi başarısız.`)
  })