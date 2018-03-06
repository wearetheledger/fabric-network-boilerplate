import shim = require('fabric-shim');
import { ChaincodeReponse, Stub } from 'fabric-shim';
import { Chaincode } from '../src/Chaincode';
import { TransactionHelper } from '../src/ChaincodeStub';
import { Transform } from '../src/utils/datatransform';

export class TestChaincode extends Chaincode {

    async Init(stub: Stub): Promise<ChaincodeReponse> {

        const args = stub.getArgs();

        if (args[0] == 'init') {
            await this.initLedger(stub, new TransactionHelper(stub));
        }

        return shim.success(Transform.serialize({
            args: stub.getArgs()
        }));
    }

    async queryCar(stub: Stub, txHelper: TransactionHelper, args: string[]) {

        let carNumber = args[0];

        let carAsBytes: any = await stub.getState(carNumber); //get the car from chaincode state

        if (!carAsBytes || carAsBytes.toString().length <= 0) {
            throw new Error(carNumber + ' does not exist: ');
        }

        return shim.success(carAsBytes);
    }

    async initLedger(stub: Stub, txHelper: TransactionHelper, args?: string[]) {
        console.info('============= START : Initialize Ledger ===========');
        let cars = [];
        cars.push({
            make: 'Toyota',
            model: 'Prius',
            color: 'blue',
            owner: 'Tomoko'
        });
        cars.push({
            make: 'Ford',
            model: 'Mustang',
            color: 'red',
            owner: 'Brad'
        });
        cars.push({
            make: 'Hyundai',
            model: 'Tucson',
            color: 'green',
            owner: 'Jin Soo'
        });
        cars.push({
            make: 'Volkswagen',
            model: 'Passat',
            color: 'yellow',
            owner: 'Max'
        });
        cars.push({
            make: 'Tesla',
            model: 'S',
            color: 'black',
            owner: 'Adriana'
        });
        cars.push({
            make: 'Peugeot',
            model: '205',
            color: 'purple',
            owner: 'Michel'
        });
        cars.push({
            make: 'Chery',
            model: 'S22L',
            color: 'white',
            owner: 'Aarav'
        });
        cars.push({
            make: 'Fiat',
            model: 'Punto',
            color: 'violet',
            owner: 'Pari'
        });
        cars.push({
            make: 'Tata',
            model: 'Nano',
            color: 'indigo',
            owner: 'Valeria'
        });
        cars.push({
            make: 'Holden',
            model: 'Barina',
            color: 'brown',
            owner: 'Shotaro'
        });

        for (let i = 0; i < cars.length; i++) {
            const car: any = cars[i];

            car.docType = 'car';
            await stub.putState('CAR' + i, Buffer.from(JSON.stringify(car)));
            console.info('Added <--> ', car);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async createCar(stub: Stub, txHelper: TransactionHelper, args: string[]) {
        console.info('============= START : Create Car ===========');
        if (args.length != 5) {
            throw new Error('Incorrect number of arguments. Expecting 5');
        }

        let cid = new shim.ClientIdentity(stub);

        console.log(cid.getAttributeValue('email'));

        console.log(cid.getAttributeValue('username'));

        let car = {
            docType: 'car',
            make: args[1],
            model: args[2],
            color: args[3],
            owner: args[4]
        };

        await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');

        return shim.success();
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
                console.log(res.value.value.toString('utf8'));

                jsonRes.Key = res.value.key;
                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return shim.success(Buffer.from(JSON.stringify(allResults)));
            }
        }
    }

    async changeCarOwner(stub: Stub, txHelper: TransactionHelper, args: string[]) {
        console.info('============= START : changeCarOwner ===========');
        if (args.length != 2) {
            throw new Error('Incorrect number of arguments. Expecting 2');
        }

        let carAsBytes = await stub.getState(args[0]);
        let car = JSON.parse(carAsBytes.toString());
        car.owner = args[1];

        await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
        shim.success();
    }
}