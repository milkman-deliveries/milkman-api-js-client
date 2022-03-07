import { TokenStore } from '../storage/TokenStore';
import { RequestEnhancer } from '../types/RequestEnhancer';
export declare const injectAuthorizationTokenFactory: <T extends TokenStore>(idTokenStore: T) => RequestEnhancer<any>;
