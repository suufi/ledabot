const Discord = require('discord.js')
const { Command } = require('discord-akairo');

const { Scholar } = require('../structures/Database')
const moment = require('moment')

class SearchCommand extends Command {
    constructor() {
        super('search', {
            aliases: ['search', 'query', 'q'],
            args: [
                {
                    id: 'field',
                    type: 'string'
                },
                {
                    id: 'value',
                    type: 'string',
                    match: 'rest'
                }
            ]
        });
    }

    async exec(message, args) {
        let value
        if (args['field'] === 'state') {
            value = args.value.toUpperCase()
        } else if (args['field'] === 'cohort') {
            value = Number(args.value)
        }

        let queryResults = await Scholar.find({ [args['field']]: value })
        let status = await message.reply("Fetching scholars :hourglass: ")

        if (queryResults.length > 1) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`- ${queryResults.map((scholar) => (scholar.name || `<@${scholar.userId}>`)).join('\n- ')}`)
            return status.edit({ content: 'Here are scholars I found matching your query: ', embed })
        } else if (queryResults.length === 1) {
            const profile = queryResults[0]
            const member = await message.guild.member(profile.userId)
            const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(profile.Name || "Scholar Profile")
                .setThumbnail(profile.avatar || member.user.avatarURL('png'))
                .setFooter(`Queried by ${message.author.tag}`, message.author.avatarURL());

            if (profile.name) embed.addField('Name', profile.name, true)
            if (profile.nickname) embed.addField('Nickname', profile.nickname, true)
            if (profile.birthday) embed.addField('Birthday', moment(profile['birthday']).format('LL'), true)
            if (profile.state) embed.addField('Location', `${profile.city ? (profile.city + ', ') : ''}${profile.state}`, true)
            if (profile.school) embed.addField('School', `${profile.school}`, true)
            // if (profile.instagram || profile.snapchat || profile.tiktok || profile.phone) embed.addField('\u200B', '\u200B')
            if (profile.instagram) embed.addField('Instagram', `@${profile.instagram}`, true)
            if (profile.snapchat) embed.addField('Snapchat', `@${profile.snapchat}`, true)
            if (profile.tiktok) embed.addField('TikTok', `@${profile.tiktok}`, true)
            if (profile.phone) embed.addField('Phone Number', profile.phone, true)

            await status.edit({ embed, content: '' })
        } else {
            await status.edit("I didn't find any scholars matching your query.")
        }
    }
}

module.exports = SearchCommand;