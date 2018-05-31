#!/usr/bin/env bash

echo "Note: This is only supported for nodejs chaincode"

starttime=$(date +%s)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR
cd ../chaincode/node
npm version minor
yarn run clean
yarn run build

      if [ $? -eq 1 ]; then
        exit 1
    fi
CHAINCODE_VERSION=$(node $DIR/include/getVersion.js)
echo $CHAINCODE_VERSION
CHAINCODE_NAME=fabcar
CC_SRC_PATH=/opt/gopath/src/github.com/fabcar/node
LANGUAGE=node

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n "$CHAINCODE_NAME" -v "$CHAINCODE_VERSION" -p "$CC_SRC_PATH" -l "$LANGUAGE"
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode upgrade -o orderer.example.com:7050 -C mychannel -n "$CHAINCODE_NAME" -l "$LANGUAGE" -v "$CHAINCODE_VERSION" -c '{"function":"init","Args":["'$CHAINCODE_VERSION'"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

printf "\nUpgrade chaincode execution time : $(($(date +%s) - starttime)) secs ...\n\n\n"

echo "dev-peer0.org1.example.com-$CHAINCODE_NAME-$CHAINCODE_VERSION"

docker logs dev-peer0.org1.example.com-$CHAINCODE_NAME-$CHAINCODE_VERSION -f