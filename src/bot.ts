require("dotenv/config");
import CommandInterface from './commands/CommandInterface';
import  * as Discord from 'discord.js';
import  * as fs from 'fs';
import api from "./api/warframe.api";

let token = process.env.TOKEN || "";
let prefix = process.env.PREFIX || "#";

const client = new Discord.Client();
let commands = new Discord.Collection<string,CommandInterface>();
let subscribesCetus: any[] = [];

console.log('Iniciando Server')

client.once('ready', () => {
	console.log('Cliente do Discord Iniciado.');
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
    //message.channel.send("jaja Te respondo meu cumpadi");
    if (message.content[0] !== prefix) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    
    let commandName = args.shift()
    if (commandName){
        commandName = commandName.toLowerCase() || " ";
        console.log(commandName)
        if (commandName === 'subscribecetus') {
            subscribesCetus.push(message.channel);
            message.channel.send("Inscrito em cetus!");
            const channel: any =  message.channel;
            console.log("Canal inscrito: " + channel.guild.name + " -> " + channel.name);
            return;
        }
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

setInterval(() => {
    let messageResp: string = '';
    api.get('pc/cetusCycle', {params: {language: 'pt'}}).then(response =>{
        let minutes = response.data.shortString.split("m")[0];
        switch (minutes) {
            case '5':
            case '10':
            case '15':
                subscribesCetus.forEach((channel)=>{
                    channel.send(response.data.shortString);
                });
                break;        
            default:
                break;
        } 
    }).catch( err =>{
        console.log(err);
    });

}, 60000);

client.login(token);
