// Enviroment Variables
require('dotenv').config()
const YTAPI = process.env.YTAPI
// ytdl import
const ytdl = require('ytdl-core');
// channel tracking
var connections = {};

class handler {
    static async play(args, message){
        if (message.member.voice.channel) {
            message.member.voice.channel.join()
            .then(connection => {
                connections[message.channel.guild.id] = connection;
                connection.play(ytdl(args[0].trim(), { filter: 'audioonly' }));
            })
            return
        } else {
            message.reply('You need to join a voice channel first!');
            return
        }
    }

    static async leave(message){
        if(connections[message.channel.guild.id] == undefined) {
            return message.reply('I am already disconnected!');
        }
        if(connections[message.channel.guild.id].status === 4){
            return message.reply('I am already disconnected!');
        }
        connections[message.channel.guild.id].disconnect();
        delete connections[message.channel.guild.id];
        return
    }
}

module.exports = handler