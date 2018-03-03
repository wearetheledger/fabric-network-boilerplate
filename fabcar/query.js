'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode query
 */

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');

//
var fabric_client = new Fabric_Client();

// setup the fabric network
var channel = fabric_client.newChannel('mychannel');
var peer = fabric_client.newPeer('grpc://localhost:7051');
channel.addPeer(peer);

//
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:' + store_path);
var tx_id = null;

export function queryVersion() {
    // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    return fabric_client.getUserContext('admin', true)
        .then((user_from_store) => {
            if (user_from_store && user_from_store.isEnrolled()) {
                console.log('Successfully loaded user1 from persistence');
                member_user = user_from_store;
            } else {
                throw new Error('Failed to get admin');
            }

            // queryCar chaincode function - requires 1 argument, ex: args: ['CAR4'],
            // queryAllCars chaincode function - requires no arguments , ex: args: [''],
            const request = {
                //targets : --- letting this default to the peers assigned to the channel
                chaincodeId: 'fabcar',
                fcn: 'getVersion',
                args: ['']
            };

            // send the query proposal to the peer
            return channel.queryByChaincode(request);
        }).then((query_responses) => {
            console.log('Query has completed, checking results');
            // query_responses could have more than one  results if there multiple peers were used as targets
            if (query_responses && query_responses.length === 1) {
                if (query_responses[0] instanceof Error) {
                    console.error('error from query = ', query_responses[0]);
                } else {
                    console.log('Response is ', query_responses[0].toString());
                }
            } else {
                console.log('No payloads were returned from query');
            }
        }).catch((err) => {
            console.error('Failed to query successfully :: ' + err);
        });
}
