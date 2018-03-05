import * as shim from "fabric-shim";
import { ChaincodeInterface, Stub } from "fabric-shim";

class CC implements ChaincodeInterface {
    Init(stub: shim.Stub): void {
        throw new Error("Method not implemented.");
    }

    Invoke(stub: shim.Stub): void {
        throw new Error("Method not implemented.");
    }

}

shim.error();

shim.success();

shim.start(new CC());