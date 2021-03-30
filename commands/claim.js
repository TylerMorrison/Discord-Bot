module.exports = {
	name: 'claim', //name of command
    description: 'Gives the user a free $10 every 2 hours', //description of the command
    args: false, //require args?
    usage: '', //the args in order 
    guildOnly: false, //in server only?
    cooldown: 7200, //in seconds. how fast you can spam a command
    aliases: ['c'], //different names you can use to use a command
	execute(message, args) {
        const fs = require('fs') //importing file save
        
        var gamPath = './user_data/gambling.json';
        var gamRead = fs.readFileSync(gamPath);
        var gamFile = JSON.parse(gamRead); //ready for use
        var userId = message.author.id; //user id here

        if (!gamFile[userId]) { //this checks if data for the user has already been created
            return message.reply(`You haven't gambled yet`);
        } else {
            let playerMoney = Number(gamFile[userId].money) + 50;
            let playerWins = Number(gamFile[userId].wins);
            gamFile[userId] = {money: playerMoney, wins: playerWins};
            fs.writeFileSync(gamPath, JSON.stringify(gamFile, null, 2));
            return message.reply('you have a balance of $' + gamFile[userId].money); 
        }
	},
};