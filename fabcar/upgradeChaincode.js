/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
import { init, query } from './hlfClient';


var semver = require('semver');
// Install chaincode on target peers

logger.debug('==================== INSTALL CHAINCODE ==================');
var peers = ['peer0.org1.example.com'];

var chaincodeName = 'mycc';
var chaincodePath = 'github.com/example_cc/go';
var chaincodeType = 'golang';


init('mychannel', `grpc://localhost:7051`, `grpc://localhost:7050`, path.resolve(__dirname, '..', 'config', `creds`))
    .then(() => {
        return query('getVersion', 'fabcar');
    })
    .then(version => {

    });

query.queryChaincode('peer0.org1.example.com', 'mychannel', 'mycc', [], 'getVersion', 'jsmith', 'Org1')
    .then(version => {
        console.log(version.toString().replace('v', ''));
        const chaincodeVersion = `v${semver.inc(version.toString().replace('v', ''), 'patch')}`;

        console.log(`Installing version ${chaincodeVersion}`);

        Promise.all([
            install.installChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, 'jsmith', 'Org1'),
            install.installChaincode(peers2, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, 'Barry', 'Org2')
        ])
            .then(() => {
                console.log('UPGRADE');

                return install.upgradeChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, 'jsmith', 'Org1');
            }).then(() => {
            console.log('DONE');

        });
    });

