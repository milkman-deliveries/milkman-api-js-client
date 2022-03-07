import { TokenStore } from '../../storage/TokenStore';
import { RequestEnhancer } from '../../types/RequestEnhancer';
export declare const injectLegacySessionTokenFactory: <T extends TokenStore>(sessionTokenStore: T) => RequestEnhancer<any>;
