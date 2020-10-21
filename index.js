const killuaToken = 'NzMwMTA4NjgyNzA4MTg5MjQ3.XwTLoQ.sTHp4ejC1ZKBH5lW80957Ggvcyw'; // Killua bot - TOKEN
const BGToken = 'NzMwMTQyNjM2MjI4NDc3MDE4.XxV1Kg.Cr9PqxfHylu4DH6C7ucIjfBT-HM'; // BaranyG bot - TOKEN
const Discord  = require('discord.js');       //Discord funkciók
const fs       = require('fs');               //Fájlkezelés funkciók
const { jsonReader } = require('./functions.js');
const func     = require('./functions.js');   //Saját funkciók
const adatok   = require('./ID.js');          //Adatok
const client   = new Discord.Client();        //Discord kliens létrehozása
module.exports = {client};                    //Discord kliens exportálása
const prefix   = "!";                         //Prefix, parancs 'jelző'

//Parancsok beolvasása
client.commands = new Discord.Collection();                     //parancs collection létrehozása, Kezelés miatt.
const commandFiles = fs.readdirSync('./Commands/').filter(file => file.endsWith('js'));     //commands mappa beolvasása.
for(const file of commandFiles){
    const command = require(`./Commands/${file}`);                                          //commands mappában fájlok beolvasása.
    client.commands.set(command.name, command);
}

//Funkciók
function emoji (id) { return client.emojis.cache.get(id).toString(); }
console.log("BIOS Mai dátum:", func.BIOSdate());                //lekérdezi mai dátumot BIOS-ból
func.APIdate((err, datum) => {                                  //lekérdezi mai dátumot HTTP-ről
    if(err) { console.log("Error: Indexben APIdate nem fut le.", err); return; }
    console.log("API request from HTTP:", datum);
});

function dateCompare(today, date){
    try{
        var birthdayTrue = false;
        func.jsonReader("./database.json", (err, database) => {
            if(err) { console.log(err); return; }
            try{
                for(let i = 0; i < database.Tagok.length; i++){
                    //Információk
                    let birthday = func.getBirthday(database.Tagok[i].Birthday);
                    let szerver = client.guilds.cache.get(database.Tagok[i].ServerID);
                    let tag = szerver.members.cache.get(database.Tagok[i].UserID);
                    let sznaposRole = szerver.roles.cache.find(role => role.name === 'Születésnapos');
                    let subRole = szerver.roles.cache.find(role => role.name === 'twitch sub');
                    let tarsalgo = szerver.channels.cache.find(channel => channel.name === "☕-tarsalgo");

                    if(szerver===undefined || tag===undefined) continue;

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
                        //Szökőnap helyett 28-án is megadja a rolet.
                        if(birthday === "2.29" && today === "2.28" && jelenEv % 4 != 0 && !tag.roles.cache.has(sznaposRole.id)){
                            birthdayTrue = true;
                            tag.roles.add(sznaposRole);
                            //Ha van év írja a kort.
                            if (func.hasYear(database.Tagok[i].Birthday)){
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
                        if (func.hasYear(database.Tagok[i].Birthday)){
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

function roleAdd() {
    try{
        func.APIdate((err, APIdate) => {
            if(err) { console.log(err);  
                let BIOSdate = func.BIOSdate();
                let BIOStoday = func.getBirthday(BIOSdate);
                dateCompare(BIOStoday, BIOSdate);
            }
            let APItoday = func.getBirthday(APIdate);
            dateCompare(APItoday, APIdate);
        });
    }catch(error) { console.log(err); return; }
};

function serverCompare(){
    let guilds = client.guilds.cache.map(guild => guild);
    jsonReader('database.json', (err, database) => {
        if(err) { console.log("Error: Index-ready - Reading file:", err); return; }
        let Szerverek = [];
        //for(let i = 0; i < database.Szerverek.length; i++){
            for(let j = 0; j < client.guilds.cache.size; j++){
                
                let Szerver = {
                    ServerID: guilds[j].id,
                    ServerName: guilds[j].name
                }
                Szerverek.push(Szerver); 
            }
        //}
        database.Szerverek = Szerverek;
        fs.writeFile('database.json', JSON.stringify(database, null, 4), function(err){
            if(err){ hibaUzenetDelete("Error: Index-ready - Writing file"); console.log("Error: Index-ready - Writing file", err); return; }
        });
    });
    
    console.log(guilds);
}

//EVENTS!!!
//Login
client.once('ready', () => {
    console.log('Birthday is online!');
    console.log(`Logged in as ${client.user.tag}!`);
    
    serverCompare();
});

//Commands
client.on('message', message => {


    //Gabesz reakció
    if(message.content.toLowerCase().includes("gabesz") && !message.author.bot && !message.content.startsWith(prefix)){
        message.react(adatok.emojik.gabesz);
    }
    //Bögre reakció
    if(message.content.toLowerCase().includes("bogre") && !message.author.bot && !message.content.startsWith(prefix)){
        message.react(adatok.emojik.bogre);
        if(message.author.id===adatok.felhasznalok.Lillilillol){
            if(message.content.toLowerCase().includes("🍵"))
                message.react("🍵");
            if(message.content.toLowerCase().includes("🥣"))
                message.react("🥣");
        }
    }
    
    
    //Command dolgok
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    //Szoba beállítása:
    if(command==='botszoba')
        client.commands.get('botszoba').execute(client, message, args, func);

    func.jsonReader('database.json', (err, database) => {
        if(err) { console.log("Error: Index-message - Reading file:", err); return; }
        for(let i = 0; i < database.Szerverek.length; i++){
            if(database.Szerverek[i].ServerID == message.guild.id && database.Szerverek[i].ChannelID == message.channel.id){ 
                
                //Szülinap parancs
                if(command==='szülinap'){
                    client.commands.get('szulinap').execute(client, message, args, func);
                    roleAdd();
                    return;
                }
                //Frissít parancs
                else if(command==='frissít'){
                    roleAdd(); message.channel.send('Frissítve!');
                    return;
                }

                //Help parancs
                else if(command==="parancsok"){
                    client.commands.get('parancsok').execute(client, message, args, func);
                }

                //Modok parancsai:
                if(message.member.roles.cache.has()){
                    //Módosítás parancs
                    if(command==='módosít'){
                        client.commands.get('modosit').execute(client, message, args, func);
                        return;
                    }
                
                //Modok parancsai, ha pleb próbálja meg:
                }else {
                    //Módosítás parancs
                    if(command==='módosít'){
                        message.reply("Kérj meg rá egy aktív moderátort.");
                        return;
                    }
                }
                
            break;
        }
    }
});
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
    
});

client.on("channelUpdate", (oldChannel, newChannel) => {
    
});

client.on('messageDelete', message => {
    if(message.guild.id == adatok.unlimited.id){
        let exampleEmbed = new Discord.MessageEmbed()
        .setColor('#e03030')
        .setAuthor(`Törölt üzenet ${message.channel.name} szobából`, `${message.guild.iconURL()}`)
        .setTitle(`${message.author.username}`)
        .setDescription(`${message.content}`)
        .setThumbnail(`${message.author.displayAvatarURL()}`)
        .setTimestamp();

        let guild = client.guilds.cache.get(adatok.faszporgetok.id)
        let channel = guild.channels.cache.get(adatok.faszporgetok.auditlog);
        channel.send(exampleEmbed);
    }
});

func.httpCreateServer;

//Token
client.login(BGToken);
//Discord szín: #ff00e5




/* Mentés:


const killuaToken = 'NzMwMTA4NjgyNzA4MTg5MjQ3.XwTLoQ.sTHp4ejC1ZKBH5lW80957Ggvcyw'; // Killua bot - TOKEN
const BGToken = 'NzMwMTQyNjM2MjI4NDc3MDE4.XxV1Kg.Cr9PqxfHylu4DH6C7ucIjfBT-HM'; // BaranyG bot - TOKEN
const Discord  = require('discord.js');       //Discord funkciók
const fs       = require('fs');               //Fájlkezelés funkciók
const func     = require('./functions.js');   //Saját funkciók
const adatok   = require('./ID.js');          //Adatok
const client   = new Discord.Client();        //Discord kliens létrehozása
module.exports = {client};                    //Discord kliens exportálása
const prefix   = "!";                         //Prefix, parancs 'jelző'

//Parancsok beolvasása
client.commands = new Discord.Collection();                     //parancs collection létrehozása, Kezelés miatt.
const commandFiles = fs.readdirSync('./Commands/').filter(file => file.endsWith('js'));     //commands mappa beolvasása.
for(const file of commandFiles){
    const command = require(`./Commands/${file}`);                                          //commands mappában fájlok beolvasása.
    client.commands.set(command.name, command);
}

//Funkciók
function emoji (id) { return client.emojis.cache.get(id).toString(); }
console.log("BIOS Mai dátum:", func.BIOSdate());                //lekérdezi mai dátumot BIOS-ból
func.APIdate((err, datum) => {                                  //lekérdezi mai dátumot HTTP-ről
    if(err) { console.log("Error: Indexben APIdate nem fut le.", err); return; }
    console.log("API request from HTTP:", datum);
});

function compare(today, date){
    try{
        var birthdayTrue = false;
        func.jsonReader("./database.json", (err, database) => {
            if(err) { console.log(err); return; }
            try{
                for(let i = 0; i < database.Tagok.length; i++){
                    //Információk
                    var birthday = func.getBirthday(database.Tagok[i].Birthday);
                    var szerver = client.guilds.cache.get(database.Tagok[i].ServerID);
                    var tag = szerver.members.cache.get(database.Tagok[i].UserID);
                    var sznaposRole = szerver.roles.cache.find(role => role.name === 'Születésnapos');
                    var subRole = szerver.roles.cache.find(role => role.name === 'twitch sub');
                    var tarsalgo = szerver.channels.cache.find(channel => channel.name === "☕-tarsalgo");

                    if(tag===undefined) continue;

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
                        //Szökőnap helyett 28-án is megadja a rolet.
                        if(birthday === "2.29" && today === "2.28" && jelenEv % 4 != 0 && !tag.roles.cache.has(sznaposRole.id)){
                            birthdayTrue = true;
                            tag.roles.add(sznaposRole);
                            //Ha van év írja a kort.
                            if (func.hasYear(database.Tagok[i].Birthday)){
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
                        if (func.hasYear(database.Tagok[i].Birthday)){
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

function roleAdd() {
    try{
        func.APIdate((err, APIdate) => {
            if(err) { console.log(err);  
                var BIOSdate = func.BIOSdate();
                var BIOStoday = func.getBirthday(BIOSdate);
                compare(BIOStoday, BIOSdate);
            }
            let APItoday = func.getBirthday(APIdate);
            compare(APItoday, APIdate);
        });
    }catch(error) { console.log(err); return; }
};

//EVENTS!!!
//Login
client.once('ready', () => {
    console.log('Birthday is online!');
    console.log(`Logged in as ${client.user.tag}!`);
    
    const faszporgetok = client.guilds.cache.get(adatok.faszporgetok.id);
    const tarsalgo2 = faszporgetok.channels.cache.get(adatok.faszporgetok.tarsalgo);
    const teszt     = faszporgetok.channels.cache.get("378678511436693507");
    const unlimited = client.guilds.cache.get(adatok.unlimited.id);
    const tarsalgo  = unlimited.channels.cache.get(adatok.unlimited.tarsalgo);
    

    //console.log(unlimited.members.cache.get("369233636802691081"));

    const memeskut  = unlimited.channels.cache.get(adatok.unlimited.memeskut);
    const sobanya   = unlimited.channels.cache.get(adatok.unlimited.sobanya);

    const gameday = client.guilds.cache.get("753983895707582567");
    const szabalyok = gameday.channels.cache.get("753986331356561489");

    let exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0A64C4')
        .setAuthor(`Jelenleg csak a Discord Terms of Service érvényes a szerverre`)
        .setTitle(`Discord Terms of Service`)
        .setURL('https://discord.com/terms');

    //teszt.send(exampleEmbed);

    if(tarsalgo.type=='text'){
        tarsalgo.messages.fetch({limit:100}).then(messages => {
            messages.filter(message => {
                if(message.content.includes("bogre") && !message.author.bot && !message.content.startsWith(prefix)){
                    message.react(adatok.emojik.bogre);
                    if(message.author.id===adatok.felhasznalok.Lillilillol){
                        if(message.content.includes("🍵"))
                            message.react("🍵");
                        if(message.content.includes("🥣"))
                            message.react("🥣");
                    }
                }
            });
        }).catch(err => {
            console.log(err);
        });
    }
    
    memeskut.messages.fetch();
    sobanya.messages.fetch();

    //client.guilds.cache.get(adatok.faszporgetok.id).channels.cache.get(adatok.faszporgetok.tarsalgo).send(emoji(adatok.emojik.feelsokayman) + emoji(adatok.emojik.bogre));
    
    roleAdd();
});

//Commands
client.on('message', message => {
    //Gabesz szöveg
    if(message.content.toLowerCase().includes("gabesz") && !message.author.bot && !message.content.startsWith(prefix)){
        message.react(adatok.emojik.gabesz);
    }
    if(message.content.toLowerCase().includes("bogre") && !message.author.bot && !message.content.startsWith(prefix)){
        message.react(adatok.emojik.bogre);
        if(message.author.id===adatok.felhasznalok.Lillilillol){
            if(message.content.toLowerCase().includes("🍵"))
                message.react("🍵");
            if(message.content.toLowerCase().includes("🥣"))
                message.react("🥣");
        }
    }
    
    const szerver = message.guild;
    const tarsalgo = szerver.channels.cache.find(channel => channel.name === "☕-tarsalgo");
    const mod = szerver.roles.cache.find(role => role.name === 'mod')
    //Command dolgok
    if(!message.content.startsWith(prefix) || message.author.bot || message.channel.id !== tarsalgo.id)
        return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    //Szülinap parancs
    if(command==='szülinap'){
        client.commands.get('szulinap').execute(client, message, args, func);
        roleAdd();
        return;
    }
    //Frissít parancs
    else if(command==='frissít'){
        roleAdd(); message.channel.send('Frissítve!');
        return;
    }
    //Help parancs
    else if(command==="parancsok"){
        client.commands.get('parancsok').execute(client, message, args, func);
    }

    //Modok parancsai:
    if(message.member.roles.cache.has("353965515334746114" || "378681719496245248")){
        //Módosítás parancs
        if(command==='módosít'){
            client.commands.get('modosit').execute(client, message, args, func);
            return;
        }
    
    //Modok parancsai, ha pleb próbálja meg:
    }else {
        //Módosítás parancs
        if(command==='módosít'){
            message.reply("Kérj meg rá egy aktív moderátort.");
            return;
        }
    }
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
    
});

client.on("channelUpdate", (oldChannel, newChannel) => {
    let guild = client.guilds.cache.get(adatok.faszporgetok.id)
    let channel = guild.channels.cache.get(adatok.faszporgetok.auditlog);

    let exampleEmbed = new Discord.MessageEmbed()
        .setColor('#3030e0')
        .setAuthor(`Módosult szoba: ${oldChannel.name}`, `${oldChannel.guild.iconURL()}`)
        .setTitle(`${message.author.username}`)
        .setDescription(`${message.content}`)
        .setThumbnail(`${message.author.displayAvatarURL()}`)
        .setTimestamp();
    
    oldChannel

});

client.on('messageDelete', message => {
    if(message.guild.id == adatok.unlimited.id){
        let exampleEmbed = new Discord.MessageEmbed()
        .setColor('#e03030')
        .setAuthor(`Törölt üzenet ${message.channel.name} szobából`, `${message.guild.iconURL()}`)
        .setTitle(`${message.author.username}`)
        .setDescription(`${message.content}`)
        .setThumbnail(`${message.author.displayAvatarURL()}`)
        .setTimestamp();

        let guild = client.guilds.cache.get(adatok.faszporgetok.id)
        let channel = guild.channels.cache.get(adatok.faszporgetok.auditlog);
        channel.send(exampleEmbed);
    }
});

func.httpCreateServer;

//Token
client.login(BGToken);
//Discord szín: #ff00e5






*/