import { ethers } from "ethers";
import treasuryAbi from './usdt.abi.json';
import dotenv from "dotenv";
dotenv.config();

async function main() {
    const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
    const contract = new ethers.Contract("0x3608faAaa3629a43C728a6Cb7285f76156C49332",treasuryAbi,provider)
    console.log(await contract.distributionBalance());
    
    

}

main().catch((error) => {
    console.error("Erro no script principal:", error.message);
});
