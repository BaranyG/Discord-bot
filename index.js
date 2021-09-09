const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const myIntents = new Intents();
myIntents.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES
    );
const client = new Client({ intents: myIntents });
module.exports = client;
const func = require('./functions.js');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
['command_handler', 'event_handler'].forEach(handler => {
    require(`./Handlers/${handler}`)(Discord, client, func);
});

//client.guilds.cache.get().members.cache.get().permissions.has("MANAGE_ROLES")

client.login(require('./config.js').Token);  //BárányG Bot