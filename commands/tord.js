const Discord = require('discord.js')
const { Command } = require('discord-akairo');

const { Scholar } = require('../structures/Database')
const moment = require('moment')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('../../database.json')
const db = low(adapter)

if (!db.get('tord_players').value()) {
    db.defaults({ tord_players: [] }).write()
}

class TruthOrDareCommand extends Command {
    constructor() {
        super('tord', {
            aliases: ['tord', 'td'],
            args: [
                {
                    id: 'action',
                    type: 'string'
                }
            ]
        });
    }

    async exec(message, args) {
        if (['join', 'next', 'leave', 'clear', 'players', 'ls', 'n'].includes(args.action)) {
            if (args.action === 'join') {
                console.log(db.get('tord_players').value())
                if (db.get('tord_players').value().includes(message.author.id)) return message.reply("You are already in the game. :clown:")
                db.get('tord_players')
                    .push(message.author.id)
                    .write()
                await message.reply("You have been added to the current game. :white_check_mark:")
            } else if (args.action === 'players' || args.action === 'ls') {
                const players = db.get('tord_players').value()

                const embed = new Discord.MessageEmbed()
                    .setTitle("LeDaddy TorD")
                    .addField("Current Players", (players.length > 0 ? `- ${players.map(player => `<@${player}>`).join('\n- ')}` : 'none'))

                await message.reply({ embed })
            } else if (args.action === 'leave') {
                let players = db.get('tord_players').value()
                players = players.filter(player => player !== message.author.id)
                db.set('tord_players', players).write()
                await message.reply("You have been removed from the current game. :white_check_mark:")
            } else if (args.action === 'clear') {
                if (message.member.roles.cache.has(process.env.ADMIN_ROLE_ID)) {
                    db.set('tord_players', []).write()
                    await message.reply("Cleared the TorD player list. :white_check_mark:")
                }
            } else if (args.action === 'next' || args.action === 'n') {
                let players = db.get('tord_players').value()
                if (players.length > 0) {
                    await message.reply(`The next player is: <@${players[Math.floor(Math.random()*players.length)]}>`)
                } else {
                    await message.reply("Looks like you're playing with ghosts. :ghost: ")
                }
            }
        }
    }
}

module.exports = TruthOrDareCommand;