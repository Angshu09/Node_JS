import { Client, GatewayIntentBits } from "discord.js";
import { connectDb } from "./connection.js";
import { URL } from "./models/url.js";
import { nanoid } from "nanoid";
import express from "express";
import { configDotenv } from 'dotenv';
configDotenv()

const app = new express()
const PORT = 8003

connectDb()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("create")) {
    const url = message.content.split(" ")[1];
    if(url){
        const shortId = nanoid(8);
        const newEntry = new URL({
            shortId: shortId,
            redirectUrl: url
        })
        try {
            await newEntry.save()
            return message.reply({
                content: `Generated short url: http://localhost:8003/${shortId}`,
            });
        } catch (error) {
            console.log(error.message)
            return message.reply({
                content: "There is some error from our end"
            })
        }
    }
    
  }

  message.reply({
    content: "Hi from Bot",
  });

});

client.on("interactionCreate", (interaction) => {
//   console.log(interaction);
  interaction.reply("Pong!!");
});

client.login(
  process.env.TOKEN,
);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId

    const entry = await URL.findOne({shortId})

    if(entry === null) return 

    return res.redirect(entry.redirectUrl)
})

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`))
