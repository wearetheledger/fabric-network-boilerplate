import { Iterators, KV } from 'fabric-shim';

export class MockStateQueryIterator implements Iterators.StateQueryIterator {
    defaultMaxListeners = 0;
    usingDomains: boolean;

    private currentLoc = 0;
    private closed = false;

    constructor(private data: KV[]) {
        // this.setMaxListeners(0);
    }

    addListener(type: any, listener: any) {
        throw new Error('Method not implemented.');
    }

    emit(type: any, ...args: any[]) {
        throw new Error('Method not implemented.');
    }

    eventNames() {
        throw new Error('Method not implemented.');
    }

    getMaxListeners() {
        throw new Error('Method not implemented.');
    }

    listenerCount(emitter: any, type?: any) {
        throw new Error('Method not implemented.');
    }

    listeners(type: any) {
        throw new Error('Method not implemented.');
    }

    on(type: any, listener: any) {
        throw new Error('Method not implemented.');
    }

    once(type: any, listener: any) {
        throw new Error('Method not implemented.');
    }

    prependListener(type: any, listener: any) {
        throw new Error('Method not implemented.');
    }

    prependOnceListener(type: any, listener: any) {
        throw new Error('Method not implemented.');
    }

    removeAllListeners(type: any, ...args: any[]) {
        throw new Error('Method not implemented.');
    }

    removeListener(type: any, listener: any) {
        throw new Error('Method not implemented.');
    }

    setMaxListeners(n: any) {
        throw new Error('Method not implemented.');
    }

    init(): void {
        throw new Error('Method not implemented.');
    }

    next(): Promise<{ value: any; done: boolean }> {

        if (this.closed) {
            throw new Error('Iterator has already been closed');
        }

        this.currentLoc++;

        return Promise.resolve({
            value: this.data[this.currentLoc - 1],
            done: this.data.length <= this.currentLoc
        });
    }

    close(): void {
        this.closed = true;
    }

}