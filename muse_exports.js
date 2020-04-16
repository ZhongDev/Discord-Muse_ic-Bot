// Enviroment Variables
require('dotenv').config()
const YTAPI = process.env.YTAPI
// ytdl import
const ytdl = require('ytdl-core');

class handler {
    static play(args, message){
        if (message.member.voice.channel) {
            message.member.voice.channel.join()
            .then(connection => {
                connection.play(ytdl(args[0].trim(), { filter: 'audioonly' }));
            })
            return
        } else {
            message.reply('You need to join a voice channel first!');
            return
        }
    }
}

module.exports = handler