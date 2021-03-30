module.exports = {
	name: 'gamble',
    description: 'Gambling is fun :)',
    args: true,
    usage: '<amount> <multiplier>',
    guildOnly: true,
    cooldown: 3, //in seconds
    aliases: ['bet'],
	execute(message, args) {
        const fs = require('fs') //importing file save
        
        var gamPath = './user_data/gambling.json';
        var gamRead = fs.readFileSync(gamPath);
        var gamFile = JSON.parse(gamRead); //ready for use
        var userId = message.author.id; //user id here


        if (!gamFile[userId]) { //this checks if data for the user has already been created
            gamFile[userId] = {money: 1000, wins: 0}; //if not, create it
            fs.writeFileSync(gamPath, JSON.stringify(gamFile, null, 2));
        } else {
            if(gamFile[userId].money < args[0])
                return message.reply(`you don't have enough money L`);
            
            if(args[0] < 0)
                return message.reply(`you cheater! Frick you! L`);

            var betProb = 0;

            switch(args[1]){
                case '1':
                    betProb = 2;
                    break;

                case '3':
                    betProb = 4;
                    break;
                
                case '5':
                    betProb = 6;
                    break;

                case '10':
                    betProb = 13;
                    break;
                
                case '20': 
                    betProb = 25;
                    break;

                default:
                    message.channel.send('Enter a proper gambling multiplier(1, 3, 5, 10, 20)');
                    return;
            }
            let outcome = Math.floor(Math.random() * betProb) + 1;
            if(outcome === 1) {
                let playerMoney = Number(gamFile[userId].money) + (args[0]*betProb);
                let playerWins = Number(gamFile[userId].wins) + 1;
                gamFile[userId] = {money: playerMoney, wins: playerWins};
                fs.writeFileSync(gamPath, JSON.stringify(gamFile, null, 2));
                return message.reply('you win $' + args[0]*betProb + ' with a bank total of $' + playerMoney + ' W');
            }
            else {
                let playerMoney = Number(gamFile[userId].money) - args[0];
                let playerWins = Number(gamFile[userId].wins);
                gamFile[userId] = {money: playerMoney, wins: playerWins};
                fs.writeFileSync(gamPath, JSON.stringify(gamFile, null, 2));
                return message.reply('you lost with a bank total of $' + playerMoney + ' L');
            }
            
        }
	},
};