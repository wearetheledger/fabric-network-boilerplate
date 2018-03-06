import { ChaincodeMockStub } from '../src/mocking/ChaincodeMockStub';
import { TestChaincode } from './TestChaincode';
import { ChaincodeReponse } from 'fabric-shim';
import { Transform } from '../src/utils/datatransform';

import { expect } from 'chai';
import { TransactionHelper } from '../src/ChaincodeStub';

const chaincode = new TestChaincode();

describe('Test Mockstub', () => {
    it('Should be able to init', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const args = ['arg1', 'arg2'];

        const response: ChaincodeReponse = await stub.mockInit('uudif', args);

        expect(Transform.bufferToObject(response.payload)['args']).to.deep.equal(args);
    });

    const stubWithInit = new ChaincodeMockStub('mock', chaincode);

    it('Should be able to init and make some cars', async () => {

        const args = ['init', 'arg2'];

        await stubWithInit.mockInit('uudif', args);

        expect(Object.keys(stubWithInit.state).length).to.equal(10);
    });

    it('Test querying', async () => {

        const car0 = {
            'make': 'Toyota',
            'model': 'Prius',
            'color': 'blue',
            'owner': 'Tomoko',
            'docType': 'car'
        };

        const response: ChaincodeReponse = await chaincode.queryCar(stubWithInit, new TransactionHelper(stubWithInit), ['CAR0']);

        expect(Transform.bufferToObject(response.payload)).to.deep.equal(car0);
    });

    it('Test invoke', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const response: ChaincodeReponse = await stub.mockInvoke('test', ['createCar', 'CAR0', 'prop1', 'prop2', 'prop3', 'test']);

        expect(response.status).to.eq(200);

        expect(Object.keys(stub.state).length).to.equal(1);
    });
});