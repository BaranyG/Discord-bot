module.exports = (Discord, client, func) => {


    console.log("ez tok konnyu xd");
    //client.user.setActivity(`Online ${client.guilds.cache.size} szerveren`);
    client.user.setActivity(`Veri a faszát ${client.guilds.cache.size} szerveren`);
    console.log("\x1b[32m" + 'Birthday is online!' + "\x1b[0m");
    console.log("\x1b[32m" + `Logged in as ${client.user.tag}!` + "\x1b[0m");
    console.log("\x1b[32m" + "BIOS Mai dátum:", func.BIOSdate()  + "\x1b[0m");        //lekérdezi mai dátumot BIOS-ból
        
    //let faszporgetok = client.guilds.cache.get(adatok.faszporgetok.id)
    //let baranyg = faszporgetok.members.cache.map(member => member.id);

    //client.functions.get('dateCompare').execute(client, func);

    //console.log(unlimited.members.cache.map(member => member.user.username));
    //client.guilds.cache.get(adatok.unlimited.id).channels.cache.get(adatok.unlimited.tarsalgo).send(exampleEmbed);
    //client.guilds.cache.get(adatok.faszporgetok.id).channels.cache.get(adatok.faszporgetok.tarsalgo).send(emoji(adatok.emojik.feelsokayman) + emoji(adatok.emojik.bogre));

    //serverCompare();
    func.httpCreateServer;
}

