declare module '@theledger/couchdb-query-engine' {

    export function parseQuery(data: Map<string, any>, query: object): KV[];

    export function test(data: Map<string, any>, query: object): boolean;

    interface KV {
        key: string;
        value: any;
    }
}