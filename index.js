const Discord = require('discord.js');
const client = new Discord.Client({ 
partials:["MESSAGE", "CHANNEL", "REACTION"]});
module.exports = client;
const func = require('./functions.js');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
['command_handler', 'event_handler'].forEach(handler => {
    require(`./Handlers/${handler}`)(Discord, client, func);
});

client.login(require('./config.js').Token);  //BárányG Bot