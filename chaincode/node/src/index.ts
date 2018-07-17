import shim = require('fabric-shim');
import { MyChaincode } from './MyChaincode';

// My Chaincode is moved to seperate file for testing

shim.start(new MyChaincode());
