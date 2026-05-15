# 🤖 Discord.js Bot Development: Reference Notes

This README serves as a comprehensive reference guide for building Discord bots using `discord.js`. It covers core concepts, terminology, and the foundational objects required to get a bot up and running.

---

## 📖 Table of Contents
1. [What is a Discord Bot?](#1-what-is-a-discord-bot)
2. [What is discord.js?](#2-what-is-discordjs)
3. [The Core: Client & GatewayIntentBits](#3-the-core-client--gatewayintentbits)
4. [What are Guilds?](#4-what-are-guilds)
5. [Deep Dive: Objects Explained](#5-deep-dive-objects-explained)
6. [The Message Object](#6-the-message-object)
7. [Interactions (`interactionCreate`)](#7-interactions-interactioncreate)
8. [Essential Prerequisites](#8-essential-prerequisites)
9. [Basic Boilerplate Code](#9-basic-boilerplate-code)

---

## 1. What is a Discord Bot?
A Discord bot is an automated application that behaves like a user on a Discord server. It can perform a variety of tasks automatically, such as moderating chat, playing music, fetching data from APIs, hosting minigames, or welcoming new members. Under the hood, a bot is code running on a server that communicates directly with the Discord API.

## 2. What is `discord.js`?
`discord.js` is a powerful, object-oriented Node.js module that allows you to easily interact with the Discord API. 
* **Why use it?** Interacting directly with Discord's API requires managing websockets, rate limits, and complex data caching. `discord.js` handles all the heavy lifting, providing a clean, predictable JavaScript interface to build your bot.

---

## 3. The Core: Client & GatewayIntentBits

To connect a bot to Discord, you need two fundamental concepts:

### The Client
The `Client` represents your bot. It is the starting point of your application and the main hub for interacting with the Discord API. Every action your bot takes (sending messages, banning users, listening to events) goes through the `Client`.

### GatewayIntentBits (Intents)
Intents are a system introduced by Discord to help developers control which events their bot receives. 
* Think of Intents as **subscriptions**. If you don't subscribe to message events, Discord won't send your bot any data about new messages.
* This is designed to save bandwidth and memory. You only ask for the data your bot actually needs to function.

---

## 4. What are Guilds?
In the Discord API, a **Guild** is the technical term for a **Server**. 
* Whenever you see "Server" in the Discord app (like joining a server, or server settings), the code refers to it as a `Guild`.
* Guilds contain members, channels, roles, and customized settings. 

---

## 5. Deep Dive: Objects Explained

### The `Client` Object
When you instantiate a new Client (`const client = new Client(...)`), you are creating a massive object that holds the state of your bot.
* **`client.user`**: Represents the bot itself (its username, avatar, ID).
* **`client.guilds`**: A cache (collection) of all the servers the bot is currently in.
* **`client.login(token)`**: The method used to authenticate your bot with Discord using its unique token.
* **`client.on('eventName', callback)`**: An event listener that waits for things to happen (like a message being sent or a user joining).

### The `GatewayIntents` Object
When creating the client, you pass in an array of intents. 
* **`GatewayIntentBits.Guilds`**: The fundamental intent. It allows your bot to know about servers, channels, and roles.
* **`GatewayIntentBits.GuildMessages`**: Allows the bot to "hear" when messages are sent in a server.
* **`GatewayIntentBits.MessageContent`**: A **Privileged Intent**. This is required if you want your bot to actually read the *text* inside a message. (Must be explicitly toggled on in the Discord Developer Portal).

---

## 6. The Message Object
The `Message` object represents a specific message sent in a Discord channel. When your bot listens for a `messageCreate` event, Discord passes this object to your code.

**Key Properties:**
* **`message.content`**: The actual text the user typed.
* **`message.author`**: The `User` object of the person who sent it (contains their username and ID).
* **`message.channel`**: The channel where the message was sent. You can use `message.channel.send()` to reply in the same place.
* **`message.guild`**: The server where the message was sent (will be `null` if sent in a Direct Message).
* **`message.reply('Text')`**: A helpful method that replies directly to the message, pinging the author.

---

## 7. Interactions (`interactionCreate`)
Modern Discord bots use **Slash Commands** (e.g., `/ping`) instead of scanning every message for a prefix (like `!ping`). The `interactionCreate` event is how you handle these modern commands.

* **What is an Interaction?** An interaction is a payload sent by Discord when a user uses a Slash Command, clicks a Button, or uses a Select Menu.
* **The Event:** `client.on('interactionCreate', async interaction => { ... })`
* **Handling Commands:**
  * You check if the interaction is a command using `interaction.isChatInputCommand()`.
  * You check *which* command was used via `interaction.commandName`.
  * **Crucial Method - `interaction.reply()`**: You **must** respond to an interaction within 3 seconds using `interaction.reply()`, otherwise Discord will show the user an "application did not respond" error.

---

## 8. Essential Prerequisites
Before writing code, you must have:
1. **Node.js installed:** The runtime environment for JavaScript.
2. **A Code Editor:** Like VS Code.
3. **A Discord Developer Application:** Go to the [Discord Developer Portal](https://discord.com/developers/applications), create an app, and turn it into a Bot.
4. **Your Bot Token:** This is the password for your bot. **NEVER share this token, upload it to GitHub, or show it to anyone.** If someone gets it, they can control your bot. Store it in a `.env` file.

---

## 9. Basic Boilerplate Code
Here is the absolute minimum code required to get a modern discord.js bot online:

```javascript
// 1. Require the necessary discord.js classes
const { Client, GatewayIntentBits, Events } = require('discord.js');

// 2. Create a new client instance with specific intents
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent 
    ] 
});

// 3. Listen for when the bot is ready (runs once)
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// 4. Listen for interactions (Slash Commands)
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

// 5. Log in to Discord with your bot's token
client.login('YOUR_BOT_TOKEN_HERE'); // Remember to use environment variables (.env) in real projects!