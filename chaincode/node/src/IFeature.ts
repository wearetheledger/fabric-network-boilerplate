import { Chaincode } from '@theledger/fabric-chaincode-utils';

export class IFeature {
    private chaincode: Chaincode;

    constructor(chaincode: Chaincode) {
        this.chaincode = chaincode;

        for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            let method = this[name];
            // Supposedly you'd like to skip constructor
            if (!(method instanceof Function) || name.startsWith('__') || name === 'constructor') {
                continue;
            }

            chaincode[name] = method;
        }
    }
}