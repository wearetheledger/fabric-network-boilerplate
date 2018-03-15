# Hyperledger Fabric Network boilerplate
This repo is a snippet of the fabcar [fabric sample](https://github.com/hyperledger/fabric-samples) with the basic network. It also includes our [fabric-node-chaincode-utils](https://github.com/wearetheledger/fabric-node-chaincode-utils) to test and develop nodejs chaincode. It contains a fabric network with 1 peer and 1 CA.

## Starting 
Starting this network requires you to run following command. This will automatically setup your docker network using docker-compose and install your chaincode.
```bash
./scripts/fabric-preload.sh
./startFabric.sh
```

## Testing
For testing we're using our package [fabric-node-chaincode-utils](https://github.com/wearetheledger/fabric-node-chaincode-utils) in wich we write a mock chaincode stub for imitating the way the actual stub handles the interaction with Hyperledger Fabric.
