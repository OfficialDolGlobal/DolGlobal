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

      const DolGlobal = await ethers.getContractFactory("DolGlobal");
      const dolGlobal = await DolGlobal.deploy();
      await dolGlobal.waitForDeployment()
      const dolGlobalAddress = await dolGlobal.getAddress();
      console.log("dolGlobalAddress "+dolGlobalAddress);
      
      await runCommand(dolGlobalAddress,[])


      const USDT = await ethers.getContractFactory("USDT");
      const usdt = await USDT.deploy();
      await usdt.waitForDeployment()
      const usdtAddress = await usdt.getAddress();
      console.log("usdtAddress "+usdtAddress);

      await runCommand(usdtAddress,[])


      
      const UniswapOracle = await ethers.getContractFactory("UniswapOracle");
      const oracle = await UniswapOracle.deploy();
      await oracle.waitForDeployment()
      const oracleAddress = await oracle.getAddress();
      console.log("oracleAddress "+oracleAddress);

      await runCommand(oracleAddress,[])

      const paramsTop5 = [usdtAddress]
      const Top5 = await ethers.getContractFactory("Top5");
      const top1 = await Top5.deploy(paramsTop5[0]);
      await top1.waitForDeployment()
      const top1Address = await top1.getAddress();
      console.log("top1Address: ",top1Address);
      await runCommand(top1Address,[paramsTop5[0]])
      const top2 = await Top5.deploy(paramsTop5[0]);
      await top2.waitForDeployment()
      const top2Address = await top2.getAddress();
      console.log("top2Address: ",top2Address);
      await runCommand(top2Address,[paramsTop5[0]])
      const top3 = await Top5.deploy(paramsTop5[0]);
      await top3.waitForDeployment()
      const top3Address = await top3.getAddress();
      console.log("top3Address: ",top3Address);
      await runCommand(top3Address,[paramsTop5[0]])
      const top4 = await Top5.deploy(paramsTop5[0]);
      await top4.waitForDeployment()
      const top4Address = await top4.getAddress();
      console.log("top4Address: ",top4Address);
      await runCommand(top4Address,[paramsTop5[0]])
      const top5 = await Top5.deploy(paramsTop5[0]);
      await top5.waitForDeployment()
      const top5Address = await top5.getAddress();
      console.log("top5Address: ",top5Address);
      await runCommand(top5Address,[paramsTop5[0]])

      const G100 = await ethers.getContractFactory("G100");
      const g100 = await G100.deploy(paramsTop5[0]);
      await g100.waitForDeployment()
      const g100Address = await g100.getAddress();
      console.log("g100Address: ",g100Address);
      await runCommand(g100Address,[paramsTop5[0]])


      const G10 = await ethers.getContractFactory("G15");
      const g10 = await G10.deploy(paramsTop5[0]);
      await g10.waitForDeployment()
      const g10Address = await g10.getAddress();
      console.log("g10Address: ",g10Address);
      await runCommand(g10Address,[paramsTop5[0]])

      const userParams = [usdtAddress,dolGlobalAddress,top1Address,top2Address,top3Address,top4Address,top5Address,g100Address,g10Address]


      const UserRefferal = await ethers.getContractFactory("UserDolGlobal");
      const userRefferal = await UserRefferal.deploy(userParams[0],userParams[1],userParams[2],userParams[3],userParams[4],userParams[5],userParams[6],userParams[7],userParams[8]);
      await userRefferal.waitForDeployment()
      const userRefferalAddress = await userRefferal.getAddress();
      console.log("userRefferalAddress "+userRefferalAddress);

      await runCommand(userRefferalAddress,[userParams[0],userParams[1],userParams[2],userParams[3],userParams[4],userParams[5],userParams[6],userParams[7],userParams[8]])

      // const userParamsMulticall = [userRefferalAddress]


      // const UserRefferalMulticall = await ethers.getContractFactory("MultiCallUser");
      // const userRefferalMulticall = await UserRefferalMulticall.deploy(userParamsMulticall[0]);
      // await userRefferalMulticall.waitForDeployment()
      // const userRefferalAddressMulticall = await userRefferalMulticall.getAddress();
      // console.log("userRefferalAddressMulticall "+userRefferalAddressMulticall);

      // await runCommand(userRefferalAddressMulticall,[userParamsMulticall[0]])



      const poolManagerParams = [dolGlobalAddress,usdtAddress,userRefferalAddress]

      const PoolManager = await ethers.getContractFactory("PoolManager");
      const poolManager = await PoolManager.deploy(poolManagerParams[0],poolManagerParams[1],poolManagerParams[2]);
      await poolManager.waitForDeployment()
      const poolManagerAddress = await poolManager.getAddress();
      console.log("poolManagerAddress "+poolManagerAddress);

      await runCommand(poolManagerAddress,[poolManagerParams[0],poolManagerParams[1],poolManagerParams[2]])
      await(await poolManager.setUniswapOracle(oracleAddress)).wait()
      // await(await poolManager.setLiquidityPoolUniswapId(2459311,{gasPrice:ethers.parseUnits("300","gwei")})).wait()

      const DolGlobalCollection = await ethers.getContractFactory("DolGlobalCollection");

      const collectionParams = [usdtAddress,poolManagerAddress,userRefferalAddress,dolGlobalAddress]
      const collection = await DolGlobalCollection.deploy(collectionParams[0],collectionParams[1],collectionParams[2],collectionParams[3]);
      await collection.waitForDeployment()
      const collectionAddress = await collection.getAddress();
      console.log("collectionAddress "+collectionAddress);

      await runCommand(collectionAddress,[collectionParams[0],collectionParams[1],collectionParams[2],collectionParams[3]])



      await (await userRefferal.setDolGlobalCollection(collectionAddress)).wait()
      await (await userRefferal.setPoolManager(poolManagerAddress)).wait()


  
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

      // const MarketingPool = await ethers.getContractFactory("MarketingPool");
      // const marketingPool = await MarketingPool.deploy();
      // await marketingPool.waitForDeployment()
      // const marketingPoolAddress = await marketingPool.getAddress();
      // console.log("marketingPoolAddress "+marketingPoolAddress);

      // await(await marketingPool.addToken("0xa3E0CE8a70F5376DFc1bd224Bd24254610539bDa","USDT")).wait()
      // await runCommand(marketingPoolAddress,[])


    await(await g10.setPoolManager(poolManagerAddress)).wait();
    await(await g10.setUserContract(userRefferalAddress)).wait();

    await(await g100.setPoolManager(poolManagerAddress)).wait();

      await (await top1.setPoolManager(poolManagerAddress)).wait()
      await (await top2.setPoolManager(poolManagerAddress)).wait()
      await (await top3.setPoolManager(poolManagerAddress)).wait()
      await (await top4.setPoolManager(poolManagerAddress)).wait()
      await (await top5.setPoolManager(poolManagerAddress)).wait()
      await (await g100.setPoolManager(poolManagerAddress)).wait()
      await (await g10.setPoolManager(poolManagerAddress)).wait()


      const treasuryParams = [dolGlobalAddress,usdtAddress,poolManagerAddress]

      const TreasuryPool = await ethers.getContractFactory("TreasuryPool");
      const treasuryPool = await TreasuryPool.deploy(

        treasuryParams[0],
        treasuryParams[1],
        treasuryParams[2]
      );
      await treasuryPool.waitForDeployment()
      const treasuryPoolAddress = await treasuryPool.getAddress();
      console.log("treasuryPoolAddress "+treasuryPoolAddress);

      await runCommand(treasuryPoolAddress,[        treasuryParams[0],
        treasuryParams[1],
        treasuryParams[2]])


      await (await poolManager.setPools(PoolType.TREASURY,treasuryPoolAddress)).wait()
      
      await (await poolManager.setPools(PoolType.RECHARGE,"0xa8Cda26d10611B7f9C6Ae808bD0FDcd513564140")).wait()
      await (await poolManager.setPools(PoolType.DEVS,"0x078086f6CCfeD419579F7d91639d84a848f2f913")).wait()
      await (await poolManager.setPools(PoolType.MARKETING,"0x9ccCD5f4B5D6aF0b7C553f6F4AD26271B812Cf91")).wait()


      
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
  }, 10000);  
}