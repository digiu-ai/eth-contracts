#!/usr/bin/env bash

export TESTNET_BSC=187994e6d93bb29e386fe7ab50232a6a2bea5d6f61046b803b9e9b8306b7d268
export TESTNET_RINKEBY=3fdb56439eb7c05074586993925c6e06103a5b770b46aa29e399cc693d44ddf7
export TESTNET_MUMBAI=d9a6a69861996d014ad6cf315a0d0c6a5dedaeb77126d2d230e09e5633e8544d


npx truffle migrate --reset --network rinkeby
npx truffle migrate --reset --network bsctestnet
npx truffle migrate --reset --network mumbai
