import shim = require('fabric-shim');
import { MyChaincode } from './MyChaincode';
import { ChaincodeVersioning } from './version/ChaincodeVersioning';

// TODO maybe we can do some setup stuff here
// My Chaincode is moved to seperate file for testing
const myChaincode = new MyChaincode();

const plugins = [
    ChaincodeVersioning
];

plugins.forEach(plugin => new plugin(myChaincode));

shim.start(myChaincode);
