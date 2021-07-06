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

const testUniswap1 = artifacts.require('TestUniswap');
const testUniswap2 = artifacts.require('TestUniswap');

const testToken1  = artifacts.require('TestToken');
const testToken2  = artifacts.require('TestToken');




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
    testToken1.setProvider(factoryProvider.web3Net1);
    testToken2.setProvider(factoryProvider.web3Net2);
    testUniswap1.setProvider(factoryProvider.web3Net1);
    testUniswap2.setProvider(factoryProvider.web3Net2);

    this.p1 = await portal1.at(envNet1.parsed.PORTAL_NETWORK1);
    this.p2 = await portal2.at(envNet2.parsed.PORTAL_NETWORK2);
    this.s1 = await synthesis1.at(envNet1.parsed.SYNTHESIS_NETWORK1);
    this.s2 = await synthesis2.at(envNet2.parsed.SYNTHESIS_NETWORK2);
    this.b1 = await bridge1.at(envNet1.parsed.BRIDGE_NETWORK1);
    this.b2 = await bridge2.at(envNet2.parsed.BRIDGE_NETWORK2);

    /** get users in each network  */
    this.owner1 = (await portal1.web3.eth.getAccounts())[0];
    this.owner2 = (await portal2.web3.eth.getAccounts())[0];

    /** that's who can invoke bridge */
    await this.b1.updateDexBind(this.p1.address, true, {from: this.owner1});
    await this.b1.updateDexBind(this.s1.address, true, {from: this.owner1});
    await this.b2.updateDexBind(this.p2.address, true, {from: this.owner2});
    await this.b2.updateDexBind(this.s2.address, true, {from: this.owner2});

    // create mock uniswap
    this.uni1 = await testUniswap1.new(2, 1, '0x0000000000000000000000000000000000000000', { value: await portal1.web3.utils.toWei('0.2','ether'), from: this.owner1 });
    this.uni2 = await testUniswap2.new(2, 1, '0x0000000000000000000000000000000000000000', { value: await portal2.web3.utils.toWei('0.2','ether'), from: this.owner2 });

   // filling it
   this.tT1 = await testToken1.new('Token1','TK1', {from: this.owner1});
              await this.uni1.pu(this.tT1.address, {from: this.owner1});
   this.tT2 = await testToken2.new('Token2','TK2', {from: this.owner2});
              await this.uni2.pu(this.tT2.address, {from: this.owner2});
    //
    await this.s2.createRepresentation(this.tT1.address, "sToken1", "sTK1", {from: this.owner2});
    await this.s1.createRepresentation(this.tT2.address, "sToken2", "sTK2", {from: this.owner1});



  });


  describe('simple end-to-end test', async () => {

       it.skip('From network 1 to 2 without callback', async () => {


       });


    });
  });
