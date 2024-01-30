module.exports = {
    name: 'help',
    description: 'Lists all commands',
    async execute(Discord, client, func, message, args){
        
        let temp = "Commands:\n";
        
        client.commands.forEach( (value, key) => {
            temp += `**!${key}** - *${value.description}*\n`;
        });
        
        message.channel.send(temp);
    }
}