const fs       = require('fs');          //Fájlkezelő parancsok importálása
module.exports = {
    name: 'role',
    execute(Discord, client, func, message, args){
        try{
            if(args[0]===undefined){ 
                hibaUzenetDelete("Adj meg egy rolet: @Role"); 
                return; 
            }
            if (!args[0].startsWith('<@&') && !args[0].endsWith('>')) { 
                hibaUzenetDelete("Error: Nem rolet adtál meg."); 
                return; 
            }
            else if(!args[2] === undefined) { 
                hibaUzenetDelete("Ne írj utána semmit pliz."); 
                return; 
            }

            let MentionedRoleID = func.MentionRoleGetID(args[0]);
            let role = message.guild.roles.cache.get(MentionedRoleID);

            if(typeof role === undefined) return;

            let MentionedRoleName = role.name;

            let Szerver = {
                ServerID: message.guild.id.toString(),
                BirthdayRoleID: MentionedRoleID,
                BirthdayRoleName: MentionedRoleName
            }
            
            try{
                func.jsonReader('./database.json', (err, database) => {
                    if(err){ 
                        hibaUzenetDelete("Error: Role - Reading file"); 
                        console.log("Error: Role - Reading file:", err); 
                        return; 
                    }
                    for(let i = 0; i < database.Szerverek.length; i++){
                        if(database.Szerverek[i].ServerID === Szerver.ServerID && database.Szerverek[i].BirthdayRoleID !== Szerver.BirthdayRoleID){
                            database.Szerverek[i].BirthdayRoleID = Szerver.BirthdayRoleID;
                            database.Szerverek[i].BirthdayRoleName = Szerver.BirthdayRoleName;
                            RoleExists = true;
                        }
                    }
                    if(!RoleExists) { 
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
            
        }catch(error){ 
            hibaUzenetDelete("Error: role command"); 
            console.log("Error: role command", error); 
            return; 
        }
        


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