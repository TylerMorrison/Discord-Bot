module.exports = {
	name: 'balance',
    description: 'Get the player balance',
    args: false,
    guildOnly: true,
    cooldown: 3, //in seconds
    aliases: ['bal', 'wins', 'win', 'w'],
	execute(message, args) {
        const fs = require('fs') //importing file save
        
        var gamPath = './user_data/gambling.json';
        var gamRead = fs.readFileSync(gamPath);
        var gamFile = JSON.parse(gamRead); //ready for use
        var userId = message.author.id; //user id here

        if (!gamFile[userId]) { //this checks if data for the user has already been created
            return message.reply(`You haven't gambled yet`);
        } else {
            return message.reply('you have a balance of $' + gamFile[userId].money + ' & have ' + gamFile[userId].wins + ' wins'); 
        }
	},
};