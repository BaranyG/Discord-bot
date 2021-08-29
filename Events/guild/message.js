module.exports = (Discord, client, func, message) => {
     
    const prefix = require('../../config.js').prefix;
    function emoji (id) { return client.emojis.cache.get(id).toString(); }
    
    //Command dolgok
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);

    if(command) command.execute(Discord, client, func, message, args);
    
    //Frissít parancs
    if(cmd==='frissít'){
        func.roleAdd(); message.channel.send('Frissítve!');
        return;
    }

    /*
    //Modok parancsai:
    if(message.member.roles.cache.has()){
        //Módosítás parancs
        if(cmd==='módosít'){
            client.commands.get('modosit').execute(Discord, client, func, message, args);
            return;
        }
    
    //Modok parancsai, ha pleb próbálja meg:
    }else {
        //Módosítás parancs
        if(cmd==='módosít'){
            message.reply("Kérj meg rá egy aktív moderátort.");
            return;
        }
    }
    */
}