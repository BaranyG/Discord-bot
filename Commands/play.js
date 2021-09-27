
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const ytdlDiscord = require("ytdl-core-discord");
const ytSearch = require("yt-search");
const ids = require("../ID.js");
const player = createAudioPlayer();
const func = require('../functions.js');

const queue = new Map();
// queue(message.guild.id, queue_constructor object { voice channel, text channel, connection, song[]});

module.exports = {
    name: 'play',
    aliases: ['skip', 'stop'],
    description: 'music bot',
    async execute(Discord, client, func, message, args, cmd){
        
        const voice_channel = message.member.voice.channel;
        if(!voice_channel) return message.channel.send('Voice szobában kell lenned!');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if(!permissions.has("CONNECT")) return message.channel.send("Nincs megfelelő jogosultságod!");
        if(!permissions.has("SPEAK")) return message.channel.send("Nincs megfelelő jogosultságod!");

        const server_queue = queue.get(message.guild.id);

        if(cmd === "play"){
            if(!args.length) return message.channel.send("Add meg a zene címét vagy linkjét!");
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
                    message.channel.send("Ilyen nem is létezik.");
                }
            }
            if(!server_queue){
            
                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }
    
                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);
    
                try {
                    const connection = joinVoiceChannel({
                        channelId: voice_channel.id,
                        guildId: message.guild.id,
                        adapterCreator: voice_channel.guild.voiceAdapterCreator,
                    });
                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0]);
                }catch(err){
                    queue.delete(message.guild.id);
                    message.channel.send("Nem lehet felcsatlakozni!")
                    throw err;
                }
            }else{
                server_queue.songs.push(song);
                return message.channel.send(`Hozzáadva a várólistához: :musical_note: **${song.title}** :musical_note:`)
            }
        }
    }
}

const video_player = async (guild, song) => {

    const song_queue = queue.get(guild.id);

    const stream = ytdl(song.url, { highWaterMark: 1<<25, filter: "audioonly" });

    let resource = createAudioResource(stream, { inlineVolume: false, });
    
    song_queue.connection.subscribe(player);
    
    player.play(resource);

    player.on("error", error => {
        console.error(error);
    });
    player.on(AudioPlayerStatus.Idle, () => {
        song_queue.songs.shift();
        if(song_queue.songs.length)
            video_player(guild, song_queue.songs[0]);
        else if(song_queue.connection.state.status !== "destroyed"){
            song_queue.connection.destroy();
            queue.delete(guild.id);
            return;
        }
    });

    await song_queue.text_channel.send(`Most :cherries::  :musical_note: **${song.title}** :musical_note:`);
}
