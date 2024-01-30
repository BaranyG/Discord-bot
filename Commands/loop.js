let  { loop }  = require('../Events/client/ready');

module.exports = {
    name: 'loop',
    description: "Enable loop for current music",
    async execute(Discord, client, func, message, args){
        loop.enabled = !loop.enabled;
        loop.enabled ? message.channel.send('Ismétlés bekapcsolva') : message.channel.send('Ismétlés kikapcsolva');
    }
}