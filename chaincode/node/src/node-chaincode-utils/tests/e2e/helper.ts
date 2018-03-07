/* tslint:disable */
import { ChaincodeReponse } from 'fabric-shim';
import { expect } from 'chai';
import { ChaincodeMockStub } from '../../src/mocking/ChaincodeMockStub';
import { Transform } from '../../src/utils/datatransform';

process.setMaxListeners(0);

export interface InvokeObject {
    fcn: string;
    args: string[];
}

export interface QueryObject {
    fcn: string;
    args: string[];
    expected: any;
}

export interface ChainMethod {
    itShouldInvoke: string;
    invoke: InvokeObject;
    itShouldQuery: string;
    query: QueryObject;
}

export class TestHelper {

    static runTests(chainCode: any, init: InvokeObject, chainMethods: ChainMethod[]) {

        const stub: ChaincodeMockStub = new ChaincodeMockStub('mock', chainCode);

        describe('Start Mockstub', () => {
            it('Should be able to init', async () => {
                const response: ChaincodeReponse = await stub.mockInit(init.fcn, init.args);
                expect(Transform.bufferToObject(response.payload)['args']).to.deep.equal(init.args);
            });
        })

        describe('Test ChainMethods', () => {
            chainMethods.forEach(chainMethod => {
                it(chainMethod.itShouldInvoke, async () => {
                    this.invoke(stub, chainMethod.invoke);
                });
                it(chainMethod.itShouldQuery, async () => {
                    this.query(stub, chainMethod.query);
                });
            })
        });
    }

    static async invoke(stub: ChaincodeMockStub, invokeObject: InvokeObject) {
        const response: ChaincodeReponse = await stub.mockInvoke('test', [invokeObject.fcn].concat(invokeObject.args));
        expect(response.status).to.eq(200);
    }


    static async query(stub: ChaincodeMockStub, queryObject: QueryObject) {
        const response: ChaincodeReponse = await stub.mockInvoke('test', [queryObject.fcn].concat(queryObject.args));
        expect(Transform.bufferToObject(response.payload)['args']).to.deep.equal(queryObject.expected);
    }

}