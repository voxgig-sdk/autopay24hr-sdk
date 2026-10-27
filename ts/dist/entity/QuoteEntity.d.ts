import { Autopay24hrEntityBase } from '../Autopay24hrEntityBase';
import type { Autopay24hrSDK } from '../Autopay24hrSDK';
import type { Control } from '../types';
import type { Quote, QuoteListMatch } from '../Autopay24hrTypes';
declare class QuoteEntity extends Autopay24hrEntityBase<Quote> {
    constructor(client: Autopay24hrSDK, entopts: any);
    make(this: QuoteEntity): QuoteEntity;
    list(this: any, reqmatch?: QuoteListMatch, ctrl?: Control): Promise<QuoteEntity[]>;
}
export { QuoteEntity };
