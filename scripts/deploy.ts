import { ethers } from "hardhat";
import { exec } from 'child_process';
import userAbi from './user.abi.json'
enum PoolType {
    TREASURY,
    RECHARGE,
    DEVS,
    MARKETING
  }


async function main() {

      // const DolGlobal = await ethers.getContractFactory("DolGlobal");
      // const dolGlobal = await DolGlobal.deploy();
      // await dolGlobal.waitForDeployment()
      // const dolGlobalAddress = await dolGlobal.getAddress();
      // console.log("dolGlobalAddress "+dolGlobalAddress);
      
      // await runCommand(dolGlobalAddress,[])


      // const USDT = await ethers.getContractFactory("USDT");
      // const usdt = await USDT.deploy();
      // await usdt.waitForDeployment()
      // const usdtAddress = await usdt.getAddress();
      // console.log("usdtAddress "+usdtAddress);

      // await runCommand(usdtAddress,[])


      
      // const UniswapOracle = await ethers.getContractFactory("UniswapOracle");
      // const oracle = await UniswapOracle.deploy();
      // await oracle.waitForDeployment()
      // const oracleAddress = await oracle.getAddress();
      // console.log("oracleAddress "+oracleAddress);

      // await runCommand(oracleAddress,[])

      // const paramsTop5 = ["0xa3E0CE8a70F5376DFc1bd224Bd24254610539bDa"]
      // const Top5 = await ethers.getContractFactory("Top5");
      // const top1 = await Top5.deploy(paramsTop5[0]);
      // await top1.waitForDeployment()
      // const top1Address = await top1.getAddress();
      // console.log("top1Address: ",top1Address);
      // await runCommand(top1Address,[paramsTop5[0]])
      // const top2 = await Top5.deploy(paramsTop5[0]);
      // await top2.waitForDeployment()
      // const top2Address = await top2.getAddress();
      // console.log("top2Address: ",top2Address);
      // await runCommand(top2Address,[paramsTop5[0]])
      // const top3 = await Top5.deploy(paramsTop5[0]);
      // await top3.waitForDeployment()
      // const top3Address = await top3.getAddress();
      // console.log("top3Address: ",top3Address);
      // await runCommand(top3Address,[paramsTop5[0]])
      // const top4 = await Top5.deploy(paramsTop5[0]);
      // await top4.waitForDeployment()
      // const top4Address = await top4.getAddress();
      // console.log("top4Address: ",top4Address);
      // await runCommand(top4Address,[paramsTop5[0]])
      // const top5 = await Top5.deploy(paramsTop5[0]);
      // await top5.waitForDeployment()
      // const top5Address = await top5.getAddress();
      // console.log("top5Address: ",top5Address);
      // await runCommand(top5Address,[paramsTop5[0]])

      // const G100 = await ethers.getContractFactory("G100");
      // const g100 = await G100.deploy(paramsTop5[0]);
      // await g100.waitForDeployment()
      // const g100Address = await g100.getAddress();
      // console.log("g100Address: ",g100Address);
      // await runCommand(g100Address,[paramsTop5[0]])


      // const G10 = await ethers.getContractFactory("G10");
      // const g10 = await G10.deploy(paramsTop5[0]);
      // await g10.waitForDeployment()
      // const g10Address = await g10.getAddress();
      // console.log("g10Address: ",g10Address);
      // await runCommand(g10Address,[paramsTop5[0]])

      const userParams = ["0xa3E0CE8a70F5376DFc1bd224Bd24254610539bDa","0x889E5Fa01be3Ab8A4480Ac0a52EbF1605EA6f64C","0xb38D27157c913Ab634bFE35837a9f6A5884e861A","0x7dB6E172d2DaF51f667Ab70a86200FE26541804C","0x6076aD98e52eb58B26324be23BeE8CdD020e5179","0x04EE90acd7185CD53B428C1c16b787053fE7c133","0x68107596dc39535Aad285CEBbCfE768a9B6123D6","0xA59788333fFd93CC34dbFACB7146e90d61A55483","0x1e8e56675001506b0Ff901DF12398E50044589d3"]


      const UserRefferal = await ethers.getContractFactory("UserDolGlobal");
      const userRefferal = await UserRefferal.deploy(userParams[0],userParams[1],userParams[2],userParams[3],userParams[4],userParams[5],userParams[6],userParams[7],userParams[8],{gasPrice:ethers.parseUnits("300","gwei")});
      await userRefferal.waitForDeployment()
      const userRefferalAddress = await userRefferal.getAddress();
      console.log("userRefferalAddress "+userRefferalAddress);

      // await runCommand(userRefferalAddress,[userParams[0],userParams[1],userParams[2],userParams[3],userParams[4],userParams[5],userParams[6],userParams[7],userParams[8]])

      // const userParamsMulticall = ["0xD4B1692536C21852a05Ac4Df72E725D28827e871"]


      // const UserRefferalMulticall = await ethers.getContractFactory("MultiCallUser");
      // const userRefferalMulticall = await UserRefferalMulticall.deploy(userParamsMulticall[0]);
      // await userRefferalMulticall.waitForDeployment()
      // const userRefferalAddressMulticall = await userRefferalMulticall.getAddress();
      // console.log("userRefferalAddressMulticall "+userRefferalAddressMulticall);

      // await runCommand(userRefferalAddressMulticall,[userParamsMulticall[0]])

      // const PaymentTrackerParams = ["0xa3E0CE8a70F5376DFc1bd224Bd24254610539bDa"]


      // const PaymentTracker = await ethers.getContractFactory("PaymentTracker");
      // const paymentTracker = await PaymentTracker.deploy(PaymentTrackerParams[0]);
      // await paymentTracker.waitForDeployment()
      // const paymentTrackerAddress = await paymentTracker.getAddress();
      // console.log("paymentTrackerAddress "+paymentTrackerAddress);

      // await runCommand(paymentTrackerAddress,[PaymentTrackerParams[0]])

      // const poolManagerParams = ["0x889E5Fa01be3Ab8A4480Ac0a52EbF1605EA6f64C","0xa3E0CE8a70F5376DFc1bd224Bd24254610539bDa",userRefferalAddress]

      // const PoolManager = await ethers.getContractFactory("PoolManager");
      // const poolManager = await PoolManager.deploy(poolManagerParams[0],poolManagerParams[1],poolManagerParams[2],{gasPrice:ethers.parseUnits("300","gwei")});
      // await poolManager.waitForDeployment()
      // const poolManagerAddress = await poolManager.getAddress();
      // console.log("poolManagerAddress "+poolManagerAddress);

      // await runCommand(poolManagerAddress,[poolManagerParams[0],poolManagerParams[1],poolManagerParams[2]])
      // await(await poolManager.setUniswapOracle("0xF998e67148839D1bCC9aEC3d23Cf1e8C39821a37",{gasPrice:ethers.parseUnits("300","gwei")})).wait()
      // await(await poolManager.setLiquidityPoolUniswapId(2404342,{gasPrice:ethers.parseUnits("300","gwei")})).wait()

      const DolGlobalCollection = await ethers.getContractFactory("DolGlobalCollection");

      const collectionParams = ["0xa3E0CE8a70F5376DFc1bd224Bd24254610539bDa",poolManagerAddress,userRefferalAddress,"0x889E5Fa01be3Ab8A4480Ac0a52EbF1605EA6f64C"]
      const collection = await DolGlobalCollection.deploy(collectionParams[0],collectionParams[1],collectionParams[2],collectionParams[3],{gasPrice:ethers.parseUnits("300","gwei")});
      await collection.waitForDeployment()
      const collectionAddress = await collection.getAddress();
      console.log("collectionAddress "+collectionAddress);

      await runCommand(collectionAddress,[collectionParams[0],collectionParams[1],collectionParams[2],collectionParams[3]])

    // await(await g10.setPoolManager(poolManagerAddress)).wait();
    // await(await g10.setUserContract(userRefferalAddress)).wait();

    // await(await g100.setPoolManager(poolManagerAddress)).wait();


      // await (await userRefferal.setDolGlobalCollection(collectionAddress,{gasPrice:ethers.parseUnits("300","gwei")})).wait()
      // await (await userRefferal.setPoolManager(poolManagerAddress,{gasPrice:ethers.parseUnits("300","gwei")})).wait()


  
      // const rechargeParams = ["0x889E5Fa01be3Ab8A4480Ac0a52EbF1605EA6f64C",
      //   poolManagerAddress]
      // const RechargePool = await ethers.getContractFactory("RechargePool");
      // const rechargePool = await RechargePool.deploy(
      //   rechargeParams[0],rechargeParams[1]
      // );
      // await rechargePool.waitForDeployment()
      // const rechargePoolAddress = await rechargePool.getAddress();
      // console.log("rechargePoolAddress "+rechargePoolAddress);

      // await runCommand(rechargePoolAddress,[rechargeParams[0],rechargeParams[1]])


      // const DevPool = await ethers.getContractFactory("DevPool");
      // const devPool = await DevPool.deploy();
      // await devPool.waitForDeployment()

      // const devPoolAddress = await devPool.getAddress();
      // console.log("devPoolAddress "+devPoolAddress);

      // await runCommand(devPoolAddress,[])

      // await(await devPool.addToken("0xa3E0CE8a70F5376DFc1bd224Bd24254610539bDa","USDT")).wait()
      // await(await devPool.addToken("0x889E5Fa01be3Ab8A4480Ac0a52EbF1605EA6f64C","DOL")).wait()
      // const MarketingPool = await ethers.getContractFactory("MarketingPool");
      // const marketingPool = await MarketingPool.deploy();
      // await marketingPool.waitForDeployment()
      // const marketingPoolAddress = await marketingPool.getAddress();
      // console.log("marketingPoolAddress "+marketingPoolAddress);

      // await(await marketingPool.addToken("0xa3E0CE8a70F5376DFc1bd224Bd24254610539bDa","USDT")).wait()
      // await runCommand(marketingPoolAddress,[])

      // await (await top1.setPoolManager(poolManagerAddress)).wait()
      // await (await top2.setPoolManager(poolManagerAddress)).wait()
      // await (await top3.setPoolManager(poolManagerAddress)).wait()
      // await (await top4.setPoolManager(poolManagerAddress)).wait()
      // await (await top5.setPoolManager(poolManagerAddress)).wait()
      // await (await g100.setPoolManager(poolManagerAddress)).wait()
      // await (await g10.setPoolManager(poolManagerAddress)).wait()


      // const treasuryParams = ["0x889E5Fa01be3Ab8A4480Ac0a52EbF1605EA6f64C","0xa3E0CE8a70F5376DFc1bd224Bd24254610539bDa",poolManagerAddress]

      // const TreasuryPool = await ethers.getContractFactory("TreasuryPool");
      // const treasuryPool = await TreasuryPool.deploy(
      //   treasuryParams[0],
      //   treasuryParams[1],
      //   treasuryParams[2],{gasPrice:ethers.parseUnits("300","gwei")}
      // );
      // await treasuryPool.waitForDeployment()
      // const treasuryPoolAddress = await treasuryPool.getAddress();
      // console.log("treasuryPoolAddress "+treasuryPoolAddress);

      // await runCommand(treasuryPoolAddress,[        treasuryParams[0],
      //   treasuryParams[1],
      //   treasuryParams[2]])


      // await (await poolManager.setPools(PoolType.TREASURY,treasuryPoolAddress,{gasPrice:ethers.parseUnits("300","gwei")})).wait()
      
      // await (await poolManager.setPools(PoolType.RECHARGE,"0xa8Cda26d10611B7f9C6Ae808bD0FDcd513564140",{gasPrice:ethers.parseUnits("300","gwei")})).wait()
      // await (await poolManager.setPools(PoolType.DEVS,"0xfA66c51E617D3b04400418D8bcAb9b0493026311",{gasPrice:ethers.parseUnits("300","gwei")})).wait()
      // await (await poolManager.setPools(PoolType.MARKETING,"0x3f29872d5bBE60834A8B163B40332d965ad14f3F",{gasPrice:ethers.parseUnits("300","gwei")})).wait()


      
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



function runCommand(address:string, params:any[]) {
  const formattedParams = params.map(param => 
    typeof param === 'string' ? `"${param}"` : param
  ).join(' ');

  const command = `npx hardhat verify --network mumbai ${address} ${formattedParams}`;

  setTimeout(() => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
    });
  }, 30000);  
}