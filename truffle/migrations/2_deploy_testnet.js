const argv = require('minimist')(process.argv.slice(2), {string: ['gasless' ]});
const { exec } = require('child_process');
const { deployGasless } = require('../utils/helper');


const NodeList                          = artifacts.require('NodeList');
const Bridge                            = artifacts.require('Bridge');
const MockDexPool                       = artifacts.require('MockDexPool');


const Portal                            = artifacts.require('Portal');
const Synthesis                         = artifacts.require('Synthesis');


module.exports = async (deployer, network, accounts) => {

  let _network  = null;
  if (network === 'rinkeby') {_network = 'network1'; }
  if (network === 'bsctestnet') {_network = 'network2'; }

const forwarder = network === 'rinkeby' ? "0x83A54884bE4657706785D7309cf46B58FE5f6e8a"  : network === 'bsctestnet' ? '0xeB230bF62267E94e657b5cbE74bdcea78EB3a5AB' : undefined  // it is real openGSN trustedForwarder

if(network === 'rinkeby' || network === 'bsctestnet'){
     try {

              const [owner, anotherAccount] = accounts;


                                        await deployer.deploy(NodeList, { from: owner });
              let nodeList            = await NodeList.deployed();

                                        await deployer.deploy(Bridge, nodeList.address, { from: owner });
              let bridge              = await Bridge.deployed();

                                        await deployer.deploy(MockDexPool, bridge.address, { from: owner });
              let mockDexPool         = await MockDexPool.deployed();
                                        await bridge.updateDexBind(mockDexPool.address, true, {from: owner});



                                        await deployer.deploy(Portal, bridge.address, forwarder, { from: owner });
              let portal              = await Portal.deployed();
                                        await bridge.updateDexBind(portal.address, true, {from: owner});

                                        await deployer.deploy(Synthesis, bridge.address, forwarder, { from: owner });
              let synthesis           = await Synthesis.deployed();
                                        await bridge.updateDexBind(synthesis.address, true, {from: owner});

					//await synthesis.createRepresentation(realALP888, "sALP888", "sALP888")


              let env_file = `env_connect_to_${_network}.env`;
              exec(`${process.cwd()}/scripts/bash/update_env_adapter.sh 8081 ${_network.toUpperCase()} ${bridge.address} ${env_file} ${nodeList.address}  ${mockDexPool.address} ${portal.address} ${synthesis.address}`, { maxBuffer: 1024 * 100000000 }, (err, stdout, stderr) => {
                if (err) {
                    console.log('THROW ERROR', err);
                    return;
                }
              });

            } catch (err) {
              console.error(err)
            }
  }
}
