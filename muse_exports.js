// Enviroment Variables
require('dotenv').config()
const YTAPI = process.env.YTAPI
// ytdl import
const ytdl = require('ytdl-core');
// channel tracking
var channels = {};

class handler {
    static async play(args, message, isPrivileged){
        if (!message.member.voice.channel) {
            return message.reply('You need to join a voice channel first!');
        }
        if(message.channel.guild.id in channels){
            if(channels[message.channel.guild.id].voiceChannel.id != message.member.voice.channel.id){
                if(!isPrivileged){
                    return message.reply('The bot is currently playing in another channel and you do not have privileges to move the bot.');
                }
                channels[message.channel.guild.id].destroyStream()
            }
        }
        message.member.voice.channel.join()
        .then(connection => {
            channels[message.channel.guild.id] = new channel(message.member.voice.channel, message.channel.guild.id, connection);
            channels[message.channel.guild.id].startStream(args[0])
        })
        return
    }

    static async pause(message){
        if (!message.member.voice.channel) {
            return message.reply('You need to join in the voice channel me first!');
        }
        if(message.channel.guild.id in channels &&
        channels[message.channel.guild.id].voiceChannel.id != message.member.voice.channel.id){
            return message.reply('You need to join in the voice channel me first!');
        }
        if(!channels[message.channel.guild.id].playing){
            return message.reply('I\'ve already paused!');
        }
        channels[message.channel.guild.id].pause()
    }

    static async resume(message){
        if (!message.member.voice.channel) {
            return message.reply('You need to join in the voice channel me first!');
        }
        if(message.channel.guild.id in channels &&
        channels[message.channel.guild.id].voiceChannel.id != message.member.voice.channel.id){
            return message.reply('You need to join in the voice channel me first!');
        }
        if(channels[message.channel.guild.id].playing){
            return message.reply('I\'ve already resumed!');
        }
        channels[message.channel.guild.id].resume()
    }

    static async resume(message){
        if (!message.member.voice.channel) {
            return message.reply('You need to join in the voice channel me first!');
        }
        if(message.channel.guild.id in channels &&
        channels[message.channel.guild.id].voiceChannel.id != message.member.voice.channel.id){
            return message.reply('You need to join in the voice channel me first!');
        }
        if(channels[message.channel.guild.id].playing){
            return message.reply('I\'ve already resumed!');
        }
        channels[message.channel.guild.id].resume()
    }

    static async volume(args, message){
        var newVolume = -1;
        try {
            newVolume = parseInt(args[0]);
        } catch(err) {
            console.error("muse_exports.volume returned an error:", err)
            return message.reply('Please provide a number between 0 and 100!');
        }
        if(newVolume < 0 || newVolume > 100) {
            return message.reply('Please provide a number between 0 and 100!');
        }
        channels[message.channel.guild.id].updateVolume(newVolume)
        message.reply('Volume has been set to ' + newVolume + '%');
        return
    }

    static async leave(message){
        if(channels[message.channel.guild.id].connection == undefined) {
            return message.reply('I am already disconnected!');
        }
        if(channels[message.channel.guild.id].connection.status === 4){
            return message.reply('I am already disconnected!');
        }
        channels[message.channel.guild.id].disconnect();
        return
    }

    //static async seek(args, message){
    //    if(args.length < 1){
    //        return message.reply('Please provide a time to seek to in seconds.');
    //    }
    //    channels[message.channel.guild.id].seek(args[0]);
    //    console.log(args[0])
    //    return
    //}
}

class channel {
    constructor(voiceChannel, guildId, connection) {
        this.voiceChannel = voiceChannel;
        this.guildId = guildId;
        this.connection = connection;
        this.stream = null;
        this.streamUrl = null;
        this.playing = false;
    }

    startStream(url){
        this.streamUrl = url;
        this.stream = ytdl(this.streamUrl, { filter: 'audioonly' });
        this.connection.play(this.stream);
        this.playing = true;
    }

    //seek(time){
    //    this.stopStream()
    //    this.startStreamAt(time)
    //}
//
    //startStreamAt(begin){
    //    this.stream = ytdl(this.streamUrl, { bitrate: 96000, range: {start: begin*12000}, filter: 'audioonly' });
    //    this.connection.play(this.stream);
    //    this.playing = true;
    //}

    stopStream(){
        this.stream.destroy();
        this.stream = null;
        this.playing = false;
    }

    updateVoiceChannel(voiceChannel) {
        this.voiceChannel = voiceChannel;
    }

    updateVolume(newVolume){
        this.connection.dispatcher.setVolumeLogarithmic(newVolume/100);
    }

    pause(){
        this.connection.dispatcher.pause();
        this.playing = false;
    }

    resume(){
        this.connection.dispatcher.resume();
        this.playing = true;
    }

    disconnect(){
        this.connection.disconnect();
        this.stream.destroy();
        delete channels[this.guildId];
        return
    }

    destroyStream(){
        this.connection.dispatcher.pause();
        this.stream.destroy();
        return
    }
  }

module.exports = handler