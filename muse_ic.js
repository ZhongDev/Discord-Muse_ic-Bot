// Enviroment Variables
require('dotenv').config()
const TOKEN = process.env.TOKEN
const PREFIX = process.env.PREFIX || '_'
const DJROLE = process.env.DJROLE || 'DJ'
const ADMINROLE = process.env.ADMINROLE || 'Admin'
const DJROLEENABLED = process.env.DJROLEENABLED || false
// discord.js import
const Discord = require('discord.js');
const client = new Discord.Client();
// ytdl import
const ytdl = require('ytdl-core');

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
    const isDJ = message.member.roles.find(role => role.name === DJROLE)
    const isAdmin = message.member.roles.find(role => role.name === ADMINROLE) || isGuildOwner

    switch (command) {
        case `${PREFIX}ping`:
            message.channel.send('Pong!')
            return

        case `${PREFIX}play`:
            if(DJROLEENABLED){
                if(isDJ){
                    message.channel.send('Playing ...')
                }else{
                    message.reply('You do not have the `' + DJROLE + '` role')
                }
            }else{
                message.channel.send('Playing ...')
            }
            return
    }
});

client.login(TOKEN);