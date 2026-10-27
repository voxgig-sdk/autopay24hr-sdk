import { Autopay24hrEntityBase } from '../Autopay24hrEntityBase';
import type { Autopay24hrSDK } from '../Autopay24hrSDK';
import type { Control } from '../types';
import type { Coin, CoinListMatch } from '../Autopay24hrTypes';
declare class CoinEntity extends Autopay24hrEntityBase<Coin> {
    constructor(client: Autopay24hrSDK, entopts: any);
    make(this: CoinEntity): CoinEntity;
    list(this: any, reqmatch?: CoinListMatch, ctrl?: Control): Promise<CoinEntity[]>;
}
export { CoinEntity };
