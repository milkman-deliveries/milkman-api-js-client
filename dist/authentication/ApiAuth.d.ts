/// <reference types="node" />
import 'isomorphic-fetch';
export declare const COGNITO_ENDPOINT = "https://auth.milkmantechnologies.com/";
export declare const COGNITO_TOKEN_TIMEOUT: number;
export declare enum AuthenticationMethod {
    USER_PASSWORD = "USER_PASSWORD_AUTH",
    REFRESH_TOKEN = "REFRESH_TOKEN_AUTH"
}
export interface CognitoAuthResponse {
    IdToken: string;
    RefreshToken: string;
}
export interface ApiAuthConfig {
    application: string;
    clientId: string;
    automaticRefresh?: boolean;
    refreshTimeoutMs?: number;
    useMilkmanSession?: boolean;
    milkmanBaseUrl?: string;
}
export declare class ApiAuth {
    application: string;
    clientId: string;
    automaticRefresh: boolean;
    refreshTimeoutMs: number;
    useMilkmanSession: boolean;
    milkmanBaseUrl?: string;
    sessionTimeout: NodeJS.Timeout;
    constructor(config: ApiAuthConfig);
    get cognitoAuthUrl(): string;
    get milkmanResolveUserUrl(): string;
    /**
     * Calls Cognito, asking for ID token and refresh Token.
     */
    _cognitoLogin(username: string, password: string): Promise<CognitoAuthResponse>;
    /**
     * Calls Cognito, asking for a new ID token.
     */
    _cognitoRefresh(): Promise<CognitoAuthResponse>;
    /**
     * Calls POST /milkman/resolveUser, retrieving Milkman session token.
     */
    _resolveUser(): Promise<string>;
    scheduleAutomaticRefresh(): void;
    /**
     * Authenticate via Cognito and store ID and Refresh tokens in session storage.
     * Depending on the configuration, it can schedules an automatic authentication refresh.
     */
    login(username: string, password: string): Promise<boolean>;
    /**
     * Refresh authentication via Cognito using the Refresh token,
     * then store the new ID token in session storage.
     */
    refresh(): Promise<boolean>;
}
