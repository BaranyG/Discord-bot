const { subscriptions } = require("./play");
const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: 'resume',
    description: 'Unpauses Music',
    async execute(Discord, client, func, message, args){

        const subscription = subscriptions.get(message.guild.id);

        if(subscription === undefined) return message.channel.send("Nincs is mit folytatni teeeee, rááákos ");

        if(subscription.player.state.status === AudioPlayerStatus.Paused){
            message.channel.send("Már megy is");
            subscription.player.unpause();
        } else {
            message.channel.send("Konkrétan nincs pause-olva semmi tetty");
        }
    }
}