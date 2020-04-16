// Enviroment Variables
require('dotenv').config()
const TOKEN = process.env.TOKEN
const PREFIX = process.env.PREFIX || '_'
const DJROLE = process.env.DJROLE || 'DJ'
const ADMINROLE = process.env.ADMINROLE || 'Admin'
const DJROLEENABLED = process.env.DJROLEENABLED || true
// discord.js import
const Discord = require('discord.js');
const client = new Discord.Client();
// import Exported functions
const muse_ic = require('./muse_exports.js')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    const command = message.content.toLowerCase().split(' ')[0]
    const args = message.content.split(' ')
    args.shift()
    const guildowner = message.channel.guild.ownerID
    const messageauthor = message.author.id
    const isGuildOwner = guildowner == messageauthor
    const isDJ = message.member.roles.cache.find(role => role.name === DJROLE)
    const isAdmin = message.member.roles.cache.find(role => role.name === ADMINROLE) || isGuildOwner

    switch (command) {
        case `${PREFIX}ping`:
            message.channel.send('Pong!')
            return

        case `${PREFIX}ping`:
            message.channel.send('Pong!')
            return

        case `${PREFIX}play`:
            if(DJROLEENABLED){
                if(isDJ || isAdmin){
                    muse_ic.play(args, message)
                }else{
                    message.reply('You do not have the `' + DJROLE + '` role')
                }
            }else{
                muse_ic.play(args, message)
            }
            return
        
        case `${PREFIX}leave`:
            if(DJROLEENABLED){
                if(isDJ || isAdmin){
                    muse_ic.leave(message);
                }else{
                    message.reply('You do not have the `' + DJROLE + '` role')
                }
            }else{
                muse_ic.leave(message);
            }
            return
    }
});

client.login(TOKEN);