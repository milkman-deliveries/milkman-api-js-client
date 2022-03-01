import 'isomorphic-fetch';
import { TokenStore } from '../sessionStorage';
export interface LegacyApiAuthConfig {
    baseUrl?: string;
    store: TokenStore;
}
export interface LegacyLoginParams extends Map<string, any> {
    username?: string;
    password?: string;
}
export declare class LegacyApiAuth {
    baseUrl: string;
    tokenStore: TokenStore;
    constructor(config: LegacyApiAuthConfig);
    /** Calls POST /milkman/login, retrieving Milkman session token. */
    _login(params: LegacyLoginParams): Promise<string>;
    login(params: LegacyLoginParams): Promise<boolean>;
}
