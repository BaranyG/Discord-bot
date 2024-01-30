const { subscriptions } = require("./play");

module.exports = {
    name: 'skip',
    description: 'Skips Music',
    async execute(Discord, client, func, message, args){

        const subscription = subscriptions.get(message.guild.id);

        if(subscription === undefined) return message.channel.send("Nincs is mit skippelni teeeee, rááákos ");

        await subscription.player.stop();
        
        await message.channel.send("<@"+message.member.id+">" + " nem szereti ezt a zenét ");
    }
}