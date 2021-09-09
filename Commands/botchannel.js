const fs       = require('fs');          //Fájlkezelő parancsok importálása
module.exports = {
    name: 'botchannel',
    execute(Discord, client, func, message){
        try{
            let Szerver = {
                ServerID: message.guild.id.toString(),
                ServerName: message.guild.name,
                BotChannelID: message.channel.id.toString(),
                BotChannelName: message.channel.name
            }
            func.jsonReader('./database.json', (err, database) => {
                if(err){ hibaUzenetDelete("Error: Botchannel - Reading File"); console.log("Error: Botchannel - Reading file:", err); return; }
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
                                if(err){ hibaUzenetDelete("Error: Botchannel - Writing File"); console.log("Error: Botchannel - Writing file", err); return; }
                                message.reply("Botchannel sikeresen módosítva");
                                return;
                            });
                            return;
                        }
                    }
                }
        
                database.Szerverek.push(Szerver);
                fs.writeFile('./database.json', JSON.stringify(database, null, 4), function(err){
                    if(err){ hibaUzenetDelete("Error: Botchannel - Writing file #2"); console.log("Error: Botchannel - Writing file #2", err); return; }
                    message.reply("Botchannel sikeresen beállítva!");
                    return;
                });
            });
        }catch(error){ hibaUzenetDelete("Error: Botchannel command"); console.log("Error: Botchannel command", error); return; }
        
        function hibaUzenetDelete(uzenet){
            message.reply(uzenet).then(msg => {
                setTimeout(() => msg.delete(), 1000 * 60 * 60);
            });
            message.fetch(message.id).then(msg => {
                setTimeout(() => msg.delete(), 1000 * 60 * 60);
            });
        }
    }
}