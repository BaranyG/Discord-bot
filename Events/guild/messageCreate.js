module.exports = (Discord, client, func, message) => {
     
    const prefix = require('../../config.js').prefix;
    
    //Command dolgok
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const argsNew = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = argsNew.shift().toLowerCase();

    const command = client.commands.get(cmd);

    if(command) command.execute(Discord, client, func, message, argsNew);
    
    //Frissít parancs
    if(cmd==='refresh' || cmd==='reload'){
        func.roleAdd();
        message.channel.send('Frissítve!');
        return;
    }
}