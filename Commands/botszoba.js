const fs       = require('fs');          //Fájlkezelő parancsok importálása
module.exports = {
    name: 'botszoba',
    execute(Discord, client, func, message, args){
        try{
            let Szerver = {
                ServerID: message.guild.id.toString(),
                ServerName: message.guild.name,
                BotChannelID: message.channel.id.toString(),
                BotChannelName: message.channel.name
            }
            func.jsonReader('./database.json', (err, database) => {
                if(err){ hibaUzenetDelete("Error: Botszoba - Reading File"); console.log("Error: Botszoba - Reading file:", err); return; }
                for(let i = 0; i < database.Szerverek.length; i++){
                    if(database.Szerverek[i].ServerID === Szerver.ServerID){
                        if(database.Szerverek[i].BotChannelID === Szerver.BotChannelID) { 
                            message.reply("Ez a szoba már meg van adva botszobának!"); 
                            if(database.Szerverek[i].BotChannelName !== Szerver.BotChannelName)
                                database.Szerverek[i].BotChannelName = Szerver.BotChannelName;
                            return;
                        }else if(database.Szerverek[i].BotChannelID !== Szerver.BotChannelID){
                            database.Szerverek[i].BotChannelID = Szerver.BotChannelID;
                            database.Szerverek[i].BotChannelName = Szerver.BotChannelName;
                            fs.writeFile('./database.json', JSON.stringify(database, null, 4), function(err){
                                if(err){ hibaUzenetDelete("Error: Botszoba - Writing File"); console.log("Error: Botszoba - Writing file", err); return; }
                                message.reply("Botszoba sikeresen módosítva");
                                return;
                            });
                            return; 
                        }
                    }
                }
        
                database.Szerverek.push(Szerver);
                fs.writeFile('../database.json', JSON.stringify(database, null, 4), function(err){
                    if(err){ hibaUzenetDelete("Error: Botszoba - Writing file #2"); console.log("Error: Botszoba - Writing file #2", err); return; }
                    message.reply("Botszoba sikeresen beállítva!");
                    return;
                });
            });
        }catch(error){ hibaUzenetDelete("Error: Botszoba command"); console.log("Error: Botszoba command", error); return; }
        
        function hibaUzenetDelete(uzenet){
            message.reply(uzenet).then(msg => {
                msg.delete({ timeout: 1000 * 60 * 2 });
            });
            message.fetch(message.id).then(msg => {
                msg.delete({ timeout: 1000 * 60 * 2 });
            });
        }
    }
}