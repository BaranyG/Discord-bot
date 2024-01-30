const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField} = require('discord.js');
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    entersState,
    VoiceConnectionStatus,
    NoSubscriberBehavior,
} = require('@discordjs/voice');
let { loop } = require('../Events/client/ready');

//const ytdl = require("play-dl");  //Livestreamekhez ez ajánlott
const ytdl = require("ytdl-core");
//const ytdlDiscord = require("ytdl-core-discord");     //Ez csak egy alternatíva volt
const ytSearch = require("yt-search");

const subscriptions = new Map();
// A subscriptions Map felépítése:
// subscriptions(message.guild.id, queue_constructor object { text channel, connection, player, songs[]});

module.exports = {
    name: 'play',
    description: 'Zsá zsá zsá',
    subscriptions: subscriptions,
    async execute(Discord, client, func, message, args){

        // Jogosultságok ellenőrzése, jogosultság beállítások végett.
        const voice_channel = message.member.voice.channel;
        if(!voice_channel) return message.channel.send("Voice szobábal kell lenned te$$!");
        const permissions = voice_channel.permissionsFor(message.client.user);
        if(!permissions.has(PermissionsBitField.Flags.Connect)) return message.channel.send("Nincs Connect jogosultságom tess!");
        if(!permissions.has(PermissionsBitField.Flags.Speak)) return message.channel.send("Nincs Speak jogosultságom teskám!");

        // Betölti a guildet az élő subscriptionök listájából, ha nincs, akkor lentebb létrehoz.
        let subscription = subscriptions.get(message.guild.id);

        if(!args.length) return message.channel.send("Adzsmá címet vagy linket tetty!");
        let song = {};
        // Link alapján megtalálja a videót youtube-on.
        if(ytdl.validateURL(args[0])){
            const song_info = await ytdl.getInfo(args[0]);
            song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url };
            
        } else {
            // Ha nem linket írt be akkor használja a kulcsszavakat hogy megtalálja a videót
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
        // Ha az adott guilden nem él connection, létrehoz egyet.
        if(!subscription){

            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });
        
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
                console.log("Entered Ready State");
            }catch(err){
                subscription.delete(message.guild.id);
                message.channel.send("Hallod tetty, nem tudok felcsatlakozni" )
                throw err;
            }
            await this.video_player(message.guild);
            return;
        }
        // Ha már van connection/subscription, azaz játszik le zenét,
        // Akkor csak hozzáadja a Map-hez, azaz queue-hoz,
        // Amit majd a video_player() már önmagától lekezel.
        else{
            subscription.songs.push(song);
            return message.channel.send(`Hozzáadva a várólistához: :musical_note: **${song.title}** :musical_note:`)
        }
    },

    video_player: async function(guild) {
        const subscription = subscriptions.get(guild.id);
        
        if(subscription === undefined)
            return message.channel.send("Nem maradt zene a várólistán "); 

        const play = async () => {
            let stream = ytdl(subscription.songs[0].url, { bitrate: 192000, highWaterMark: 1<<25, filter: "audioonly" });
            let resource = createAudioResource(stream, { inlineVolume: false, });
            
            await subscription.connection.subscribe(subscription.player);
            await subscription.text_channel.send(`Most :cherries::  :musical_note: **${subscription.songs[0].title}** :musical_note:`);
            await subscription.player.play(resource);
        }
        await play();
        
        // Ha véget ért a lejátszás, folytatja a queuet.
        // Ha nem szerepel több zene a listában kilép.
        subscription.player.on('stateChange', (oldState, newState) => {
            if (newState.status === "idle" && oldState.status !== "idle") {
                
                if( loop.enabled ) { 
                
                } 
                else {
                    subscription.songs.shift() ;
                }
                
                if(subscription.songs.length){
                    play();
                } 
                else if(subscription.connection.state.status !== "destroyed"){
                    subscription.connection.destroy();
                    subscriptions.delete(guild.id);
                    return;
                }
                
            }
        });
    },
}
































/*
        await check().then( () => {
            subscription.songs.shift();
            if(subscription.songs.length){
                console.log("next");
                this.video_player(guild, subscription.songs[0]);
            }
            else if(subscription.connection.state.status !== "destroyed"){
                subscription.connection.destroy();
                subscriptions.delete(guild.id);
                return;
            }
        });

        // Másodpercenként ellenőrzi, hogy vége van-e a zenének.
        const check = async function check(){
            while(true) {
                if(resource.ended) { 
                    return true; 
                }
                await delay(1000);
                
            }
        }

        */