const Discord = require('discord.js')
const { Command } = require('discord-akairo');

const { Scholar } = require('../structures/Database')
const moment = require('moment')

class BirthdayListCommand extends Command {
    constructor() {
        super('birthdays', {
            aliases: ['birthdays', 'bds']
        });
    }

    async exec(message, args) {

        let scholars = await Scholar.find({ })
        let status = await message.reply("Fetching scholars :hourglass: ")

        const embed = new Discord.MessageEmbed()
          .setTitle(":birthday: Birthdays")
          .setThumbnail('https://i.imgur.com/9EU2fFu.jpg')

        const embed2 = new Discord.MessageEmbed()
          .setTitle(":birthday: Birthdays (cont.)")
          .setThumbnail('https://i.imgur.com/9EU2fFu.jpg')

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const birthdays = [
            [], [], [], [],
            [], [], [], [],
            [], [], [], []
        ]

        for (let scholar of scholars) {
            if (scholar.birthday) {
                let userResolvable = message.guild.member(scholar.userId).nickname || message.guild.member(scholar.userId).user.username
                userResolvable = userResolvable && userResolvable.split(" | ")[0]
                userResolvable = userResolvable && userResolvable.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '') // remove emojis

                let scholarDisplayName = scholar.name || scholar.nickname || userResolvable || `<@${scholar.userId}>`
                birthdays[scholar.birthday.getMonth()].push(`**${scholarDisplayName}** (${moment(scholar.birthday).format('MMMM DD')})`)
            }
        }

        for (let monthIndex in months.slice(0, 6)) {
            if (birthdays[monthIndex].length > 0) {
                let birthdayMonth = birthdays[monthIndex]
                birthdayMonth = birthdayMonth.sort((a, b) => {
                    const dayA = a.replace(/<@.+\d+>/g,"").match(/\d+/g).map(Number)[0]
                    const dayB = b.replace(/<@.+\d+>/g,"").match(/\d+/g).map(Number)[0]
                    return dayA > dayB ? 1 : -1
                })
                embed.addField(months[monthIndex], `- ${birthdayMonth.join('\n- ')}`, true)
                if (monthIndex % 2 === 0) {
                    embed.addField('\u200b', '\u200b', true)
                }
            }
        }

        for (let monthIndexA in months.slice(6, 12)) {
            const monthIndex = Number(monthIndexA) + 6
            if (birthdays[monthIndex].length > 0) {
                let birthdayMonth = birthdays[monthIndex]
                birthdayMonth = birthdayMonth.sort((a, b) => {
                    const dayA = a.replace(/<@.+\d+>/g,"").match(/\d+/g).map(Number)[0]
                    const dayB = b.replace(/<@.+\d+>/g,"").match(/\d+/g).map(Number)[0]
                    console.log(dayA, dayB)
                    return dayA > dayB ? 1 : -1
                })
                embed2.addField(months[monthIndex], `- ${birthdayMonth.join('\n- ')}`, true)
                if (monthIndex % 2 === 0) {
                    embed2.addField('\u200b', '\u200b', true)
                }
            }
        }

        await status.edit({ embed, content: "" })
        await status.channel.send({ embed: embed2, content: "" })
        // if (queryResults.length > 1) {
        //     const embed = new Discord.MessageEmbed()
        //         // .addField("January")
        //         // .setDescription(`- ${queryResults.map((scholar) => scholar.name || scholar.userId).join('\n- ')}`)
        //     return status.edit({ content: 'Here are scholars I found matching your query: ', embed })
        // } else if (queryResults.length === 1) {
        //     const profile = queryResults[0]
        //     const member = await message.guild.member(profile.userId)
        //     const embed = new Discord.MessageEmbed()
        //         .setColor('RANDOM')
        //         .setTitle(profile.Name || "Scholar Profile")
        //         .setThumbnail(profile.avatar || member.user.avatarURL('png'))
        //         .setFooter(`Queried by ${message.author.tag}`, message.author.avatarURL());
        //
        //     if (profile.name) embed.addField('Name', profile.name, true)
        //     if (profile.nickname) embed.addField('Nickname', profile.nickname, true)
        //     if (profile.birthday) embed.addField('Birthday', moment(profile['birthday']).format('LL'), true)
        //     if (profile.state) embed.addField('Location', `${profile.city ? (profile.city + ', ') : ''}${profile.state}`, true)
        //     if (profile.school) embed.addField('School', `${profile.school}`, true)
        //     // if (profile.instagram || profile.snapchat || profile.tiktok || profile.phone) embed.addField('\u200B', '\u200B')
        //     if (profile.instagram) embed.addField('Instagram', `@${profile.instagram}`, true)
        //     if (profile.snapchat) embed.addField('Snapchat', `@${profile.snapchat}`, true)
        //     if (profile.tiktok) embed.addField('TikTok', `@${profile.tiktok}`, true)
        //     if (profile.phone) embed.addField('Phone Number', profile.phone, true)
        //
        //     await status.edit({ embed, content: '' })
        // } else {
        //     await status.edit("I didn't find any scholars matching your query.")
        // }
    }
}

module.exports = BirthdayListCommand;