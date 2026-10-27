import { ChatStatusEntity } from './entity/ChatStatusEntity';
import { CoinEntity } from './entity/CoinEntity';
import { HealthEntity } from './entity/HealthEntity';
import { PairLimitEntity } from './entity/PairLimitEntity';
import { QuoteEntity } from './entity/QuoteEntity';
export type * from './Autopay24hrTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { Autopay24hrEntityBase } from './Autopay24hrEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
type DirectResult = {
    ok: false;
    err: any;
    status?: undefined;
    headers?: undefined;
    data?: undefined;
} | {
    ok: boolean;
    status: number;
    headers: any;
    data: any;
    err?: any;
};
declare class Autopay24hrSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<DirectResult>;
    _rawRequest(fetchargs?: any): Promise<DirectResult>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    ChatStatus(entopts?: Record<string, any>): ChatStatusEntity;
    Coin(entopts?: Record<string, any>): CoinEntity;
    Health(entopts?: Record<string, any>): HealthEntity;
    PairLimit(entopts?: Record<string, any>): PairLimitEntity;
    Quote(entopts?: Record<string, any>): QuoteEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): Autopay24hrSDK;
    tester(testopts?: any, sdkopts?: any): Autopay24hrSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof Autopay24hrSDK;
export { stdutil, config, BaseFeature, Autopay24hrEntityBase, Autopay24hrSDK, SDK, };
export type { DirectResult };
