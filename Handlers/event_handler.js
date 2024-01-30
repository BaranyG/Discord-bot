const fs = require('fs');

module.exports = (Discord, client, func) =>{
    const load_dir = (dirs) => {
        const event_files = fs.readdirSync(`./Events/${dirs}`).filter(file => file.endsWith('.js'));

        for(const file of event_files){
            const event = require(`../Events/${dirs}/${file}`);
            const event_name = file.split('.')[0];
            client.on(event_name, event.bind(null, Discord, client, func));
        }
    }

    ['client', 'guild'].forEach(e => load_dir(e));
}
