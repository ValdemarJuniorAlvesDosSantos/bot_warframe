interface CommandInterface {
    name:string;
    description:string;
    args_length:number;
    help:string;
    execute: Function;

};
export default CommandInterface;