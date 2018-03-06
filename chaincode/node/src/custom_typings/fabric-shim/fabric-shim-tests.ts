import * as shim from 'fabric-shim';
import { ChaincodeInterface, ChaincodeReponse, Stub } from 'fabric-shim';

class CC implements ChaincodeInterface {
    Init(stub: Stub): Promise<ChaincodeReponse> {
        throw new Error('Not implemented');
    }

    Invoke(stub: Stub): Promise<ChaincodeReponse> {
        throw new Error('Not implemented');
    }
}

shim.error();

shim.success();

shim.start(new CC());