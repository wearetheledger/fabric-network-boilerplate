import { TestHelper, ChainMethod } from './helper';
import { MyChaincode } from '../MyChaincode';

const chaincode = new MyChaincode();

const chainMethods: ChainMethod[] = [
    {
        itShouldInvoke: `Should be able to init `,
        invoke: {
            fcn: `initLedger`,
            args: []
        },
        itShouldQuery: `Should be able to query all cars`,
        query: {
            fcn: `queryAllCars`,
            args: [],
            expected: [{
                Key: 'CAR0',
                Record:
                    {
                        make: 'Toyota',
                        model: 'Prius',
                        color: 'blue',
                        owner: 'Tomoko',
                        docType: 'car'
                    }
            },
            {
                Key: 'CAR1',
                Record:
                    {
                        make: 'Ford',
                        model: 'Mustang',
                        color: 'red',
                        owner: 'Brad',
                        docType: 'car'
                    }
            },
            {
                Key: 'CAR2',
                Record:
                    {
                        make: 'Hyundai',
                        model: 'Tucson',
                        color: 'green',
                        owner: 'Jin Soo',
                        docType: 'car'
                    }
            },
            {
                Key: 'CAR3',
                Record:
                    {
                        make: 'Volkswagen',
                        model: 'Passat',
                        color: 'yellow',
                        owner: 'Max',
                        docType: 'car'
                    }
            },
            {
                Key: 'CAR4',
                Record:
                    {
                        make: 'Tesla',
                        model: 'S',
                        color: 'black',
                        owner: 'Adriana',
                        docType: 'car'
                    }
            },
            {
                Key: 'CAR5',
                Record:
                    {
                        make: 'Peugeot',
                        model: '205',
                        color: 'purple',
                        owner: 'Michel',
                        docType: 'car'
                    }
            },
            {
                Key: 'CAR6',
                Record:
                    {
                        make: 'Chery',
                        model: 'S22L',
                        color: 'white',
                        owner: 'Aarav',
                        docType: 'car'
                    }
            },
            {
                Key: 'CAR7',
                Record:
                    {
                        make: 'Fiat',
                        model: 'Punto',
                        color: 'violet',
                        owner: 'Pari',
                        docType: 'car'
                    }
            },
            {
                Key: 'CAR8',
                Record:
                    {
                        make: 'Tata',
                        model: 'Nano',
                        color: 'indigo',
                        owner: 'Valeria',
                        docType: 'car'
                    }
            },
            {
                Key: 'CAR9',
                Record:
                    {
                        make: 'Holden',
                        model: 'Barina',
                        color: 'brown',
                        owner: 'Shotaro',
                        docType: 'car'
                    }
            }]
        },
    },
    {
        itShouldInvoke: `Should be able to add a car`,
        invoke: {
            fcn: `createCar`,
            args: [`CAR0`, `prop1`, `prop2`, `prop3`, `owner`]
        },
        itShouldQuery: `Should be able to query a car`,
        query: {
            fcn: `queryCar`,
            args: [`CAR0`],
            expected: {
                'make': 'prop1',
                'model': 'prop2',
                'color': 'prop3',
                'owner': 'owner',
                'docType': 'car'
            }
        },
    },
    {
        itShouldInvoke: `Should be able to change a car owner`,
        invoke: {
            fcn: `changeCarOwner`,
            args: [`CAR0`, `owner2`]
        },
        itShouldQuery: `Should be able to query the changed car object`,
        query: {
            fcn: `queryCar`, args: [`CAR0`],
            expected: {
                'make': 'prop1',
                'model': 'prop2',
                'color': 'prop3',
                'owner': 'owner2',
                'docType': 'car'
            }
        },
    },
    // etc...
];

TestHelper.runTests(chaincode, chainMethods);