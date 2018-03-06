// Type definitions for fabric-shim 1.1.0-alpha
// Project: https://github.com/hyperledger/fabric-chaincode-node
// Definitions by: TheLedger <https://github.com/wearetheledgerr>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

declare module "fabric-shim" {

    import { Logger } from "log4js";
    import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";

    export function error(...args: any[]): ErrorResponse;
    export function newLogger(name: string): Logger;
    export function start(chaincode: ChaincodeInterface): any;
    export function success(payload?: Buffer): SuccessResponse;

    interface SuccessResponse {
        status: number;
        payload: Buffer;
    }

    interface ErrorResponse {
        status: number;
        message: string;
    }

    export class ClientIdentity {
        constructor(stub: Stub);
        assertAttributeValue(attrName: string, attrValue: string): boolean;
        getAttributeValue(attrName: string): string | null;
        getID(): string;
        getMSPID(): string;
        getX509Certificate(): X509;
    }

    type ProposalCreator = { [fieldName: string]: any, mspid: string };

    type SignedProposal = {
        signature: Buffer;
        proposal: Proposal;
    }

    type Proposal = {
        header: Header;
        payload: ChaincodeProposalPayload;
    }

    type Header = {
        channel_header: ChannelHeader;
        signature_header: SignatureHeader;
    }

    type ChannelHeader = {
        type: ChannelHeaderType;
        version: number;
        timestamp: any;
        channel_id: string;
        tx_id: string;
        epoch: number;
    }

    type SignatureHeader = {
        creator: ProposalCreator;
        nonce: Buffer;
    }

    type ChaincodeProposalPayload = {
        input: Buffer;
        transientMap: Map<string, Buffer>;
    }

    enum ChannelHeaderType {
        MESSAGE = 0,
        CONFIG,
        CONFIG_UPDATE,
        ENDORSER_TRANSACTION,
        ORDERER_TRANSACTION,
        DELIVER_SEEK_INFO,
        CHAINCODE_PACKAGE,
    }

    type Response = {
        status: number;
        message: string;
        payload: Buffer;
    }

    export class Stub {
        constructor(client: any, channel_id: any, txId: any, chaincodeInput: any, signedProposal: any);
        createCompositeKey(objectType: string, attributes: string[]): string;
        deleteState(key: string): Promise<any>;
        getArgs(): string[];
        getBinding(): string;
        getChannelID(): string;
        getCreator(): ProposalCreator;
        getFunctionAndParameters(...args: any[]): { params: string[], fcn: string };
        getHistoryForKey(key: string): Promise<Iterators.HistoryQueryIterator>;
        getQueryResult(query: string): Promise<Iterators.StateQueryIterator>;
        getSignedProposal(): SignedProposal;
        getState(key: string): Promise<Buffer>;
        getStateByPartialCompositeKey(objectType: string, attributes: string[]): Promise<Iterators.StateQueryIterator>;
        getStateByRange(startKey: string, endKey: string): Promise<Iterators.StateQueryIterator>;
        getStringArgs(): string[];
        getTransient(): Map<string, Buffer>;
        getTxID(): string;
        getTxTimestamp(): Timestamp;
        invokeChaincode(chaincodeName: string, args: Buffer[], channel: string): Promise<Response>;
        putState(key: string, value: Buffer): Promise<any>; // TODO promise contains what?????
        setEvent(name: string, payload: Buffer): void;
        splitCompositeKey(compositeKey: string): { objectType: string, attributes: string[] };

        static RESPONSE_CODE: {
            ERROR: number;
            ERRORTHRESHOLD: number;
            OK: number;
        };

    }


    interface ChaincodeInterface {
        Init(stub: Stub): void;
        Invoke(stub: Stub): void;
    }


    export namespace Iterators {
        class EventEmitter {
            constructor();
            addListener(type: any, listener: any): any;
            emit(type: any, ...args: any[]): any;
            eventNames(): any;
            getMaxListeners(): any;
            listenerCount(type: any): any;
            listeners(type: any): any;
            on(type: any, listener: any): any;
            once(type: any, listener: any): any;
            prependListener(type: any, listener: any): any;
            prependOnceListener(type: any, listener: any): any;
            removeAllListeners(type: any, ...args: any[]): any;
            removeListener(type: any, listener: any): any;
            setMaxListeners(n: any): any;
            static EventEmitter: any;
            static defaultMaxListeners: number;
            static init(): void;
            static listenerCount(emitter: any, type: any): any;
            static usingDomains: boolean;

        }

        class Iterator {
            defaultMaxListeners: number;
            usingDomains: boolean;
            init(): void;
            listenerCount(emitter: any, type: any): any;
            domain: any;
            addListener(type: any, listener: any): any;
            close(): void;
            emit(type: any, ...args: any[]): any;
            eventNames(): any;
            getMaxListeners(): any;
            listenerCount(type: any): any;
            listeners(type: any): any;
            on(type: any, listener: any): any;
            once(type: any, listener: any): any;
            prependListener(type: any, listener: any): any;
            prependOnceListener(type: any, listener: any): any;
            removeAllListeners(type: any, ...args: any[]): any;
            removeListener(type: any, listener: any): any;
            setMaxListeners(n: any): any;
            next(): any
        }

        class HistoryQueryIterator extends Iterator {
            next(): void;
        }

        class StateQueryIterator extends Iterator {
            next(): { value: any, done: boolean };
        }

    }

    interface X509 {
        subject: Subject;
        issuer: Issuer;
        notBefore: string;
        notAfter: string;
        altNames?: (string)[] | null;
        signatureAlgorithm: string;
        fingerPrint: string;
        publicKey: any;
    }

    interface Subject {
        countryName: string;
        postalCode: string;
        stateOrProvinceName: string;
        localityName: string;
        streetAddress: string;
        organizationName: string;
        organizationalUnitName: string;
        commonName: string;
    }

    interface Issuer {
        countryName: string;
        stateOrProvinceName: string;
        localityName: string;
        organizationName: string;
        commonName: string;
    }
    
    interface KV {
        key: string;
        value: any;
    }
}
