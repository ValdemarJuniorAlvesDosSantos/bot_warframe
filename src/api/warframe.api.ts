import axios from 'axios';
const api = axios.create({
    baseURL: 'https://api.warframestat.us',
})
api.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
export interface dropSearch{
    place: string;
    item: string;
    rarity:string;
    chance:number;
}
export default api;