module.exports = {
	name: 'donate',
    description: 'Donate some amount to another player',
    args: true,
    usage: '<amount> <user>',
    guildOnly: true,
    cooldown: 3, //in seconds
    aliases: ['don', 'give'],
	execute(message, args) {
        const fs = require('fs') //importing file save
        
        var gamPath = './user_data/gambling.json';
        var gamRead = fs.readFileSync(gamPath);
        var gamFile = JSON.parse(gamRead); //ready for use
        var userId = message.author.id; //user id here

        if (!gamFile[userId]) { //this checks if data for the user has already been created
            return message.reply(`You haven't gambled yet`);
        } else {
            let donatee = args[1];
            if(args[1].startsWith('<@') && args[1].endsWith('>')){
                donatee = args[1].slice(2, -1);
                if(donatee.startsWith('!')) {
                    donatee = donatee.slice(1);
                }
            }
            else {
                return message.reply('the command is !donate <amount> <user>!');
            }
            

            if(donatee === userId){
                return message.reply(`you can't gift yourself L`);
            }

            if(!gamFile[donatee]) {
                return message.reply('you need to tag a user in order to donate to them!');
            }

            const donateAmount = Number(args[0]);
            if(donateAmount < 0){
                return message.reply(`you need to donate a positive amount`);
            }

            let donatorMoney = Number(gamFile[userId].money);
            let donateeMoney = Number(gamFile[donatee].money);

            if(donatorMoney < donateAmount) {
                return message.reply(`you don't have enough money L`);
            }

            donatorMoney -= donateAmount;
            donateeMoney += donateAmount;
            gamFile[userId] = {money: donatorMoney, wins: gamFile[userId].wins};
            gamFile[donatee] = {money: donateeMoney, wins: gamFile[donatee].wins};
            fs.writeFileSync(gamPath, JSON.stringify(gamFile, null, 2));

            return message.reply('you have a balance of $' + gamFile[userId].money + ` & ` + args[1] + ` has $` + gamFile[donatee].money); 
        }
	},
};