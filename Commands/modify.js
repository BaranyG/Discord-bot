const fs       = require('fs');
//const client = require('../index.js')
module.exports = {
    name: 'modify',
    execute(Discord, client, func, message, args){
        try{
            const pelda = `Parancs használata: **!modify @User [dátum]** \n**Példák:** \n!modify <@${client.user.id}> 2000.01.01 \n!modify <@${client.user.id}> 1.1`;
            
            if(args[1] === undefined || args[0] === undefined){
                hibaUzenetDelete(pelda);
                return;
            }
            else if(!(func.formatDate(args[1]) || (args[0].startsWith('<@') && args[0].endsWith('>')))){
                let uzenet = "Nem megfelelően adtad meg a"
                if(!(args[0].startsWith('<@') && args[0].endsWith('>'))){
                    uzenet += "felhasználót."
                }else if(!func.formatDate(args[1])){
                    uzenet += "dátumot."
                }
                hibaUzenetDelete(uzenet);
                hibaUzenetDelete(pelda);
                return;
            }
            else if(args[1].length < 3 || args[1].length > 11){
                hibaUzenetDelete("Error: Nem megfelelő hosszúságú dátum.");
                return;
            }
            else if(!func.validDate(args[1])){
                hibaUzenetDelete("Error: Nem érvényes dátumot adtál meg.");
                return;
            }
            
            let MentionedUserID = func.MentionGetID(args[0]);
            let UserExists = false;
            try{
                func.jsonReader('./database.json', (err, database) => {
                    if(err){ 
                        hibaUzenetDelete("Error #F3"); 
                        console.log("Error #F3: Reading file:", err); 
                        return; 
                    }
                    for(let i = 0; i < database.Tagok.length; i++){
                        if(database.Tagok[i].UserID === MentionedUserID && database.Tagok[i].ServerID === message.guild.id){
                            database.Tagok[i].Birthday = func.getDate(args[1]);
                            UserExists = true;
                        }
                    }
                    if(!UserExists) { 
                        hibaUzenetDelete("Nincs ilyen felhasználó regisztrálva!"); 
                        return; 
                    }
                    fs.writeFile('./database.json', JSON.stringify(database, null, 4), function(err){
                        if(err){ 
                            hibaUzenetDelete("Error #F4"); 
                            console.log("Error #F4: Writing file:", err); 
                            return; 
                        }
                        hibaUzenetDelete(`Sikeresen módosítottad <@${MentionedUserID}> születési dátumát!`);
                        return;
                    });
                });
            }catch(error){
                hibaUzenetDelete("Error #M1");
                console.log("Error #M1", error);
                return;
            }
            return;
        }catch(e) {
            hibaUzenetDelete("Error #M0");
            console.log("Error: #M0", e);
        }
        function hibaUzenetDelete(uzenet){
            message.reply(uzenet).then(msg => {
                msg.delete({ timeout: 1000 * 60 * 60 });
            });
            message.fetch(message.id).then(msg => {
                msg.delete({ timeout: 1000 * 60 * 60 });
            });
        }
    }
}