const fs       = require('fs');          //Fájlkezelő parancsok importálása
module.exports = {
    name: 'szulinap',
    description: 'Beolvassa a születésnapot adatbázisba',
    execute(Discord, client, func, message, args){
        try{
            if(args[0]===undefined){ message.channel.send("'!szülinap [születési dátum]' vagy '!szülinap formátum' "); return; }
            else if(args[0] === "formátum"){
                message.channel.send("Elfogadott formátumok ([] nélkül): \n[2000.1.1] [2000.1.1.]\n[2000.01.01] [2000.01.01.]\n[1.1] [1.1.]\n[01.01] [01.01.]\n***TL;DR:*** Akárhogy szerepelhet benne 0, egy pont elhanyagolható a végéről és nem muszáj évet megadni.\n**__Szabályok:__** 1920-2010-ig lehet évet megadni. Szökőnapot csak szökőévvel, vagy év nélkül lehet. (Ez esetben a nem szökőévekben 28-án fog értesíteni.) Nem lehet utána írni semmit. Nem lehet rövidebb, vagy hosszabb, mint egy érvényes dátum. Nem lehet benne más, számon és ponton kívül, azokból is ellenőrízve van, hol helyezkednek el. Aki rossz szándékkal megpróbálja kifagyasztani azt kizárom."); return; }
            else if(args[0] === "[születési" && args[1] === "dátum]"){ hibaUzenetDelete("Haha. Nagyon vicces."); return; }
            else if(args[1] !== undefined) { hibaUzenetDelete("Ne írj utána semmit pliz."); return; }
            else if(args[0].length < 3 || args[0].length > 11){ hibaUzenetDelete("Error: Nem megfelelő hosszúságú dátum."); return; }
            else if(!(args[0].includes('.')) || !(func.hasNumber(args[0]))){ hibaUzenetDelete("Error: Hiányzik 'pont' vagy szám -> !szülinap formátum"); return; }
            else if(!func.formatDate(args[0])) { hibaUzenetDelete("Error: Nem megfelelő formátum: [!szülinap formátum]\nVagy nem érvényes dátumot adtál meg."); return; }
            else if(!func.validDate(args[0])) { hibaUzenetDelete("Error: Nem érvényes dátumot adtál meg."); return; }
            try{
                var Tag = {
                    ServerID: message.guild.id.toString(),
                    Username: message.author.username,
                    UserID: message.author.id.toString(),
                    Birthday: func.getDate(args[0])
                }
                func.jsonReader('./database.json', (err, database) => {
                    if(err){ hibaUzenetDelete("Error #F3"); console.log("Error #F3: Reading file:", err); return; }
                    for(let i = 0; i < database.Tagok.length; i++){
                        if(database.Tagok[i].UserID === Tag.UserID && database.Tagok[i].ServerID === Tag.ServerID) { hibaUzenetDelete("Te már szerepelsz az adatbázisban!"); return; }
                    }
                    database.Tagok.push(Tag);
                    fs.writeFile('./database.json', JSON.stringify(database, null, 4), function(err){
                        if(err){ hibaUzenetDelete("Error #F4"); console.log("Error #F4: Writing file:", err); return; }
                        hibaUzenetDelete("Sikeresen hozzáadva!");
                        return;
                    });
                });
            }catch(error){ hibaUzenetDelete("Error #Sz1"); console.log("Error #Sz1", error); return; }
            return;
        } catch(e){
            hibaUzenetDelete("Error #Sz0");
            console.log("Error: #Sz0", e);
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