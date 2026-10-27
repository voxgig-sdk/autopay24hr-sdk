import { Autopay24hrEntityBase } from '../Autopay24hrEntityBase';
import type { Autopay24hrSDK } from '../Autopay24hrSDK';
import type { Control } from '../types';
import type { ChatStatus, ChatStatusLoadMatch } from '../Autopay24hrTypes';
declare class ChatStatusEntity extends Autopay24hrEntityBase<ChatStatus> {
    constructor(client: Autopay24hrSDK, entopts: any);
    make(this: ChatStatusEntity): ChatStatusEntity;
    load(this: any, reqmatch?: ChatStatusLoadMatch, ctrl?: Control): Promise<ChatStatusEntity>;
}
export { ChatStatusEntity };
