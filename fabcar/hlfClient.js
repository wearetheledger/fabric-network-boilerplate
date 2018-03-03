import FabricClient from 'fabric-client';

let client = new FabricClient(), channel;
const targets = [];


export function init(walletPath, channelId, networkUrl, ordererUrl) {
    console.log('Store path:' + walletPath);

    return FabricClient
        .newDefaultKeyValueStore({
            path: walletPath
        })
        .then((wallet) => {
            console.log(wallet);
            // assign the store to the fabric client
            client.setStateStore(wallet);
            let cryptoSuite = FabricClient.newCryptoSuite();
            // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
            let cryptoStore = FabricClient.newCryptoKeyStore({ path: walletPath });

            cryptoSuite.setCryptoKeyStore(cryptoStore);
            client.setCryptoSuite(cryptoSuite);


            channel = client.newChannel(channelId);
            const peerObj = client.newPeer(networkUrl);
            channel.addPeer(peerObj);
            channel.addOrderer(client.newOrderer(ordererUrl));
            targets.push(peerObj);

        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
}

export function query(chaincodeId, fcn, args = []) {
    // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    return client.getUserContext('admin', true)
        .then((user_from_store) => {
            if (user_from_store && user_from_store.isEnrolled()) {
                console.log('Successfully loaded admin from persistence');
            } else {
                throw new Error('Failed to get admin');
            }

            // queryCar chaincode function - requires 1 argument, ex: args: ['CAR4'],
            // queryAllCars chaincode function - requires no arguments , ex: args: [''],
            const request = {
                //targets : --- letting this default to the peers assigned to the channel
                chaincodeId,
                fcn,
                args
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

export function installChaincode(peers, chaincodeName, chaincodePath,
                                 chaincodeVersion, chaincodeType, username, org_name) {
    let error_message = null;
    try {

        const tx_id = client.newTransactionID(true); //get an admin transactionID
        var request = {
            targets: peers,
            chaincodePath: chaincodePath,
            chaincodeId: chaincodeName,
            chaincodeVersion: chaincodeVersion,
            chaincodeType: chaincodeType
        };

        return client.installChaincode(request)
            .then(() => {
                // the returned object has both the endorsement results
                // and the actual proposal, the proposal will be needed
                // later when we send a transaction to the orederer
                var proposalResponses = results[0];
                var proposal = results[1];

                // lets have a look at the responses to see if they are
                // all good, if good they will also include signatures
                // required to be committed
                var all_good = true;
                for (var i in proposalResponses) {
                    let one_good = false;
                    if (proposalResponses && proposalResponses[i].response &&
                        proposalResponses[i].response.status === 200) {
                        one_good = true;
                        logger.info('install proposal was good');
                    } else {
                        logger.error('install proposal was bad %j', proposalResponses.toJSON());
                    }
                    all_good = all_good & one_good;
                }
                if (all_good) {
                    logger.info('Successfully sent install Proposal and received ProposalResponse');
                } else {
                    error_message = 'Failed to send install Proposal or receive valid response. Response null or status is not 200';
                    logger.error(error_message);
                }
            })

    } catch (error) {
        logger.error('Failed to install due to error: ' + error.stack ? error.stack : error);
        error_message = error.toString();
    }

    if (!error_message) {
        let message = util.format('Successfully install chaincode');
        logger.info(message);
        // build a response to send back to the REST caller
        let response = {
            success: true,
            message: message
        };
        return response;
    } else {
        let message = util.format('Failed to install due to:%s', error_message);
        logger.error(message);
        throw new Error(message);
    }

}