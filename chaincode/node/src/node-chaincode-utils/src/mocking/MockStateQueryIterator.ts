import { Iterators, KV } from 'fabric-shim';

export class MockStateQueryIterator implements Iterators.StateQueryIterator {
    defaultMaxListeners = 0;
    usingDomains: boolean;

    private currentLoc = 0;
    private closed = false;

    constructor(private data: KV[]) {
        // this.setMaxListeners(0);
    }

    // tslint:disable-next-line:no-empty
    _createAndEmitResult() { }
    // tslint:disable-next-line:no-empty
    _getResultFromBytes() { }

    addListener(type: any, listener: any): any {
        throw new Error('Method not implemented.');
    }

    emit(type: any, ...args: any[]): any {
        throw new Error('Method not implemented.');
    }

    eventNames(): any {
        throw new Error('Method not implemented.');
    }

    getMaxListeners(): any {
        throw new Error('Method not implemented.');
    }

    listenerCount(emitter: any, type?: any): any {
        throw new Error('Method not implemented.');
    }

    listeners(type: any): any {
        throw new Error('Method not implemented.');
    }

    on(type: any, listener: any): any {
        throw new Error('Method not implemented.');
    }

    once(type: any, listener: any): any {
        throw new Error('Method not implemented.');
    }

    prependListener(type: any, listener: any): any {
        throw new Error('Method not implemented.');
    }

    prependOnceListener(type: any, listener: any): any {
        throw new Error('Method not implemented.');
    }

    removeAllListeners(type: any, ...args: any[]): any {
        throw new Error('Method not implemented.');
    }

    removeListener(type: any, listener: any): any {
        throw new Error('Method not implemented.');
    }

    setMaxListeners(n: any):any {
        this.defaultMaxListeners = n;
    }

    init(): void {
        throw new Error('Method not implemented.');
    }

    next(): Promise<{ value: any; done: boolean }> {

        if (this.closed) {
            throw new Error('Iterator has already been closed');
        }

        return Promise.resolve({
            value: this.data[this.currentLoc++],
            done: this.data.length < this.currentLoc
        });
    }

    close(): Promise<any> {
        this.closed = true;
        return Promise.resolve(true);
    }

}