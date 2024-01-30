const { subscriptions } = require("./play");
const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: 'pause',
    description: 'Pauses Music',
    async execute(Discord, client, func, message, args){

        const subscription = subscriptions.get(message.guild.id);

        if(subscription === undefined) return message.channel.send("Nincs is mit megállítani teeeee, rááákos ");

        if(subscription.player.state.status !== AudioPlayerStatus.Paused){
            message.channel.send("Megállítottam neked tetty");
            subscription.player.pause();
        } else {
            message.channel.send("Már megállítottam neked tetty");
        }
    }
}