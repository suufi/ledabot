const { Command } = require('discord-akairo');
const Database = require('../structures/Database')
const util = require('util')

function clean (text) {
    if (typeof text === 'string')
        return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);

    return text;
}

class EvalCommand extends Command {
    constructor () {
        super('eval', {
            aliases: [ 'eval', 'ev', 'e' ],
            description: { content: 'Evaluates text from argument.' },
            ownerOnly: true,
            args: [
                {
                    id: 'code',
                    match: 'text'
                },
            ]
        });
    }

    async exec (message, args) {
        try {
            let evaled = eval(args.code); // tslint:disable-line:no-eval

            if (evaled instanceof Promise) evaled = await evaled;
            if (typeof evaled !== 'string') evaled = util.inspect(evaled);
            if (evaled.length >= 2000) evaled = `${evaled.slice(0, 1900)}...`;

            return message.channel.send(`**OUTPUT**\`\`\`xl\n${clean(evaled).includes('.token')
                ? process.env.TOKEN
                : clean(evaled)}\n\`\`\``);
        } catch (err) {
            return message.channel.send(`**ERROR**\`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
}

module.exports = EvalCommand