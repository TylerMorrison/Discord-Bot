const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { cooldown } = require('./commands/ping');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return; //if the message received is from a bot or doesn't start with the prefix

    const args = message.content.slice(prefix.length).trim().split(/ +/); //splite the arguments into an array
    const commandName = args.shift().toLowerCase(); //retrieve the command 

    const command = client.commands.get(commandName) 
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); 

    if(!command) return; //if command doesn't exist, end
    
    //check permissions 
    if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('You can not use this command!');
		}
	}

    //Tell the user they didn't provide args when required and what args they need
    if(command.args && !args.length) { //check if the command requires args and if they exist
        
        let reply = `You didn't provide any arguments, ${message.author}!`; 

        if(command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    //Tell the user they can't use a server only command in dms 
    if(command.guildOnly && message.channel.type === 'dm') { 
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if(!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000; //in milliseconds. Default is 3 seconds.

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(()=> timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(token);