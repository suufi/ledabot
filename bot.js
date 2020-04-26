require('dotenv').config()
const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');

class Bot extends AkairoClient {
    constructor() {
        super({
            ownerID: '88410718314971136' // or ['123992700587343872', '86890631690977280']
        }, {
            disableEveryone: true,

        })

        this.commandHandler = new CommandHandler(this, {
            directory: './commands/',
            prefix: 'leda.',
            allowMention: true
        })

        this.listenerHandler = new ListenerHandler(this, {
            directory: './listeners/'
        });

        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll();
        this.commandHandler.loadAll();

    }

}

const client = new Bot();
client.login(process.env.TOKEN).then().catch(console.error);