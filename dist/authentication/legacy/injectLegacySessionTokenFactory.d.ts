import { TokenStore } from '../../storage/TokenStore';
import { RequestEnhancer } from '../../types/RequestEnhancer';
export declare const injectLegacySessionTokenFactory: <T extends TokenStore, T_REQ>(sessionTokenStore: T) => RequestEnhancer<T_REQ, T_REQ>;
