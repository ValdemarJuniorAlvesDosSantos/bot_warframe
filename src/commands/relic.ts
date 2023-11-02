import * as Discord from 'discord.js';
import api, { dropSearch } from "../api/warframe.api";
import CommandInterface from "./CommandInterface";

function relic(message: Discord.Message,args: Array<String>){
    let defense = false;
    let rot:String = "";
    if(args[0] === "A" || args[0] === "B"  || args[0] === "C"  ){
        rot = args[0];
        args.shift();
    }
    if(args[0] === "defense"){
        args.shift();
        defense = true;
    }
    const query = args[0] + " " + args[1]+ " relic";
    api.get(`drops/search/${query}`).then(response => {
        if (response.data.length == 0){
            message.channel.send("Nada encontradao!");
            return;
        }
        let resp = "Lista de locais para drop.\n";
        let data: Array<dropSearch> = response.data;
        if (rot!=""){
            data=data.filter(placeDrop=>{return placeDrop.place.includes("Rot "+ rot)});
        }
        if (defense){
            data=data.filter(placeDrop=>{return placeDrop.place.includes("Defense")});
        }
        data = data.sort((a,b)=>{return b.chance - a.chance }).filter(placeDrop=>{
            if (placeDrop.item.toLowerCase() === query.toLowerCase()) {return true;}
            return false;
        });
        data = data.slice(0,20);
        console.log(data);
        let i = 0;
        for (let placeDrop of data){                      
            resp += placeDrop.place +"\t\t\t\t"+placeDrop.chance+"%\n"; 
            i=i+1;
            if(resp.length > 1500){
                message.channel.send(resp);
                resp = "";
            }                    
        }
        message.channel.send(resp);
    })
}
let command:CommandInterface={
    name:"relic",
    args_length:2,
    description: "Get information about relic",
    help: "relic age name",
    execute: relic
}

export default command;

