import 'isomorphic-fetch';
import { TokenStore } from '../../storage/TokenStore';
export interface LegacyApiAuthConfig<T extends TokenStore> {
    baseUrl?: string;
    sessionTokenStore: T;
}
export interface LegacyLoginParams extends Map<string, any> {
    username?: string;
    password?: string;
    loginSource?: string;
    rememberMe?: boolean;
}
export declare class LegacyApiAuth<T extends TokenStore> {
    baseUrl: string;
    sessionTokenStore: T;
    constructor(config: LegacyApiAuthConfig<T>);
    /** Calls POST /milkman/login, retrieving Milkman session token. */
    _login(params: LegacyLoginParams): Promise<string>;
    login(params: LegacyLoginParams): Promise<boolean>;
}
