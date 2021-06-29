import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
   '0x2186dbb090089dEA6039F6eBF82c8a43DE33879A'
); 

export default instance;
