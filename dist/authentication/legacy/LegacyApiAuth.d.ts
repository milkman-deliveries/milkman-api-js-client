import 'isomorphic-fetch';
export interface LegacyApiAuthConfig {
    baseUrl?: string;
}
export interface LegacyLoginParams extends Map<string, any> {
    username?: string;
    password?: string;
}
export declare class LegacyApiAuth {
    baseUrl: string;
    constructor(config: LegacyApiAuthConfig);
    /** Calls POST /milkman/login, retrieving Milkman session token. */
    _login(params: LegacyLoginParams): Promise<string>;
    login(params: LegacyLoginParams): Promise<boolean>;
}
