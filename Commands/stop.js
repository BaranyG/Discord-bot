const { subscriptions } = require("./play");

module.exports = {
    name: 'stop',
    description: 'Stops Music and deletes the playlist',
    async execute(Discord, client, func, message, args){

        const subscription = subscriptions.get(message.guild.id);

        if(subscription === undefined) return message.channel.send("Nincs is playlist teeeee, rááákos ");

        subscription.songs = [];
        await subscription.player.stop();
        await message.channel.send("Töröltem a playlistet neked ");
    }
}