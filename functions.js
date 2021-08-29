const client   = require("./index.js");  //Discord kliens importálása a main fájlból
const fs       = require('fs');          //Fájlkezelő parancsok importálása
const http     = require('http');        //HTTP importálása
const request  = require('request');     //request importálása
module.exports = {
    jsonReader: function(filepath, callback){
        fs.stat(filepath, function(err, stat) {
            fs.readFile(filepath, 'utf8', (err, data) => {
                if (err) {  
                    console.log("Error #F1: File read failed:"); 
                    return callback && callback(err);
                }
                try{
                    const object = JSON.parse(data);
                    return callback && callback(null, object);
                }catch(error){ 
                    console.log("Error: parsing the JSON string in jsonReader:"); 
                    return callback && callback(err);
                }
            });
        });
    },

    formatDate: function(datum){
        if(/^([1-2](9|0)[0-9]{2}\.)?[0-1]?[0-9]\.[0-3]?[0-9]\.?$/.test(datum)) return true; //Ezt nem kell magyarázni ez tök könnyű (Ellenőrzi a dátum formátumát, hogy megfelelő-e, és leszűkíti az érvényes dátumok számát)
        else return false;
    },

    validDate: function(datum){
            datum = this.getDate(datum)                                                 //Dátum formázása
            let datumArray = datum.split('.');                                          //(Év,) hónap, napra bontja az adatot
            let index = this.getDateIndex(datum);                                       //Index létrehozása
            if(index==2){
                if(!(1920 <= datumArray[0] && datumArray[0] <= 2010)) return false;  //1920-2010 intervallum
                if(datumArray[1] == 2){                                                 //Szököév ellenőrzés
                    if(datumArray[0] % 4 == 0){                                         //ha szökőév febr. 1-29
                        if(!(0 < datumArray[2] && datumArray[2] < 30)) return false;
                    }else {                                                             //ha nem szökőév, febr. 1-28
                        if(!(0 < datumArray[2] && datumArray[2] < 29)) return false; 
                    }
                }
            }
            if(index==1) 
                if(datumArray[0] == 2) if(datumArray[1] < 30) ; else return false;          //Ha nincs megadva év -> feb. 1-29 nap
            if(0 < datumArray[index-1] && datumArray[index-1] < 13) ; else return false;    //1-12 lehet a hónap
            if(0 < datumArray[index] && datumArray[index] < 32) ; else return false;        //1-31 lehet a nap
            if(/(4|6|9|11)/.test(datumArray[index-1]))                                      //ápr. jún. szep. és nov. -ben 1-30 nap
                if(0 < datumArray[index] && datumArray[index] < 31) ; else return false;
            return true;                                                                    //Igazzal tér vissza, ha érvényes dátum
    },

    getDate: function(datum){
        datum = datum.toString();                                               //Adat szöveggé alakítása, hiba elkerülése érdekében
        if(datum.endsWith('.')) datum.slice(0,-1);                              //Eltünteti végéről a pontot ha van
        let datumArray = datum.split('.');                                      //(Év,) hónap, napra bontja az adatot
        let index = this.getDateIndex(datum);                                   //Index létrehozása
        if(datumArray[index-1] != 10) 
            datumArray[index-1] = datumArray[index-1].replace('0', '');         //szükségtelen 0-k eltüntetése
        if(!/(10|20|30)/.test(datumArray[index])) 
            datumArray[index] = datumArray[index].replace('0', '');             //szükségtelen 0-k eltüntetése
        if(index==2) 
            datum = datumArray[0] + '.' + datumArray[1] + '.' + datumArray[2]; //Dátum mentése
        else if(index==1) 
            datum = datumArray[0] + '.' + datumArray[1];                        //Dátum mentése
    else return;                                                                //Visszatér üresen, ha az index 0;
    return datum;                                                               //Visszatérés felülírt dátummal
    },

    getDateIndex: function(datum){
        if(/^\d{4}\.\d{1,2}\.\d{1,2}\.?$/.test(datum)) return 2;                    //Ha tartalmaz évet, 2 az index.
        else if(/^\d{1,2}\.\d{1,2}\.?$/.test(datum)) return 1;                      //Ha nem tartalmaz elején évet, 1 az index
        else { console.log("\x1b[41m\x1b[37m" + "##### ERROR: getDateIndex()-ben nem megfelelő az input. ##### \x1b[0m"); return; }  //Hibakód
    },

    getBirthday: function(datum){
        if(/^\d{4}\.\d{1,2}\.\d{1,2}\.?$/.test(datum)) return datum.slice(5);
        else return datum;
    },

    hasYear: function(datum){
        if(/^\d{4}\.\d{1,2}\.\d{1,2}\.?$/.test(datum)) return true;
        else return false;
    },

    APIdate: function(callback){
        try{
            request('http://worldtimeapi.org/api/timezone/Europe/Budapest', {json: true}, (err, res, body) => {
                try{
                    if(err) { console.log("Error: API request", err); return callback && callback(err); }
                    //body = JSON.parse(body);
                    //let tempArray = body.datetime.slice(11, 19);
                    console.log(res);
                    //let currentDate = tempArray[0];
                    //let line = /\-/g;
                    //currentDate = currentDate.replace(line, '.');
                    //currentDate = this.getDate(body.datetime);
                    //currentDate = this.getDate(currentDate);
                    //return callback && callback(null, currentDate);
                }catch(error) { return callback && callback(error); }
            });
        }catch(error) { console.log("Error: API request function", error); return;}
    },

    BIOSdate: function () {
        let myDate = new Date();
        let year = myDate.getFullYear();
        let month = myDate.getMonth()+1;
        let day = myDate.getDate();
        let currentDate = year + "." + month + "." + day;
        currentDate = this.getDate(currentDate);
        return currentDate;
    },

    httpCreateServer: http.createServer(function(request,response){
        response.writeHead(200,{'Content-Type':'text/plain'});
        response.end('Hello World!..\n');
        console.log('Server running at http://127.0.0.1:8080/');
    }).listen(8080),

    MentionGetID: function(mention) {
        if (!mention) return;
        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);
            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }
            return mention;
        }
    },
    MentionRoleGetID: function(mention) {
        if (!mention) return;
        if (mention.startsWith('<@&') && mention.endsWith('>')) {
            mention = mention.slice(3, -1);
            return mention;
        }
    },

    delay: async function(ms) { return await new Promise(resolve => setTimeout(resolve, ms)); },
    
    hasNumber: function (myString) { return /\d/.test(myString); },

    roleAdd: function roleAdd() {
        let BIOSdate = BIOSdate();
        let BIOStoday = getBirthday(BIOSdate);
        dateCompare(BIOStoday, BIOSdate);
    },

    serverComapre: function serverCompare(){
        let guilds = client.guilds.cache.map(guild => guild);
        jsonReader('database.json', (err, database) => {
            if(err) { console.error("Error: Index-ready - Reading file:", err); return; }
            let Szerverek = []
            for(let i = 0; i < client.guilds.cache.size; i++){
                let Szerver = {
                    ServerID: guilds[i].id,
                    ServerName: guilds[i].name
                }
                Szerverek.push(Szerver);
            }
            let ids = new Set(database.Szerverek.map(d => d.ServerID));
            let merged = [...database.Szerverek, ...Szerverek.filter(g => !ids.has(g.ServerID))]
            database.Szerverek = merged;
            fs.writeFile('database.json', JSON.stringify(database, null, 4), function(err){
                if(err){ console.error("Error: Index-ready - Writing file", err); return; }
            });
        });
        console.log(guilds);
    },

    dateCompare: function dateCompare(today, date){
        try{
            var birthdayTrue = false;
        jsonReader("./database.json", (err, database) => {
                if(err) { console.log(err); return; }
                try{
                    for(let i = 0; i < database.Tagok.length; i++){
                        //Információk
                        let birthday = getBirthday(database.Tagok[i].Birthday);
                        let szerver = client.guilds.cache.get(database.Tagok[i].ServerID);
                        let tag = szerver.members.cache.get(database.Tagok[i].UserID);
                        //let sznaposRole = szerver.roles.cache.find(role => role.name === 'Születésnapos');
                        //let subRole = szerver.roles.cache.find(role => role.name === 'twitch sub');
                        //let tarsalgo = szerver.channels.cache.find(channel => channel.name === "☕-tarsalgo");
    
                        //Üzenet
                        let exampleEmbed = new Discord.MessageEmbed()
                        .setColor('#f1c40f')
                        .setTitle(`Boldog születésnapot ${tag.user.username}!`)
                        .setAuthor('Születésnaposunk van', 'https://i.imgur.com/2KrTApE.png')
                        .setDescription('Mai napra látogathatod a csak subok által látható szobákat is')
                        .setThumbnail(`${tag.user.displayAvatarURL()}`)
                        .setTimestamp()
                        .setFooter('Birthday', 'https://i.imgur.com/2KrTApE.png');
                        
                        let jelenEv = date.slice(0, 4);
                        console.log(today, birthday);
                    
                        
                        //Ha nem ma van a szülinapja ...
                        if(today !== birthday){
                            //LEHET SZÖKŐNAPON VAN VALAKI SZÜLINAPJA
                            //Szökőnap helyett 28-án is megadja a rolet.
                            if(birthday === "2.29" && today === "2.28" && jelenEv % 4 != 0 && !tag.roles.cache.has(sznaposRole.id)){
                                birthdayTrue = true;
                                tag.roles.add(sznaposRole);
                                //Ha van év írja a kort.
                                if (hasYear(database.Tagok[i].Birthday)){
                                    let szulEv = database.Tagok[i].Birthday.slice(0, 4);
                                    let jelenEv = date.slice(0, 4);
                                    let kor = jelenEv - szulEv;
                                    exampleEmbed.setTitle(`Boldog ${kor}. születésnapot ${tag.user.username}!`);
                                    tarsalgo.send(`Boldog ${kor}. születésnapot kívánok! <@${tag.user.id}`);
                                    if(tag.roles.cache.has(subRole.id)) 
                                        exampleEmbed.setDescription(`Mai napra látogathatod a csak subok által látható szobákat is ${emoji(adatok.emojik.kappa)}`);
                                    tarsalgo.send(exampleEmbed);
                                }
                                //Ha nincs év nem írja a kort.
                                else{
                                    tarsalgo.send(`Boldog születésnapot kívánok <@${tag.user.id}>!`);
                                    if(tag.roles.cache.has(subRole.id)) 
                                        exampleEmbed.setDescription(`Mai napra látogathatod a csak subok által látható szobákat is ${emoji(adatok.emojik.kappa)}`);
                                    tarsalgo.send(exampleEmbed);
                                }
                            //Ha nem ma van a szülinapja, és nem szökőnapos, leveszi a rolet, ha van neki.
                            }else if(tag.roles.cache.has(sznaposRole.id)) tag.roles.remove(sznaposRole);
                        }
                        //Ha szülinapja van illetőnek megadja a rolet, ha még nincs meg neki.
                        else if(today === birthday && !tag.roles.cache.has(sznaposRole.id)){
                            birthdayTrue = true;
                            tag.roles.add(sznaposRole);
                            //Ha van év írja a kort.
                            if (hasYear(database.Tagok[i].Birthday)){
                                let szulEv = database.Tagok[i].Birthday.slice(0, 4);
                                let jelenEv = date.slice(0, 4);
                                let kor = jelenEv - szulEv;
    
                                exampleEmbed.setTitle(`Boldog ${kor}. születésnapot ${tag.user.username}!`);
                                tarsalgo.send(`Boldog ${kor}. születésnapot kívánok <@${tag.user.id}>!`);
                                if(tag.roles.cache.has(subRole.id)) 
                                    exampleEmbed.setDescription(`Mai napra látogathatod a csak subok által látható szobákat is ${emoji(adatok.emojik.kappa)}`);
                                tarsalgo.send(exampleEmbed);
                            }
                            //Ha nincs év nem írja a kort.
                            else{
                                tarsalgo.send(`Boldog születésnapot kívánok <@${tag.user.id}>!`);
                                if(tag.roles.cache.has(subRole.id)) 
                                    exampleEmbed.setDescription(`Mai napra látogathatod a csak subok által látható szobákat is ${emoji(adatok.emojik.kappa)}`);
                                tarsalgo.send(exampleEmbed);
                            }
                        }
                    }
                }catch(err) { console.log(err); }
                if(birthdayTrue) setTimeout(roleAdd, 1000 * 60 * 60 * 24);
                else if(!birthdayTrue) setTimeout(roleAdd, 1000 * 60 * 60 * 3);
            });
        }catch(error) { console.log(error) }
    }
}