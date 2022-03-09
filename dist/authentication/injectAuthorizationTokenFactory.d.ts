import { TokenStore } from '../storage/TokenStore';
import { RequestEnhancer } from '../types/RequestEnhancer';
export declare const injectAuthorizationTokenFactory: <T extends TokenStore, T_REQ>(idTokenStore: T) => RequestEnhancer<T_REQ, T_REQ>;