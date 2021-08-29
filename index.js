const Discord  = require('discord.js');       //Discord funkciók
const client   = new Discord.Client({ 
partials:["MESSAGE", "CHANNEL", "REACTION"]});//Discord kliens létrehozása
module.exports = client;
const config   = require('./config.js');
const func     = require('./functions.js');   //Saját funkciók

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
['command_handler', 'event_handler'].forEach(handler => {
    require(`./Handlers/${handler}`)(Discord, client, func);
});

client.login(require('./config.js').Token);  //BárányG Bot
//Discord szín: #ff00e5