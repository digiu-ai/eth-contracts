const { exec } = require('child_process');
const TestToken    = artifacts.require('TestToken');

module.exports = async callback => {
try{

  const accounts = await web3.eth.getAccounts();

  let _network  = null;
  if (process.argv[5] === 'rinkeby')     _network = 'network1';
  if (process.argv[5] === 'bsctestnet')  _network = 'network2';

  this.testToken = await TestToken.new({from: accounts[0]})
  console.log('this.testToken: ', this.testToken.address)


        let env_file = `env_connect_to_${_network}.env`;
        let n = _network.toUpperCase();
        exec(`${process.cwd()}/scripts/bash/update_env_adapter.sh update ${env_file} TOKEN_${n}=${this.testToken.address}`, { maxBuffer: 1024 * 100000000 }, (err, stdout, stderr) => {
          if (err) {
              console.log('THROW ERROR', err);
              return;
          }
        });	

  
}catch(e){console.log(e);}
  callback();
}

//npx truffle exec './scripts/init/0_setSecondPool.js' --newtwork newtwork1--wallet_node "0x6786D7A5d7f1898220503aa35527250B275dBBE9" --pubkey_node "0x194e868506502e5ecae3e5b623801548125a748e6b2da15681312a7cf0283acc" --p2p_address "/ip4/127.0.0.1/tcp/6666/p2p/QmbDd2omyRkTipjw6jTjrHYKp2pPhKp15SNZ2azqvvp1i7" --enable "true"