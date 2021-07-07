"use strict";

const { exec } = require('child_process');

async function migrateLocalnetwork(deployer, network, accounts) {

    console.log(process.cwd())
    const NodeList = artifacts.require('NodeList');
    const Bridge = artifacts.require('Bridge');
    const MockDexPool = artifacts.require('MockDexPool');


    const [proxyAdminOwner, newAdmin, anotherAccount] = accounts;
    await deployer.deploy(NodeList, {from: proxyAdminOwner});
    let nodeList = await NodeList.deployed();
    console.log(nodeList.address)

    await deployer.deploy(Bridge, nodeList.address, {from: proxyAdminOwner});
    let bridge = await Bridge.deployed();
    console.log("bridge.address ", bridge.address)

    await deployer.deploy(MockDexPool, bridge.address,  { from: proxyAdminOwner });
    let dexpool = await MockDexPool.deployed();
    console.log("MockDexPool.address ", dexpool.address)

    await bridge.updateDexBind(dexpool.address, true);

    let env_file = "env_connect_to_" + network + ".env";
    let n = network.toUpperCase();
    exec(`${process.cwd()}/scripts/bash/update_env_adapter.sh create ${env_file} BRIDGE_${n}=${bridge.address}      NODELIST_${n}=${nodeList.address} DEXPOOL_${n}=${dexpool.address}`
        , {maxBuffer: 1024 * 100000000}, (err, stdout, stderr) => {
        });



}

module.exports = {
    migrateLocalnetwork
};
