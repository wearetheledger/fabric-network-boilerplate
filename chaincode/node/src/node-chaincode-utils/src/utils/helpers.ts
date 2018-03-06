
import { Logger, LoggerInstance, transports } from 'winston';
import { isArray } from 'util';

export class Helpers {

    public static log(name: string, level?: string): LoggerInstance {
        return new Logger({
            transports: [new transports.Console({
                level: level || 'debug',
                prettyPrint: true,
                handleExceptions: true,
                json: false,
                label: name,
                colorize: true,
            })],
            exitOnError: false,
        });
    };

    public static checkArgs(args: string[], amount: number | number[]) {
        if (isArray(amount)) {
            if (!amount.filter(a => { return args.length === a }).length) {
                throw new Error(`Incorrect number of arguments. Expecting ${amount}`);
            }
        } else {
            if (args.length != amount) {
                throw new Error(`Incorrect number of arguments. Expecting ${amount}`);
            }
        }
    }
}