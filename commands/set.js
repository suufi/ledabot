const Discord = require('discord.js')
const { Command } = require('discord-akairo');

const { setField } = require('../structures/Database')
const moment = require('moment')

const stateAbbreviations = [
    'AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC','FM','FL','GA',
    'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA',
    'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
    'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT',
    'VT','VI','VA','WA','WV','WI','WY'
];

class SetInfoCommand extends Command {
    constructor() {
        super('set', {
            aliases: ['set'],
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
        const field = args.field && args.field.toLowerCase()
        let value = args.value ? args.value.replace('@', '') : null
        let validFields = ['name', 'avatar', 'nickname', 'birthday', 'city', 'state', 'school', 'instagram', 'snapchat', 'twitter', 'tiktok', 'phone', 'cohort']
        if (validFields.includes(field)) {
            let res
            if (field === 'birthday') {
                const FORMAT = 'MM/DD/YYYY'
                console.log(moment(args.value, FORMAT))
                if (!moment(args.value, FORMAT).isValid()) {
                    return message.reply(`:x: Please put a valid birthday formatted like MM/DD/YYYY.`)
                }
                value = moment(args.value, FORMAT)
                res = await setField(message.author.id, field, value).catch((err) => { return message.reply(`:x: ${err}`) })
                if (res) {
                    return message.reply(`:white_check_mark: Set your birthday to ${value.format('LL') || 'none'}`)
                }
            } else if (field === 'phone') {
                if (!(/^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/.test(args.value))) {
                    return message.reply(`:x: Please put a valid phone number.`)
                }
                value = Number(args.value.replace(/ /g, ""))
            } else if (field === 'state') {
                if (!stateAbbreviations.includes(args.value.toUpperCase())) {
                    return message.reply(`:x: Please use your state abbreviation.`)
                }
                value = args.value.toUpperCase()
            }

            res = await setField(message.author.id, field, value).catch((err) => { return message.reply(`:x: ${err}`) })

            if (res) {
                return message.reply(`:white_check_mark: Set your ${field} to ${args.value || 'none'}`)
            }
        } else {
            const embed = new Discord.MessageEmbed()
                .setDescription(`Here are some valid choices for what you can set: \n- ${validFields.join('\n- ')}`)
                .addField("Usage", "**leda.set** [field] (value)")
            return message.reply({ embed })
        }
        // return message.reply('Pong!');
    }
}

module.exports = SetInfoCommand;