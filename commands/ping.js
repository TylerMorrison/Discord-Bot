module.exports = {
	name: 'ping', //name of command
    description: 'Ping!', //description of the command
    args: false, //require args?
    usage: '<user> <role>', //the args in order 
    guildOnly: false, //in server only?
    cooldown: 0, //in seconds. how fast you can spam a command
    aliases: ['pong', 'p1ng'], //different names you can use to use a command
    permissions: '', //what roles can use it?
	execute(message, args) {
		message.channel.send('Pong.');
	},
};