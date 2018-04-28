# Hyperledger Fabric Network boilerplate
This repo is a snippet of the fabcar [fabric sample](https://github.com/hyperledger/fabric-samples) with the basic network. It also includes our [fabric-node-chaincode-utils](https://github.com/wearetheledger/fabric-node-chaincode-utils) to test and develop nodejs chaincode. It contains a fabric network with 1 peer and 1 CA.

## Starting 
Before starting, you will need to pull all the images of Hyperledger fabric to your desktop and tag them as latest. We included a script to do this. By default it will try to pull in `1.1.0` but you can pull a custom version by adding the version as a parameter.
```bash
./scripts/fabric-preload.sh <optional_custom_version>
```
Starting this network requires you to run following command. This will automatically setup your docker network using docker-compose and install your chaincode.
```bash
./startFabric.sh
```

## Writing chaincode
For writing chaincode we're using our package [fabric-node-chaincode-utils](https://github.com/wearetheledger/fabric-node-chaincode-utils), which makes writing chaincode much faster and easier.
## Testing
For testing we're using our package [fabric-mock-stub](https://github.com/wearetheledger/fabric-mock-stub) in wich we wrote a mock chaincode stub for imitating the way the actual stub handles the interaction with Hyperledger Fabric.
