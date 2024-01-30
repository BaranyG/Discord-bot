const fs       = require('fs');
const http     = require('http');
const request  = require('request');
const Discord  = require('discord.js');
const client   = require('./index.js');
module.exports = {
    name: 'functions',
    description: 'Itt van az összes saját függvény',
    //Async (JSON) fájl beolvasás
    jsonReader: async function(filepath, callback){
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) {
                console.log("Error: File read failed:");
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

    BIOSdate: function() {
        let myDate = new Date();
        let month = myDate.getMonth()+1;
        let date = myDate.getFullYear() + "." + month + "." + myDate.getDate();
        return date;
    },

    WorldTime_API: async function(callback){
        try{
            request('http://worldtimeapi.org/api/timezone/Europe/Budapest',
            {json: true}, (err, res, body) => {
                if(err) { 
                    console.log("Error: API request", err); 
                    return callback && callback(err); 
                }
                let temp = body.datetime.split('T')
                let date = temp[0];
                date = date.replace(/\-/g, '.');
                return callback && callback(null, date);
            });
        }catch(error) {
            console.log("Error: World Time API request function", error); 
            throw err;
        }
    },

    httpCreateServer: http.createServer(function(request,response){
        response.writeHead(200,{'Content-Type':'text/plain'});
        response.end('Hello World!..\n');
        console.log('Server running at http://127.0.0.1:5000/');
    }).listen(5000),

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
   
}