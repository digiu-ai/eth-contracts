#!/usr/bin/env bash

npx truffle migrate --reset --network rinkeby --bridge 0xa615d60b9D6F080cD47BbB529D088B8c70d8fbd8 --nodelist 0xa615d60b9D6F080cD47BbB529D088B8c70d8fbd8 --mockdexpool 0xa615d60b9D6F080cD47BbB529D088B8c70d8fbd8
npx truffle migrate --reset --network bsctestnet
