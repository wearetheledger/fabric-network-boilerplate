import * as _ from "lodash"

export const normalizePayload = (value: any): any => {

    if (_.isDate(value)) {
        return value.getTime();
    } else if (_.isString(value)) {
        return value;
    } else if (_.isArray(value)) {
        return _.map(value, (v: object) => {
            return normalizePayload(v);
        });
    } else if (_.isObject(value)) {
        return _.mapValues(value, (v: any) => {
            return normalizePayload(v);
        });
    }

    return value;
};