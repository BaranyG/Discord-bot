const fs = require('fs');

module.exports = (Discord, client, func) => {
    const command_files = fs.readdirSync('./Commands/').filter(file => file.endsWith('.js'));

    for(const file of command_files){                        //commands mappa beolvasása.
        const command = require(`../Commands/${file}`);      //commands mappában fájlok beolvasása.
        if(command.name)
        client.commands.set(command.name, command);
        else continue;
    }
}