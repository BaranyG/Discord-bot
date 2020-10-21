const {client} = require("./index.js");  //Discord kliens importálása a main fájlból
const fs       = require('fs');          //Fájlkezelő parancsok importálása
const http     = require('http');        //HTTP importálása
const request  = require('request');     //request importálása
module.exports = {
    jsonReader: function(filepath, callback){
        fs.stat(filepath, function(err, stat) {
            if(err == null){
                let filename = filepath.substring(filepath.lastIndexOf('/')+1, filepath.length);
                console.log(`File "${filename}" exists.`);
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
            }else if(err.code === "ENOENT") console.log(`File "${filename}" doesn't exist.`);
            else console.log("Some other error:", err.code);
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
                if(1920 <= datumArray[0] && datumArray[0] <= 2010); else return false;  //1920-2010 intervallum
                if(datumArray[1] == 2){                                                 //Szököév ellenőrzés
                    if(datumArray[0] % 4 == 0){                                         //ha szökőév febr. 1-29
                        if(0 < datumArray[2] && datumArray[2] < 30); else return false;
                    }else {                                                             //ha nem szökőév, febr. 1-28
                        if(0 < datumArray[2] && datumArray[2] < 29); else return false; 
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
        else { console.log("Error #F16: Nem lehet lekérni az indexet."); return; }  //Hibakód
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
                    let tempArray = body.datetime.split('T');
                    let currentDate = tempArray[0];
                    let line = /\-/g;
                    currentDate = currentDate.replace(line, '.');
                    currentDate = this.getDate(currentDate);
                    return callback && callback(null, currentDate);
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
}