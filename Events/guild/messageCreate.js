module.exports = (Discord, client, func, message) => {
     
    const prefix = require('../../config.json').prefix;
    
    //Prefix és Bot ellenőrzése
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    //Parancs trimelése
    const argsNew = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = argsNew.shift().toLowerCase();
    //A trimelt szöveget kikeresi a parancsok közül
    const command = client.commands.get(cmd);
    //Ha van ilyen parancs, lefuttatja az adott fájlt
    if(command) command.execute(Discord, client, func, message, argsNew);
    else return message.channel.send('Nincs ilyen parancs');
}