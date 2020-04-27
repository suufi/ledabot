const { Listener } = require('discord-akairo')

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  exec () {
    this.client.user.setPresence({ activity: { name: 'with your acceptances' }, status: 'idle' }).then(() => {
      console.log('Set presence')
    })
    console.log('I\'m ready!')
  }
}

module.exports = ReadyListener
