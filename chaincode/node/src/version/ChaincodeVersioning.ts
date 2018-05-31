import { IFeature } from '../IFeature';
import { StubHelper } from '@theledger/fabric-chaincode-utils';

const VERSION_KEY = 'version';

export class ChaincodeVersioning extends IFeature {

    init(stubHelper: StubHelper, args: string[]) {

        const version = args[0];

        return stubHelper.putState(VERSION_KEY, version);

    }

    getVersion(stubHelper: StubHelper, args: string[]) {
        return stubHelper.getStateAsString(VERSION_KEY);
    }

}