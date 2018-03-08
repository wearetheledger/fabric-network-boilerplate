import shim = require('fabric-shim');
import { Stub } from 'fabric-shim';
import { Chaincode, Helpers, TransactionHelper } from '@theledger/fabric-chaincode-utils';

export class MyChaincode extends Chaincode {

    async queryCar(stub: Stub, txHelper: TransactionHelper, args: string[]) {

        Helpers.checkArgs(args, 1);

        let carNumber = args[0];

        let carAsBytes: any = await stub.getState(carNumber); //get the car from chaincode state
        if (!carAsBytes || carAsBytes.toString().length <= 0) {
            throw new Error(carNumber + ' does not exist: ');
        }
        Helpers.log(carAsBytes.toString());
        return carAsBytes;
    }

    async initLedger(stub: Stub, txHelper: TransactionHelper, args: string[]) {

        Helpers.log('============= START : Initialize Ledger ===========');

        let cars = [{
            make: 'Toyota',
            model: 'Prius',
            color: 'blue',
            owner: 'Tomoko'
        }, {
            make: 'Ford',
            model: 'Mustang',
            color: 'red',
            owner: 'Brad'
        }, {
            make: 'Hyundai',
            model: 'Tucson',
            color: 'green',
            owner: 'Jin Soo'
        }, {
            make: 'Volkswagen',
            model: 'Passat',
            color: 'yellow',
            owner: 'Max'
        }, {
            make: 'Tesla',
            model: 'S',
            color: 'black',
            owner: 'Adriana'
        }, {
            make: 'Peugeot',
            model: '205',
            color: 'purple',
            owner: 'Michel'
        }, {
            make: 'Chery',
            model: 'S22L',
            color: 'white',
            owner: 'Aarav'
        }, {
            make: 'Fiat',
            model: 'Punto',
            color: 'violet',
            owner: 'Pari'
        }, {
            make: 'Tata',
            model: 'Nano',
            color: 'indigo',
            owner: 'Valeria'
        }, {
            make: 'Holden',
            model: 'Barina',
            color: 'brown',
            owner: 'Shotaro'
        }];

        for (let i = 0; i < cars.length; i++) {
            const car: any = cars[i];

            car.docType = 'car';
            await stub.putState('CAR' + i, Buffer.from(JSON.stringify(car)));
            Helpers.log('Added <--> ', car);
        }

        Helpers.log('============= END : Initialize Ledger ===========');
    }

    async createCar(stub: Stub, txHelper: TransactionHelper, args: string[]) {
        Helpers.log('============= START : Create Car ===========');

        Helpers.checkArgs(args, 5);

        let cid = new shim.ClientIdentity(stub);

        Helpers.log(cid.getAttributeValue('email'));

        Helpers.log(cid.getAttributeValue('username'));

        let car = {
            docType: 'car',
            make: args[1],
            model: args[2],
            color: args[3],
            owner: args[4]
        };

        await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
        Helpers.log('============= END : Create Car ===========');
    }

    async queryAllCars(stub: Stub, txHelper: TransactionHelper, args: string[]) {

        let startKey = 'CAR0';
        let endKey = 'CAR999';

        let iterator = await stub.getStateByRange(startKey, endKey);

        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes: any = {};
                Helpers.log(res.value.value.toString('utf8'));

                jsonRes.Key = res.value.key;
                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    Helpers.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                Helpers.log('end of data');
                await iterator.close();
                Helpers.log(allResults.toString());
                return Buffer.from(JSON.stringify(allResults));
            }
        }
    }

    async changeCarOwner(stub: Stub, txHelper: TransactionHelper, args: string[]) {
        Helpers.log('============= START : changeCarOwner ===========');

        Helpers.checkArgs(args, 2);

        let carAsBytes = await stub.getState(args[0]);
        let car = JSON.parse(carAsBytes.toString());
        car.owner = args[1];

        await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
        Helpers.log('============= END : changeCarOwner ===========');
    }
}