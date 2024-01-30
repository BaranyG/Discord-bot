
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    entersState,
    getVoiceConnection,
    AudioPlayerStatus ,
    VoiceConnectionStatus,
    NoSubscriberBehavior,
} = require('@discordjs/voice');

const ytdl = require("ytdl-core");
const ytdlDiscord = require("ytdl-core-discord");
const ytSearch = require("yt-search");
const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});
const func = require('../functions.js');
const ID = require('../ID.js');

const subscriptions = new Map();
// subscriptions(message.guild.id, queue_constructor object { text channel, connection, player, song[]});

module.exports = {
    name: 'play',
    aliases: ['skip', 'stop', 'pause', 'resume'],
    description: 'music bot',
    async execute(Discord, client, func, message, args, cmd){
        
        const voice_channel = message.member.voice.channel;
        if(!voice_channel) return message.channel.send('Voice szobában kell lenned te$$!');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if(!permissions.has("CONNECT")) return message.channel.send("Nincs jogosultságod tess!");
        if(!permissions.has("SPEAK")) return message.channel.send("Nincs jogosultságod teskám!");

        let subscription = subscriptions.get(message.guild.id);

        if(cmd === "play"){
            if(!args.length) return message.channel.send("Adzsmá címet vagy linket tetty!");
            let song = {};
            // Link alapján megtalálja a videót youtube-on.
            if(ytdl.validateURL(args[0])){
                const song_info = await ytdl.getInfo(args[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url };
                
            } else {
                //Ha nem linket írt be akkor használja a kulcsszavakat hogy megtalálja a videót
                const video_finder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }

                const video = await video_finder(args.join(" "));
                if(video){
                    song = { title: video.title, url: video.url }
                } else {
                    message.channel.send("Hallod tetty, konkrétan nincs ilyen.");
                }
            }
            if(!subscription){
            
                const queue_constructor = {
                    text_channel: message.channel,
                    connection: null,
                    player: player,
                    songs: []
                }
                
                const connection = joinVoiceChannel({
                    channelId: voice_channel.id,
                    guildId: voice_channel.guild.id,
                    adapterCreator: voice_channel.guild.voiceAdapterCreator,
                });
                connection.on('error', console.warn);

                queue_constructor.connection = connection;
                queue_constructor.songs.push(song);
                subscriptions.set(message.guild.id, queue_constructor);
                
                try{
                    await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
                }catch(err){
                    subscription.delete(message.guild.id);
                    message.channel.send("Hallod tetty, nem tudok felcsatlakozni" + func.emoji(ID.emojik.feelsbadman))
                    throw err;
                }
                
                await video_player(message.guild, queue_constructor.songs[0]);

            }else{
                subscription.songs.push(song);
                return message.channel.send(`Hozzáadva a várólistához: :musical_note: **${song.title}** :musical_note:`)
            }
        }

        if(!subscription.player) return;

        else if(cmd === "skip") {
            subscription.songs.shift();
            message.channel.send("<@"+message.member.id+">" + " nem szereti ezt a zenét " + func.emoji(ID.emojik.feelsbadman));
            if(!subscription.songs.length) 
                return message.channel.send("Nem maradt zene a várólistán " + func.emoji(ID.emojik.feelsbadman));
            else{
                await video_player(message.guild, subscription.songs[0]);
            }
        }
        else if(cmd === "stop") {
            message.channel.send("Töröltem a listát neked");
            subscription.songs = [];
            subscription.player.stop();
        }
        else if(cmd === "pause") {
            if(subscription.player.state.status !== AudioPlayerStatus.Paused){
            message.channel.send("Megállítottam neked tetty");
            subscription.player.pause();
            } else {
                message.channel.send("Már megállítottam neked tetty");
            }
        }
        else if(cmd === "resume") {
            if(subscription.player.state.status === AudioPlayerStatus.Paused){
                message.channel.send("Már megy is");
                subscription.player.unpause();
            }else{
                message.channel.send("Konkrétan nincs pause-olva semmi tetty");
            }
        }
        else if(cmd === "leave") {
            if(subscription.connection.state.status !== "destroyed"){
                message.channel.send("Senkinek se kellek " + func.emoji(ID.emojik.feelsbadman));
                subscription.songs = [];
                subscription.connection.destroy();
                subscriptions.delete(guild.id);
                return;
            }
        }
    }
}

const video_player = async (guild, song) => {

    const subscription = subscriptions.get(guild.id);

    if(subscription === undefined){
        console.log("error: subscription is undefined");
        return;
    }

    const stream = ytdl(song.url, { highWaterMark: 1<<25, filter: "audioonly" });

    let resource = createAudioResource(stream, { inlineVolume: false, });
    
    subscription.connection.subscribe(subscription.player);
    
    subscription.player.play(resource);

    player.on('stateChange', (oldState, newState) => {
        console.log(oldState.status, newState.status, performance.now());
        if (newState.status === AudioPlayerStatus.Idle && oldState !== AudioPlayerStatus.Idle) {
            subscription.songs.shift();
            if(subscription.songs.length)
                video_player(guild, subscription.songs[0]);
                
            else if(subscription.connection.state.status !== "destroyed"){
                subscription.connection.destroy();
                subscriptions.delete(guild.id);
                return;
            }
        }
    });

    await subscription.text_channel.send(`Most :cherries::  :musical_note: **${song.title}** :musical_note:`);
    
}



player.on("error", error => {
    console.error(error);
});


