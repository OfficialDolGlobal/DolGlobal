import { ethers } from "ethers";
import userAbi from './usdt.abi.json';
import dotenv from "dotenv";
dotenv.config();

async function main() {
    const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
    const tx = await provider.getTransaction("0x8104a25220b3167c2406209fddbd213dc11bd5645d892a5d0dd099784c0faf28");
    
    const iface = new ethers.Interface(userAbi);
    const decodedData = iface.parseTransaction({ data: tx!.data, value: tx!.value });
    
    console.log(`From: ${tx!.from}`);
    console.log(`To: ${decodedData!.args.to}`);
    console.log(`Amount: ${decodedData!.args.value.toString()}`);
    

}

main().catch((error) => {
    console.error("Erro no script principal:", error.message);
});
