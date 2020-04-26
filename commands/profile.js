const Discord = require('discord.js')
const { Command } = require('discord-akairo');

const { getScholarByUserId } = require('../structures/Database')
const moment = require('moment')

class ProfileCommand extends Command {
    constructor() {
        super('profile', {
            aliases: ['profile', 'whois', 'p'],
            args: [
                {
                    id: 'user',
                    type: 'member'
                }
            ]
        });
    }

    async exec(message, args) {
        let member
        if (args.user) {
            member = args.user
        } else {
            member = message.member
        }
        let status = await message.reply("Fetching profile :hourglass: ")
        const profile = await getScholarByUserId(member.id)
        if (profile) {
            const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(profile.Name || "Scholar Profile")
                .setThumbnail(profile.avatar || member.user.avatarURL('png'))
                .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL());

            if (profile.name) embed.addField('Name', profile.name, true)
            if (profile.nickname) embed.addField('Nickname', profile.nickname, true)
            if (profile.birthday) embed.addField('Birthday', moment(profile.birthday).format('LL'), true)
            if (profile.state) embed.addField('Location', `${profile.city ? (profile.city + ', ') : ''}${profile.state}`, true)
            if (profile.school) embed.addField('School', `${profile.school}`, true)
            // if (profile.instagram || profile.snapchat || profile.tiktok || profile.phone) embed.addField('\u200B', '\u200B')
            if (profile.instagram) embed.addField('Instagram', `@${profile.instagram}`, true)
            if (profile.snapchat) embed.addField('Snapchat', `@${profile.snapchat}`, true)
            if (profile.tiktok) embed.addField('TikTok', `@${profile.tiktok}`, true)
            if (profile.phone) embed.addField('Phone Number', profile.phone, true)

            await status.edit({ embed, content: '' })
            // return message.reply("")
        } else {
            await status.edit("Looks like this user doesn't have a scholar profile.")
        }
        // return message.reply('Pong!');
    }
}

module.exports = ProfileCommand;