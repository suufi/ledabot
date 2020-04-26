const Discord = require('discord.js')
const { Command } = require('discord-akairo');

const { Scholar, setField } = require('../structures/Database')
const moment = require('moment')

class OverrideCommand extends Command {
    constructor() {
        super('override', {
            aliases: ['override', 'or'],
            ownerOnly: true,
            args: [
                {
                    id: 'user',
                    type: 'member'
                },
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
        let field = args.field
        let value = args.value
        let res
        if (field === 'birthday') {
            const FORMAT = 'MM/DD/YYYY'
            value = moment(args.value, FORMAT)
            res = await setField(args.user.id, field, value).catch((err) => { return message.reply(`:x: ${err}`) })
            if (res) {
                return message.reply(`:white_check_mark: Set user's birthday to ${value.format('LL') || 'none'}`)
            }
        } else if (field === 'phone') {
            value = Number(args.value.replace(/ /g, ""))
        } else if (field === 'state') {
            value = args.value.toUpperCase()
        }
        res = await setField(args.user.id, field, value).catch((err) => { return message.reply(`:x: ${err}`) })

        if (res) {
            return message.reply(`:white_check_mark: Set ${args.user.user.tag}'s ${field} to ${value || 'none'}`)
        }
    }
}

module.exports = OverrideCommand;