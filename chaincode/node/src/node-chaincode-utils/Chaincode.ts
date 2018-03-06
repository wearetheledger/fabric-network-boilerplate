import shim = require('fabric-shim');
import { ChaincodeInterface, Stub } from 'fabric-shim';
import { Log } from './utils/logger';
import { LoggerInstance } from 'winston';
import { ERRORS } from './constants/errors';
import { ChaincodeError } from './ChaincodeError';
import { TransactionHelper } from './ChaincodeStub';
import { Transform } from './utils/datatransform';

export class Chaincode implements ChaincodeInterface {

    private logger: LoggerInstance;

    constructor() {
        this.logger = Log.debug(this.name);
    }

    /**
     * @return the name of the current chaincode.
     */
    get name() {

        return this.constructor.name;
    }

    /**
     * @return the transaction helper for the given stub. This can be used to extend
     * the Default TransactionHelper with extra functionality and return your own instance.
     */
    getTransactionHelperFor(stub: Stub) {

        return new TransactionHelper(stub);
    }

    // The Init method is called when the Smart Contract is instantiated by the blockchain network
    // Best practice is to have any Ledger initialization in separate function -- see initLedger()

    async Init(stub: Stub) {
        this.logger.info(`=========== Instantiated ${this.name} chaincode ===========`);

        return shim.success();
    }

    // The Invoke method is called as a result of an application request to run the Smart Contract.
    // The calling application program has also specified the particular smart contract
    // function to be called, with arguments

    async Invoke(stub: Stub) {

        this.logger.info(`=========== Invoked Chaincode ${this.name} ===========`);
        this.logger.info(`Transaction ID: ${stub.getTxID()}`);
        this.logger.info(`Args: ${stub.getArgs().join(',')}`);

        let ret = stub.getFunctionAndParameters();

        let method = this[ret.fcn];

        if (!method) {
            this.logger.error(`no function of name: ${ret.fcn} found`);

            throw new ChaincodeError(ERRORS.UNKNOWN_FUNCTION_ERROR, {
                'function': ret.fcn
            });
        }

        let parsedParameters;

        try {
            parsedParameters = this.parseParameters(ret.params);
        } catch (err) {
            throw new ChaincodeError(ERRORS.PARSING_PARAMETERS_ERROR, {
                'message': err.message
            });
        }

        try {

            let payload = await method.call(this, stub, this.getTransactionHelperFor(stub), parsedParameters);

            if (payload && !Buffer.isBuffer(payload)) {
                payload = Buffer.from(JSON.stringify(Transform.normalizePayload(payload)));
            }

            return shim.success(payload);

        } catch (err) {
            let error = err;

            const stacktrace = err.stack;

            if (!(err instanceof ChaincodeError)) {
                error = new ChaincodeError(ERRORS.UNKNOWN_ERROR, {
                    'message': err.message
                });
            }
            this.logger.error(stacktrace);
            this.logger.error(`Data of error ${err.message}: ${JSON.stringify(err.data)}`);

            return shim.error(error.serialized);
        }
    }

    /**
     * @param {Array} params
     * @returns the parsed parameters
     */
    private parseParameters(params: string[]): any[] {
        const parsedParams: any[] = [];

        params.forEach((param) => {
            try {
                // try to parse ...
                parsedParams.push(JSON.parse(param));
            } catch (err) {
                // if it fails fall back to original param
                this.logger.error(`failed to parse param ${param}`);
                parsedParams.push(param);
            }
        });

        return parsedParams;
    }
}