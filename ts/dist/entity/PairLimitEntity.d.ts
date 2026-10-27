import { Autopay24hrEntityBase } from '../Autopay24hrEntityBase';
import type { Autopay24hrSDK } from '../Autopay24hrSDK';
import type { Control } from '../types';
import type { PairLimit, PairLimitLoadMatch } from '../Autopay24hrTypes';
declare class PairLimitEntity extends Autopay24hrEntityBase<PairLimit> {
    constructor(client: Autopay24hrSDK, entopts: any);
    make(this: PairLimitEntity): PairLimitEntity;
    load(this: any, reqmatch?: PairLimitLoadMatch, ctrl?: Control): Promise<PairLimitEntity>;
}
export { PairLimitEntity };
