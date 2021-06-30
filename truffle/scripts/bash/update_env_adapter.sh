#! /bin/bash

#echo "
#BRIDGE_${2:-\"null\"}=${3:-\"null\"}
#NODELIST_${2:-\"null\"}=${5:-\"null\"}
#DEXPOOL_${2:-\"null\"}=${6:-\"null\"}"  > $4

echo "
RPC_URL=${1:-\"null\"}
NETWORK_ID=${2:-\"null\"}
BRIDGE_ADDRESS=${3:-\"null\"}
NODELIST_ADDRESS=${4:-\"null\"}
DEXPOOL_ADDRESS=${5:-\"null\"}"  > $6
