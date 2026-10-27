import { Autopay24hrEntityBase } from '../Autopay24hrEntityBase';
import type { Autopay24hrSDK } from '../Autopay24hrSDK';
import type { Control } from '../types';
import type { Health, HealthLoadMatch } from '../Autopay24hrTypes';
declare class HealthEntity extends Autopay24hrEntityBase<Health> {
    constructor(client: Autopay24hrSDK, entopts: any);
    make(this: HealthEntity): HealthEntity;
    load(this: any, reqmatch?: HealthLoadMatch, ctrl?: Control): Promise<HealthEntity>;
}
export { HealthEntity };
