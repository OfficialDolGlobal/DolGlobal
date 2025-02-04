import { ethers } from "ethers";
import userAbi from './user.abi.json';

async function main() {
    const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
    const signer = new ethers.Wallet("ab59ee995756f7a623b34f8acb83eba63c4177cc86a7b92734806fe01e071204", provider);
    const sponsor = "0x76d00279e0b83E5340ac8Be2472C9930B3731782";

    const userContract = new ethers.Contract(
        "0xA1Ccfb41BbAc5fd0c4080B228839B66368A681B8",
        userAbi,
        signer
    );
    const wallets = [sponsor]
    for (let i = 1; i <= 5; i++) {
        const wallet = ethers.Wallet.createRandom();
        console.log(`Carteira ${i}: ${wallet.address}`);
        try {
            const transaction = await userContract.createUser(wallet.address, wallets[i-1], { gasPrice: ethers.parseUnits("300", "gwei") });
            await transaction.wait();
            wallets.push(wallet.address)

            console.log(`Transação ${i} enviada: ${transaction.hash}`);
        } catch (error:any) {
            console.error(`Erro na transação ${i}: ${error.message}`);
        }
    }
}

main().catch((error) => {
    console.error("Erro no script principal:", error.message);
});
