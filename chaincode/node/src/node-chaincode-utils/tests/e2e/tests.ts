import { TestHelper, ChainMethod } from './helper';
import { Chaincode } from '../../src/Chaincode';

const chaincode = new Chaincode();

const initObject = { fcn: ``, args: [`arg1`, `arg2`] };

const chainMethods: ChainMethod[] = [
    {
        itShouldInvoke: `Should be able to add a car`,
        invoke: {
            fcn: `createCar`,
            args: [`CAR0`, `prop1`, `prop2`, `prop3`, `test`]
        },
        itShouldQuery: `Should be able to query a car`,
        query: {
            fcn: `queryCar`,
            args: [`CAR0`],
            expected: {
                'make': 'prop1',
                'model': 'prop2',
                'color': 'prop3',
                'owner': 'test',
                'docType': 'car'
            }
        },
    },
    {
        itShouldInvoke: ``,
        invoke: { fcn: ``, args: [`arg1`, `arg2`] },
        itShouldQuery: ``,
        query: { fcn: ``, args: [`arg1`, `arg2`], expected: {} },
    },
    // etc...
];

TestHelper.runTests(chaincode, initObject, chainMethods);