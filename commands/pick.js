module.exports = {
	name: 'pick', //name of command
    description: 'Picks a random item from a proved list', //description of the command
    args: true, //require args?
    usage: '<item>...', //the args in order 
    guildOnly: false, //in server only?
    cooldown: 0, //in seconds. how fast you can spam a command
    aliases: ['ran', 'random'], //different names you can use to use a command
	execute(message, args) {
        const choice = Math.floor(Math.random() * args.length);
        return message.reply(args[choice]);
	},
};