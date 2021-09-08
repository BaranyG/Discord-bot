const fs       = require('fs');
const http     = require('http');
const request  = require('request');
const Discord  = require('discord.js');
const client   = require('./index.js');
module.exports =  {
    name: 'functions',
    description: 'Itt van az összes saját funkció',
    //Async (JSON) fájl beolvasás
    jsonReader: function(filepath, callback){
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
    },

    formatDate: function(datum){
        if(datum===undefined){
            console.log("formatDate() undefined paramétert kap.");
            return;
        }
        datum.toString();
        //Ezt nem kell magyarázni ez tök könnyű
        //(Ellenőrzi a dátum formátumát, hogy megfelelő-e, és leszűkíti az érvényes dátumok számát)
        if(/^([1-2](9|0)[0-9]{2}\.)?[0-1]?[0-9]\.[0-3]?[0-9]\.?$/.test(datum))
            return true;
        else return false;
    },

    validDate: function(datum){
        //Dátum formázása
        datum = this.getDate(datum)
        //(Év,) hónap, napra bontja az adatot
        let datumArray = datum.split('.');
        //Index létrehozása
        let index = this.getDateIndex(datum);
        if(index==2){
            //1920-2010 intervallum
            if(!(1920 <= datumArray[0] && datumArray[0] <= 2010))
                return false;
            if(datumArray[1] == 2){
                //Szököév ellenőrzés
                if(datumArray[0] % 4 == 0){
                    //ha szökőév febr. 1-29
                    if(!(0 < datumArray[2] && datumArray[2] < 30))
                        return false;
                }else {
                    //ha nem szökőév, febr. 1-28
                    if(!(0 < datumArray[2] && datumArray[2] < 29))
                        return false;
                }
            }
        }
        if(index==1){
            //Ha nincs megadva év -> feb. 1-29 nap
            if(datumArray[0] == 2)
                if(!(0 < datumArray[1] < 30))
                return false;
            //1-12 lehet a hónap
            if(!(0 < datumArray[index-1] && datumArray[index-1] < 13))
                return false;
            //1-31 lehet a nap
            if(!(0 < datumArray[index] && datumArray[index] < 32))
                return false;
            //ápr. jún. szep. és nov. -ben 1-30 nap
            if(/(4|6|9|11)/.test(datumArray[index-1]))
                if(!(0 < datumArray[index] && datumArray[index] < 31))
                    return false;
        }
        //Igazzal tér vissza, ha érvényes dátum
        return true;
    },

    getDate: function(datum){
        if(datum==undefined){
            console.log("getDate function undefined paramétert kap");
            return;
        }
        //Adat szöveggé alakítása, hiba elkerülése érdekében
        datum = datum.toString();
        //Eltünteti végéről a pontot ha van
        if(datum.endsWith('.'))
            datum.slice(0,-1);
        //(Év,) hónap, napra bontja az adatot
        let datumArray = datum.split('.');
        //Index létrehozása
        let index = this.getDateIndex(datum);
        if(datumArray[index-1] != 10) 
            //szükségtelen 0-k eltüntetése
            datumArray[index-1] = datumArray[index-1].replace('0', '');
        if(!/(10|20|30)/.test(datumArray[index]))
            //szükségtelen 0-k eltüntetése
            datumArray[index] = datumArray[index].replace('0', '');
        if(index==2) 
            //Dátum mentése
            datum = datumArray[0] + '.' + datumArray[1] + '.' + datumArray[2];
        else if(index==1) 
            //Dátum mentése
            datum = datumArray[0] + '.' + datumArray[1];   
        //Visszatér üresen, ha az index 0;
        else return;
        //Visszatérés felülírt dátummal  
        return datum;
    },

    getDateIndex: function(datum){
        //Ha tartalmaz évet, 2 az index.
        if(/^\d{4}\.\d{1,2}\.\d{1,2}\.?$/.test(datum))
            return 2;
        //Ha nem tartalmaz elején évet, 1 az index
        else if(/^\d{1,2}\.\d{1,2}\.?$/.test(datum)) 
            return 1;
        else { 
            console.log("\x1b[41m\x1b[37m" + 
            "##### ERROR: getDateIndex()-ben nem megfelelő az input. #####"
            + "\x1b[0m"); 
            return;
        }  
    },

    getBirthday: function(datum){
        if(/^\d{4}\.\d{1,2}\.\d{1,2}\.?$/.test(datum)) 
            return datum.slice(5);
        else return datum;
    },

    hasYear: function(datum){
        if(/^\d{4}\.\d{1,2}\.\d{1,2}\.?$/.test(datum)) 
            return true;
        else return false;
    },

    WorldTime_API: function(callback){
        try{
            request('http://worldtimeapi.org/api/timezone/Europe/Budapest',
            {json: true}, (err, res, body) => {
                try{
                    if(err) { 
                        console.log("Error: API request", err); 
                        return callback && callback(err); 
                    }
                    let temp = body.datetime.split('T')
                    let date = temp[0];
                    date = date.replace(/\-/g, '.');
                    date = this.getDate(date);
                    return callback && callback(null, date);
                }catch(error) {
                    return callback && callback(error);
                }
            });
        }catch(error) {
            console.log("Error: World Time API request function", error); 
            return;
        }
    },

    BIOSdate: function() {
        let myDate = new Date();
        let month = myDate.getMonth()+1;
        let date = myDate.getFullYear() + "." + month + "." + myDate.getDate();
        date = this.getDate(date);
        return date;
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

    emoji: function emoji (id) { return client.emojis.cache.get(id).toString(); },

    roleAdd: function() {
        try{
            this.WorldTime_API((err, APIdate) =>{
                if(err){
                    console.log(err);
                    let BIOSdate = this.BIOSdate();
                    let BIOStoday = this.getBirthday(BIOSdate);
                    this.dateCompare(BIOStoday, BIOSdate);
                }
                let APItoday = this.getBirthday(APIdate);
                this.dateCompare(APItoday, APIdate);
            });
        }catch(error){
            console.log(error);
            return;
        }
    },

    serverCompare: function(){
        let guilds = client.guilds.cache.map(guild => guild);
        this.jsonReader('database.json', (err, database) => {
            if(err){
                console.error("Error: Index-ready - Reading file:", err);
                return;
            }
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
                if(err){
                    console.error("Error: Index-ready - Writing file", err);
                    return;
                }
            });
        });
    },

    dateCompare: function(today, date){
        try{
            var birthdayTrue = false;
            this.jsonReader("./database.json", (err, database) => {
                if(err) { console.log(err); return; }
                try{
                    for(let i = 0; i < database.Tagok.length; i++){
                        //Információk
                        let birthday = this.getBirthday(database.Tagok[i].Birthday);
                        let szerver = client.guilds.cache.get(database.Tagok[i].ServerID);
                        let tag = szerver.members.cache.get(database.Tagok[i].UserID);
                        var tarsalgo;
                        for(let j = 0; j < database.Szerverek.length; j++){
                            if(szerver == database.Szerverek[j].ServerID)
                                tarsalgo = szerver.channels.cache.get(database.Szerverek[j].BotChannelID);
                                break;
                        }
                        //Ha a felhasználó (jelenlegi) neve nem egyezik az adatbáziséval, írja felül az adatbázist az újjal.
                        if(tag.user.username !== database.Tagok[i].Username){
                            database.Tagok[i].Username = tag.user.username;
                            fs.writeFile('./database.json', JSON.stringify(database, null, 4), function(err){
                                if(err){ 
                                    hibaUzenetDelete("Error: Username - Writing file #2"); 
                                    console.log("Error: Username - Writing file #2", err); 
                                    return; 
                                }
                                return;
                            });
                        }
                        

                        //Üzenet
                        let exampleEmbed = new Discord.MessageEmbed()
                        .setColor('#f1c40f')
                        .setTitle(`Boldog születésnapot ${tag.user.username}!`)
                        .setAuthor('Születésnaposunk van', 'https://i.imgur.com/2KrTApE.png')
                        .setThumbnail(`${tag.user.displayAvatarURL()}`)
                        .setTimestamp()
                        .setFooter('Birthday', 'https://i.imgur.com/2KrTApE.png');
                        
                        let jelenEv = date.slice(0, 4);
                        console.log(today, birthday);

                        //Ha nem ma van a szülinapja ...
                        if(today !== birthday){
                            //LEHET SZÖKŐNAPON VAN VALAKI SZÜLINAPJA
                            //Szökőnap helyett 28-án is megadja a rolet.
                            if(birthday === "2.29" && today === "2.28" && jelenEv % 4 != 0){
                                birthdayTrue = true;
                                //Ha van év írja a kort.
                                if (this.hasYear(database.Tagok[i].Birthday)){
                                    let szulEv = database.Tagok[i].Birthday.slice(0, 4);
                                    let jelenEv = date.slice(0, 4);
                                    let kor = jelenEv - szulEv;
                                    exampleEmbed.setTitle(`Boldog ${kor}. születésnapot ${tag.user.username}!`);
                                    tarsalgo.send(`Boldog ${kor}. születésnapot kívánok! <@${tag.user.id}`);
                                    tarsalgo.send(exampleEmbed);
                                }
                                //Ha nincs év nem írja a kort.
                                else{
                                    tarsalgo.send(`Boldog születésnapot kívánok <@${tag.user.id}>!`);
                                    tarsalgo.send(exampleEmbed);
                                }
                            }
                        }
                        //Ha szülinapja van illetőnek megadja a rolet, ha még nincs meg neki.
                        else if(today === birthday){
                            birthdayTrue = true;
                            //Ha van év írja a kort.
                            if (this.hasYear(database.Tagok[i].Birthday)){
                                let szulEv = database.Tagok[i].Birthday.slice(0, 4);
                                let jelenEv = date.slice(0, 4);
                                let kor = jelenEv - szulEv;
                                exampleEmbed.setTitle(`Boldog ${kor}. születésnapot ${tag.user.username}!`);
                                tarsalgo.send(`Boldog ${kor}. születésnapot kívánok <@${tag.user.id}>!`);
                                tarsalgo.send(exampleEmbed);
                            }
                            //Ha nincs év nem írja a kort.
                            else{
                                tarsalgo.send(`Boldog születésnapot kívánok <@${tag.user.id}>!`);
                                tarsalgo.send(exampleEmbed);
                            }
                        }
                    }
                }catch(err) {
                    console.log(err);
                }
                //Ha volt ma szülinapos, 24 óra múlva fusson le legközelebb
                if(birthdayTrue) setTimeout(this.roleAdd, 1000 * 60 * 60 * 24);
                //Ha nem volna ma szülinapos, 3 óra múlva fusson le legközelebb
                else if(!birthdayTrue) setTimeout(this.roleAdd, 1000 * 60 * 60 * 3);
            });
        }catch(error) {
            console.log(error)
        }
    }
}