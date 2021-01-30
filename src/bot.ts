require("dotenv/config");
import CommandInterface from './commands/CommandInterface';
import  * as Discord from 'discord.js';
import  * as fs from 'fs';

let token = process.env.TOKEN || "";
let prefix = process.env.PREFIX || "#";

const client = new Discord.Client();
let commands = new Discord.Collection<string,CommandInterface>();

client.once('ready', () => {
	console.log('Ready!');
});



const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command:CommandInterface = require(`./commands/${file}`).default;
    if (command){
        const name = command.name;
        commands.set(name, command);
    }   
}
client.on('message', message => {
    
    if (message.content[0] !== prefix) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    
    let commandName = args.shift()
    if (commandName){
        commandName = commandName.toLowerCase() || " ";
    }else{
        return;
    }    
    if (!commands.has(commandName)) return;
    
    const command = commands.get(commandName);
    
    if (!command) return;
        
    if (args.length < command.args_length){
        message.reply("Falta de algum argumento\n O commando deve ser usado da seguinte forma -> "+command.help);
        return;
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

});

client.login(token);
