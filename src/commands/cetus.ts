import * as Discord from 'discord.js';
import api, { dropSearch } from "../api/warframe.api";
import CommandInterface from "./CommandInterface";

function cetus(message: Discord.Message, args: Array<String>): void {
    let messageResp: string = '';
    api.get('pc/cetusCycle', {params: {language: 'pt'}}).then(response =>{
        console.log(response.data);
        messageResp = response.data.shortString;
        message.channel.send(messageResp);
        // if (response.data.state == 'day') {
        //     messageResp = 'Faltam ' + response.data.timeLeft +  ' para ficar de noite';
        // }
    }).catch( err =>{
        console.log(err);
    });

}

let command:CommandInterface={
    name:"cetus",
    args_length:0,
    description: "horario de cetus",
    help: "horario de cetus",
    execute: cetus
}

export default command;