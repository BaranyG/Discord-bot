module.exports = {
    name: 'ping',
    description: "shows the bot's ping",
    async execute(Discord, client, func, message, args){
        message.channel.send('`ping is being calculated...`').then(msg => {
            const ping = msg.createdTimestamp - message.createdTimestamp;
            msg.channel.send(`bot\'s ping: ${ping} ms`);
        });
    }
}