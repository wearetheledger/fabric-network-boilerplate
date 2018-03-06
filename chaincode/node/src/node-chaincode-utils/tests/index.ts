import { ChaincodeMockStub } from '../src/mocking/ChaincodeMockStub';
import { TestChaincode } from './TestChaincode';
import { ChaincodeReponse } from 'fabric-shim';
import { Transform } from '../src/utils/datatransform';

import { expect } from 'chai';

describe('Test Mockstub', () => {
    it('Test init', async () => {

        const chaincode = new TestChaincode();
        const stub = new ChaincodeMockStub('mock', chaincode);

        const args = ['arg1', 'arg2'];

        const response: ChaincodeReponse = await stub.mockInit('uudif', args);

        expect(Transform.bufferToObject(response.payload)['args']).to.deep.equal(args);
    });
});