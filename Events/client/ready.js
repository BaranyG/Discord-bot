const pilates = require("../../Pilates/pilates");

module.exports = (Discord, client, func) => {
    //pilates.execute(Discord, client);

    client.user.setActivity( { type: 2, name: "!help"  } );
    //client.user.setActivity(`Veri a faszát ${client.guilds.cache.size} szerveren`, { type: 'Playing' } );

    console.log("\x1b[32m" + 'Iranai bot is online!' + "\x1b[0m");
    
    console.log("\x1b[32m" + `Logged in as ${client.user.tag}!` + "\x1b[0m");
    
    console.log("\x1b[32m" + 'Lillililloli: それは、Lillililloli でわないけど、Lillilillol だよう。' + "\x1b[0m");
    const user = client.users.cache.get('308363066418921473');
}

module.exports.loop = { enabled: false };
