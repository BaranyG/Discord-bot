//Formatting shortcut: Ctrl+K Ctrl+F OR Alt+Shift+F

const Discord = require('discord.js');
const { Client, IntentsBitField } = require('discord.js');
const myIntents = new IntentsBitField();
myIntents.add(
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
//  IntentsBitField.Flags.GuildBans,
    IntentsBitField.Flags.GuildEmojisAndStickers,
//  IntentsBitField.Flags.GuildIntegrations,
//  IntentsBitField.Flags.GuildWebhooks,
//  IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
//  IntentsBitField.Flags.GuildMessageTyping,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.DirectMessageTyping,
    IntentsBitField.Flags.MessageContent,
//  IntentsBitField.Flags.GuildScheduledEvents,
);
const client = new Client({ intents: myIntents, autoReconnect: true, retryLimit: Infinity });
module.exports = client;
const func = require('./functions.js');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
['command_handler', 'event_handler'].forEach(handler => {
    require(`./Handlers/${handler}`)(Discord, client, func);
});

client.login(require('./config.json').Token);  //BárányG Bot

//client.guilds.cache.get().members.cache.get().permissions.has("MANAGE_ROLES")
