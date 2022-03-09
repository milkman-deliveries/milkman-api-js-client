import 'isomorphic-fetch';
import { TokenStore } from '../../storage/TokenStore';
export declare const LEGACY_SESSION_TOKEN_KEY = "MILKMAN_LEGACY_SESSION_TOKEN_KEY";
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
    get authUrl(): string;
    /** Calls POST /milkman/login, retrieving Milkman session token. */
    _login(params: LegacyLoginParams): Promise<string>;
    login(params: LegacyLoginParams): Promise<boolean>;
}
