const argv = require('minimist')(process.argv.slice(3), {string: ['typenet','net1', 'net2']});
const Web3 = require('web3');
const { checkoutProvider, timeout } = require('../../utils/helper');
const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

const portal1    = artifacts.require('Portal');
const portal2    = artifacts.require('Portal');

const synthesis1  = artifacts.require('Synthesis');
const synthesis2  = artifacts.require('Synthesis');

const bridge1    = artifacts.require('Bridge');
const bridge2    = artifacts.require('Bridge');

const TestUniswap = artifacts.require('TestUniswap');




const factoryProvider =  checkoutProvider(argv);

let envNet1 = require('dotenv').config({ path: `./env_connect_to_network1.env` });
let envNet2 = require('dotenv').config({ path: `./env_connect_to_network2.env` });


contract('Simple e2e test', (deployer, accounts) => {


  before(async () => {

    portal1.setProvider(factoryProvider.web3Net1);
    portal2.setProvider(factoryProvider.web3Net2);
    synthesis1.setProvider(factoryProvider.web3Net1);
    synthesis2.setProvider(factoryProvider.web3Net2);
    bridge1.setProvider(factoryProvider.web3Net1);
    bridge2.setProvider(factoryProvider.web3Net2);
    
    this.p1 = await portal1.at(envNet1.parsed.PORTAL_NETWORK1);
    this.p2 = await portal2.at(envNet2.parsed.PORTAL_NETWORK2);
    this.s1 = await portal1.at(envNet1.parsed.SYNTHESIS_NETWORK1);
    this.s2 = await portal2.at(envNet2.parsed.SYNTHESIS_NETWORK2);
    this.b1 = await bridge1.at(envNet1.parsed.BRIDGE_NETWORK1);
    this.b2 = await bridge2.at(envNet2.parsed.BRIDGE_NETWORK2);
    
    /** get users this way */
    this.owner1 = (await portal1.web3.eth.getAccounts())[0];
    this.owner2 = (await portal2.web3.eth.getAccounts())[0];

    /** that's who can invoke bridge */
    await b1.updateDexBind(this.p1.address, true, {from: owner1});
    await b1.updateDexBind(this.s1.address, true, {from: owner1});
    await b2.updateDexBind(this.p2.address, true, {from: owner2});
    await b2.updateDexBind(this.s2.address, true, {from: owner2});

    await s1.createRepresentation(realALP888, "sToken1", "Token1")
    await s2.createRepresentation(realALP888, "sToken2", "Token2")

    changeBridge(address _bridge)

    https://github.com/opengsn/gsn-with-web3/blob/master/test/test-with-truffle.js
    https://github.com/opengsn/gsn-paymasters/tree/master/contracts

    0. adjust web3
    1. create Token
    2. add in Uniswap/add eth on paymaster
    3. 
    4. call synthesizeWithPermit

    
    this.mp1 = null;
    this.mp2 = null;
    this.mp3 = null;
    this.chainIdNetwork1 = argv.typenet === 'teststand' ? await brigdePart1.web3.eth.net.getId() : 1111;
    this.chainIdNetwork2 = argv.typenet === 'teststand' ? await brigdePart2.web3.eth.net.getId() : 1112;
    
    if (envNet1.parsed.DEXPOOL_NETWORK1 == undefined  && envNet2.parsed.DEXPOOL_NETWORK2 == undefined
        // && envNet3.parsed.DEXPOOL_NETWORK3 == undefined
    ) {

      this.mp1 = await mockPool1.new(this.br1.address, {from: this.userNet1});
      this.mp2 = await mockPool2.new(this.br2.address, {from: this.userNet2});
      //this.mp3 = await mockPool3.new(this.br3.address, {from: this.userNet3});

      await this.br1.updateDexBind(this.mp1.address, true, {from: this.userNet1});
      await this.br2.updateDexBind(this.mp2.address, true, {from: this.userNet2});
      //await this.br3.updateDexBind(this.mp3.address, true, {from: this.userNet3});
      
    } else {
      this.mp1 = await mockPool1.at(envNet1.parsed.DEXPOOL_NETWORK1, {from: this.userNet1});
      this.mp2 = await mockPool2.at(envNet2.parsed.DEXPOOL_NETWORK2, {from: this.userNet2});
      //this.mp3 = await mockPool3.at(envNet3.parsed.DEXPOOL_NETWORK3, {from: this.userNet3});
    }

  });


  describe('simple end-to-end test', async () => {


    it('From network 1 to 2 without callback', async () => {

      let res = (await this.mp2.testData({from: this.userNet2})).toString();

      let testData = Math.floor((Math.random() * 100) + 1);
      /** send end-to-end request */
      let receipt = await this.mp1.sendRequestTestV2(testData, this.mp2.address, this.br2.address, this.chainIdNetwork2, {from: this.userNet1});
      await timeout(20000); // give 15 sec for execute on sencond blockchain
      res = (await this.mp2.testData({from: this.userNet2})).toString();

      assert.equal(res, testData, `Should be ${testData}`);

    });

    it('From network 2 to 1 without callback', async () => {

      let res = (await this.mp1.testData({from: this.userNet1})).toString();

      let testData = Math.floor((Math.random() * 100) + 1);
      /** send end-to-end request */
      let receipt = await this.mp2.sendRequestTestV2(testData, this.mp1.address, this.br1.address, this.chainIdNetwork1, {from: this.userNet2});
      await timeout(15000); // give 50 sec for execute on sencond blockchain
      res = (await this.mp1.testData({from: this.userNet1})).toString();

      assert.equal(res, testData, `Should be ${testData}`);

    });

    it.skip('From network 3 to 2 without callback', async () => {

      let res = (await this.mp2.testData({from: this.userNet2})).toString();

      let testData = Math.floor((Math.random() * 100) + 1);
      /** send end-to-end request */
      let receipt = await this.mp3.sendRequestTestV2(testData, this.mp2.address, this.br2.address, 1112, {from: this.userNet3});
      // console.log(receipt);
      await timeout(15000); // give 50 sec for execute on sencond blockchain
      res = (await this.mp2.testData({from: this.userNet2})).toString();

      assert.equal(res, testData, `Should be ${testData}`);

    });

    it('Negative test: From network 1 to 2. Untrusted dex on bridge1', async () => {

      this.mp1 = await mockPool1.new(this.br1.address, {from: this.userNet1});
      let res = (await this.mp2.testData({from: this.userNet2})).toString();

      let testData = Math.floor((Math.random() * 100) + 1);
      /** send end-to-end request */
      await expectRevert(
        this.mp1.sendRequestTestV2(testData, this.mp2.address, this.br2.address, this.chainIdNetwork2, {from: this.userNet1}),
        'UNTRUSTED DEX'
      );

    });

  });
