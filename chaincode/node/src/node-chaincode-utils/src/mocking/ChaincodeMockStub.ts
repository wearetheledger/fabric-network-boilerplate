import { ChaincodeReponse, Iterators, KV, MockStub, ProposalCreator, SignedProposal } from 'fabric-shim';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { MockStateQueryIterator } from './MockStateQueryIterator';
import { Chaincode } from '../Chaincode';

export class ChaincodeMockStub implements MockStub {

    private txTimestamp: Timestamp;
    private txID: string;
    private args: string[];
    private state: Map<string, Buffer>;
    private invokables: Map<string, MockStub>;
    private signedProposal: SignedProposal;

    constructor(private name: string, private cc: Chaincode) {
    }

    getTxID(): string {
        return this.txID;
    }

    getArgs(): string[] {
        return this.args;
    }

    getStringArgs(): string[] {
        return this.args;
    }

    getFunctionAndParameters(): { params: string[]; fcn: string } {

        const params = this.getStringArgs();
        let fcn = '';

        if (params.length >= 1) {
            fcn = params[0];
            params.splice(0, 1);
        }

        return {
            fcn,
            params,
        };
    }

    // Used to indicate to a chaincode that it is part of a transaction.
    // This is important when chaincodes invoke each other.
    // MockStub doesn't support concurrent transactions at present.
    mockTransactionStart(txid: string): void {
        this.txID = txid;
        this.setSignedProposal(<SignedProposal>{});
        this.setTxTimestamp(new Timestamp());
    }

    // End a mocked transaction, clearing the UUID.
    mockTransactionEnd(uuid: string): void {
        this.signedProposal = null;
        this.txID = '';
    }

    // Register a peer chaincode with this MockStub
    // invokableChaincodeName is the name or hash of the peer
    // otherStub is a MockStub of the peer, already intialised
    mockPeerChaincode(invokableChaincodeName: string, otherStub: MockStub): void {
        this.invokables[invokableChaincodeName] = otherStub;
    }

    // Initialise this chaincode,  also starts and ends a transaction.
    mockInit(uuid: string, args: string[]): Promise<ChaincodeReponse> {
        this.args = args;
        this.mockTransactionStart(uuid);
        const res = this.cc.Init(this);
        this.mockTransactionEnd(uuid);
        return res;
    }

    // Invoke this chaincode, also starts and ends a transaction.
    mockInvoke(uuid: string, args: string[]): Promise<ChaincodeReponse> {
        this.args = args;
        this.mockTransactionStart(uuid);
        const res = this.cc.Invoke(this);
        this.mockTransactionEnd(uuid);
        return res;
    }

    // InvokeChaincode calls a peered chaincode.
    invokeChaincode(chaincodeName: string, args: Buffer[], channel: string): Promise<ChaincodeReponse> {
        // Internally we use chaincode name as a composite name
        if (channel != '') {
            chaincodeName = chaincodeName + '/' + channel;
        }

        const otherStub = this.invokables[chaincodeName];

        return otherStub.MockInvoke(this.txID, args);
    }

    // Invoke this chaincode, also starts and ends a transaction.
    mockInvokeWithSignedProposal(uuid: string, args: string[], sp: SignedProposal): Promise<ChaincodeReponse> {
        this.args = args;
        this.mockTransactionStart(uuid);
        this.signedProposal = sp;
        const res = this.cc.Invoke(this);
        this.mockTransactionEnd(uuid);
        return res;
    }

    getState(key: string): Promise<Buffer> {
        return this.state[key];
    }

    putState(key: string, value: Buffer): Promise<any> {
        if (this.txID == '') {
            return Promise.reject('Cannot putState without a transactions - call stub.mockTransactionStart()?');
        }

        this.state[key] = value;

        return Promise.resolve();
    }

    // DelState removes the specified `key` and its value from the ledger.
    deleteState(key: string): Promise<any> {
        delete this.state[key];

        return Promise.resolve();
    }

    getStateByRange(startKey: string, endKey: string): Promise<Iterators.StateQueryIterator> {

        const items: KV[] = Object.keys(this.state)
            .filter((k: string) => startKey <= k && endKey >= k)
            .map((k: string): KV => {
                return {
                    key: k,
                    value: this.state[k]
                };
            });

        return Promise.resolve(new MockStateQueryIterator(items));

    }

    // GetQueryResult function can be invoked by a chaincode to perform a
    // rich query against state database.  Only supported by state database implementations
    // that support rich query.  The query string is in the syntax of the underlying
    // state database. An iterator is returned which can be used to iterate (next) over
    // the query result set
    getQueryResult(query: string): Promise<Iterators.StateQueryIterator> {
        return undefined;
    }

    getHistoryForKey(key: string): Promise<Iterators.HistoryQueryIterator> {
        return undefined;
    }

    createCompositeKey(objectType: string, attributes: string[]): string {
        return undefined;
    }

    splitCompositeKey(compositeKey: string): { objectType: string; attributes: string[] } {
        return undefined;
    }

    getStateByPartialCompositeKey(objectType: string, attributes: string[]): Promise<Iterators.StateQueryIterator> {
        return undefined;
    }

    getSignedProposal(): SignedProposal {
        return this.signedProposal;
    }

    setSignedProposal(sp: SignedProposal): void {
        this.signedProposal = sp;
    }

    setTxTimestamp(t: Timestamp): void {
        this.txTimestamp = t;
    }

    getTxTimestamp(): Timestamp {
        if (this.txTimestamp == null) {
            throw new Error('TxTimestamp not set.');
        }
        return this.txTimestamp;
    }

    // Not implemented
    getBinding(): string {
        return undefined;
    }

    // Not implemented
    getCreator(): ProposalCreator {
        return undefined;
    }

    // Not implemented
    getTransient(): Map<string, Buffer> {
        return undefined;
    }

    // Not implemented
    setEvent(name: string, payload: Buffer): void {
        throw new Error('Not implemented');
    }

    // Not implemented
    getChannelID(): string {
        return undefined;
    }

}