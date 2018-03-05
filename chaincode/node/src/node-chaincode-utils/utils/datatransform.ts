import { normalizePayload } from "./normalizePayload";
import * as _ from "lodash"
import { Iterators } from "fabric-shim";

export const serialize = (value: any) => {
    if (_.isDate(value) || _.isString(value)) {

        return Buffer.from(normalizePayload(value).toString());
    }

    return Buffer.from(JSON.stringify(normalizePayload(value)));
};

export const toObject = (buffer: Buffer): object | undefined => {
    if (buffer == null) {
        return;
    }

    const bufferString = buffer.toString();
    if (bufferString.length <= 0) {
        return;
    }

    return JSON.parse(bufferString);
};

export const bufferToDate = (buffer: Buffer): Date | undefined => {
    if (buffer == null) {

        return;
    }

    const bufferString = buffer.toString();
    if (bufferString.length <= 0) {

        return;
    }

    if (/\d+/g.test(bufferString)) {

        return new Date(parseInt(bufferString, 10));
    }

    return;
};

export const bufferToString = (buffer: Buffer): string | undefined => {
    if (buffer == null) {

        return null;
    }

    return buffer.toString();
};

/**
 * Transform iterator to array of objects
 *
 * @param {"fabric-shim".Iterators.Iterator} iterator
 * @returns {Promise<Array>}
 */
export const iteratorToList = async (iterator: Iterators.Iterator) => {
    const allResults = [];
    let res;
    while (res == null || !res.done) {
        res = await iterator.next();
        if (res.value && res.value.value.toString()) {
            let parsedItem: any;

            try {
                parsedItem = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
                parsedItem = res.value.value.toString('utf8');
            }
            allResults.push(parsedItem);
        }
    }

    await iterator.close();

    return allResults;
};

/**
 * Transform iterator to array of objects
 *
 * @param {"fabric-shim".Iterators.Iterator} iterator
 * @returns {Promise<Array>}
 */
export const iteratorToKVList = async (iterator: Iterators.Iterator): Promise<KV[]> => {
    const allResults = [];
    let res;
    while (res == null || !res.done) {
        res = await iterator.next();
        if (res.value && res.value.value.toString()) {
            let parsedItem: { key: string, value: any } = {key: "", value: {}};

            parsedItem.key = res.value.key;

            try {
                parsedItem.value = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
                parsedItem.value = res.value.value.toString('utf8');
            }
            allResults.push(parsedItem);
        }
    }

    await iterator.close();

    return allResults;
};

export interface KV {
    key: string,
    value: any
}
