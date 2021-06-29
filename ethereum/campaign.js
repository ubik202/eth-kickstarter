import web3 from './web3';
import Campaign from './build/Campaign.json'


const campaign = (address) => { 
    const contract = new web3.eth.Contract(
      JSON.parse(Campaign.interface),
      address
    )
    return contract;
}; 


export default campaign;
