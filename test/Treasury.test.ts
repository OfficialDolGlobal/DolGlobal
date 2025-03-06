import {
    loadFixture,
    time,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import { ethers } from "hardhat";
import { token } from "../typechain-types/@openzeppelin/contracts";
  
  enum PoolType {
    TREASURY,
    RECHARGE,
    DEVS,
    MARKETING
  }

  describe("Treasury", function () {
    this.timeout(600000); 
    async function deployFixture() {
      const [owner, otherAccount] = await ethers.getSigners();
      const DolGlobal = await ethers.getContractFactory("DolGlobal");
      const dolGlobal = await DolGlobal.deploy();
      const dolGlobalAddress = await dolGlobal.getAddress();
  

      const USDT = await ethers.getContractFactory("USDT");
      const usdt = await USDT.deploy();
      const usdtAddress = await usdt.getAddress();


      const Top5 = await ethers.getContractFactory("Top5");
      const top1 = await Top5.deploy(usdtAddress);
      const top1Address = await top1.getAddress();
      const top2 = await Top5.deploy(usdtAddress);
      const top2Address = await top2.getAddress();
      const top3 = await Top5.deploy(usdtAddress);
      const top3Address = await top3.getAddress();
      const top4 = await Top5.deploy(usdtAddress);
      const top4Address = await top4.getAddress();
      const top5 = await Top5.deploy(usdtAddress);
      const top5Address = await top5.getAddress();

      const G100 = await ethers.getContractFactory("G100");
      const g100 = await G100.deploy(usdtAddress);
      const g100Address = await g100.getAddress();
      const G10 = await ethers.getContractFactory("G15");
      const g10 = await G10.deploy(usdtAddress);
      const g10Address = await g10.getAddress();


      const UserRefferal = await ethers.getContractFactory("UserDolGlobal");
      const userRefferal = await UserRefferal.deploy(usdtAddress,dolGlobalAddress,top1Address,top2Address,top3Address,top4Address,top5Address,g100Address,g10Address);
      const userRefferalAddress = await userRefferal.getAddress();
  
      const PoolManager = await ethers.getContractFactory("PoolManager");
      const poolManager = await PoolManager.deploy(dolGlobalAddress,usdtAddress,userRefferalAddress);
      const poolManagerAddress = await poolManager.getAddress();



      const DolGlobalCollection = await ethers.getContractFactory("DolGlobalCollection");
      const collection = await DolGlobalCollection.deploy(usdtAddress,poolManagerAddress,userRefferalAddress,dolGlobalAddress);
      const collectionAddress = await collection.getAddress();

      await userRefferal.setDolGlobalCollection(collectionAddress)
      await userRefferal.setPoolManager(poolManagerAddress) 
      await userRefferal.setBotWallet(owner.address)

      await g100.setPoolManager(poolManagerAddress)
      await g10.setPoolManager(poolManagerAddress)

      const RechargePool = await ethers.getContractFactory("RechargePool");
      const rechargePool = await RechargePool.deploy(
        dolGlobalAddress,
        poolManagerAddress,
      );
      const rechargePoolAddress = await rechargePool.getAddress();


      const DevPool = await ethers.getContractFactory("DevPool");
      const devPool = await DevPool.deploy();
      const devPoolAddress = await devPool.getAddress();
      await devPool.addToken(usdtAddress,"USDT")
      await devPool.addToken(dolGlobalAddress,"DOL")

      const MarketingPool = await ethers.getContractFactory("MarketingPool");
      const marketing = await MarketingPool.deploy();
      const marketingAddress = await marketing.getAddress();
      await marketing.addToken(usdtAddress,"USDT")

      const TreasuryPool = await ethers.getContractFactory("TreasuryPoolMocked");
      const treasuryPool = await TreasuryPool.deploy(
        dolGlobalAddress,
        usdtAddress,
        poolManagerAddress
      );
      const treasuryPoolAddress = await treasuryPool.getAddress();

      await poolManager.setPools(PoolType.TREASURY,treasuryPoolAddress)
      await poolManager.setPools(PoolType.RECHARGE,rechargePoolAddress)
      await poolManager.setPools(PoolType.DEVS,devPoolAddress)
      await poolManager.setPools(PoolType.MARKETING,marketingAddress)


      
      await dolGlobal.approve(poolManagerAddress, ethers.parseUnits("49500000", "ether"));
      await poolManager.increaseLiquidityPool1(ethers.parseUnits("49500000", "ether"));
      await usdt.mint(200000*10**6)
      await usdt.connect(otherAccount).mint(100000*10**6)
      const balance = await dolGlobal.balanceOf(owner.address)
      await userRefferal.createUser(owner.address,g10Address)
      await userRefferal.setFaceId(owner.address)
      return {
        owner,
        otherAccount,
        treasuryPool,
        dolGlobal,
        treasuryPoolAddress,
        usdt,
        balance,
        poolManager,poolManagerAddress,
        rechargePool,userRefferal,userRefferalAddress,collection,collectionAddress,rechargePoolAddress,g10,g10Address
      };
    }
  
    // it("Should create donation usdt", async function () {
    //   const {
    //     owner,
    //     otherAccount,
    //     treasuryPool,
    //     dolGlobal,
    //     treasuryPoolAddress,
    //     usdt,
    //     balance,
    //     poolManager,
    //     rechargePool,userRefferalAddress,userRefferal,g10Address
    //   } = await loadFixture(deployFixture);
    //   expect(await dolGlobal.balanceOf(treasuryPoolAddress)).to.be.equal(ethers.parseUnits("49500000", "ether"))
    //   expect(await treasuryPool.distributionBalance()).to.be.equal(ethers.parseUnits("49500000", "ether"))

    //   await usdt.approve(treasuryPoolAddress,2000*10**6)
    //   expect(await rechargePool.getTotalTokens()).to.be.equal(0)
    //   await treasuryPool.contribute(1000*10**6)

      
    //   expect(await rechargePool.getTotalTokens()).to.be.equal(ethers.parseUnits("49.998"))
    //   await expect(treasuryPool.contribute(5*10**6)).to.be.revertedWith("Amount must be greater than 10 dollars")

    //   expect((await treasuryPool.getUser(owner.address,1)).balance).to.be.equal(2500*10**6);
    //   expect((await treasuryPool.getUser(owner.address,1)).deposit).to.be.equal(1000*10**6);
    //   await time.increase(60*60)
    //   expect(await treasuryPool.calculateDaysElapsedToClaim(owner.address,1)).to.be.equal(0)
    //   await time.increase(24*60*60)
    //   expect(await treasuryPool.timeUntilNextWithdrawal(owner.address,1)).to.be.equal(0)
    //   expect(await treasuryPool.calculateDaysElapsedToClaim(owner.address,1)).to.be.equal(1)
    //   expect((await treasuryPool.getUser(owner.address,1)).daysPaid).to.be.equal(0)
    //   await treasuryPool.claimContribution(1)

    //   await expect(treasuryPool.claimContribution(1)).to.be.revertedWith("Tokens are still locked")
    //   expect((await treasuryPool.getUser(owner.address,1)).daysPaid).to.be.equal(1)

    //   expect(await treasuryPool.calculateDaysElapsedToClaim(owner.address,1)).to.be.equal(0)
    //   await time.increase(10*24*60*60)
    //   expect(await treasuryPool.calculateDaysElapsedToClaim(owner.address,1)).to.be.equal(10)
    //   expect(await treasuryPool.timeUntilNextWithdrawal(owner.address,1)).to.be.equal(0)
    //   await treasuryPool.claimContribution(1)

    //   expect((await treasuryPool.getUser(owner.address,1)).daysPaid).to.be.equal(11)
    //   await time.increase(200*24*60*60)
    //   const claim = await treasuryPool.previewClaim(owner.address,1)
    //   expect(claim[0]).to.be.equal(2316666666n);
      
    //   await treasuryPool.claimContribution(1)
    //   expect((await treasuryPool.getUser(owner.address,1)).daysPaid).to.be.equal(150)

    //   await time.increase(200*24*60*60)
    //   await expect(treasuryPool.claimContribution(1)).to.be.revertedWith("Already claimed")


    //   const tx = await treasuryPool.contribute(10*10**6)
      
    //   expect(await treasuryPool.userTotalContributions(owner.address)).to.be.equal(2)
    //   await time.increase(10*24*60*60)
    //   await expect(treasuryPool.claimContribution(2)).to.be.revertedWith("Minimum accumulated to claim is 10 dollars")    
    //   await time.increase(130*24*60*60)
    //   await treasuryPool.claimContribution(2)
    //   await time.increase(12*24*60*60)

    //   await treasuryPool.claimContribution(2)
    //   expect(await treasuryPool.userTotalEarned(owner.address)).to.be.equal(2524999997n);
    //   await usdt.connect(otherAccount).mint(100*10**6)
    //   await usdt.connect(otherAccount).approve(treasuryPoolAddress,100*10**6)
    //   // await expect(treasuryPool.connect(otherAccount).contribute(100*10**6)).to.be.revertedWith("User not verified face id")
      
      
    // }); 
    // it("Should create donation usdt", async function () {
    //   const {
    //     owner,
    //     otherAccount,
    //     treasuryPool,
    //     dolGlobal,
    //     treasuryPoolAddress,
    //     usdt,
    //     balance,
    //     poolManager,
    //     rechargePool,userRefferalAddress
    //   } = await loadFixture(deployFixture);
    //   expect(await dolGlobal.balanceOf(treasuryPoolAddress)).to.be.equal(ethers.parseUnits("49500000", "ether"))
    //   expect(await treasuryPool.distributionBalance()).to.be.equal(ethers.parseUnits("49500000", "ether"))
      
    //   await usdt.approve(treasuryPoolAddress,200000*10**6)
    //   expect(await rechargePool.getTotalTokens()).to.be.equal(0)
      
    //   await treasuryPool.contribute(1000*10**6)
    //   await time.increase(69*24*60*60)
    //   await treasuryPool.claimContribution(1)
    //   console.log(await treasuryPool.timeUntilNextWithdrawal(owner.address,1));
    //   await time.increase(24*60*60*1000)
    //   console.log(await treasuryPool.timeUntilNextWithdrawal(owner.address,1));


      

  


      
    // }); 

    it("Should create donation with unilevel", async function () {
      const {
        owner,
        otherAccount,
        treasuryPool,
        dolGlobal,
        treasuryPoolAddress,
        usdt,
        balance,
        poolManager,
        rechargePool,
        userRefferalAddress,
        userRefferal,collection,collectionAddress,rechargePoolAddress
      } = await loadFixture(deployFixture);
      const wallets = [];
      wallets.push(owner)
      for (let index = 1; index <= 41; index++) {
        const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
        wallets.push(wallet)
        await owner.sendTransaction({to:wallet.address,value:ethers.parseEther("1")})
        await userRefferal.connect(wallet).createUser(wallet.address,wallets[index-1])
        await collection.marketingBonus(wallet.address,100*10**6)
        await userRefferal.setFaceId(wallet.address)
      }
      await usdt.connect(wallets[wallets.length-1]).mint(100*10**6)
      await usdt.connect(wallets[wallets.length-1]).approve(collectionAddress,100*10**6)
      
        await collection.connect(wallets[wallets.length-1]).mintNftGlobal(100*10**6)   
        for (let index = 1; index < wallets.length; index++) {
          console.log("Nível: #"+String(wallets.length-index-1)," Ganho: "+ethers.formatUnits(await usdt.balanceOf(wallets[index].address),6));
          
        }
          
      
    })



  });