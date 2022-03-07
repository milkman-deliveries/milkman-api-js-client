/// <reference types="node" />
import 'isomorphic-fetch';
import { TokenStore } from '../storage/TokenStore';
export declare const COGNITO_ENDPOINT = "https://auth.milkmantechnologies.com/";
export declare const COGNITO_TOKEN_TIMEOUT: number;
export declare const COGNITO_ID_TOKEN_KEY = "MILKMAN_COGNITO_ID_TOKEN";
export declare const COGNITO_REFRESH_TOKEN_KEY = "MILKMAN_COGNITO_REFRESH_TOKEN";
export declare enum AuthenticationMethod {
    USER_PASSWORD = "USER_PASSWORD_AUTH",
    REFRESH_TOKEN = "REFRESH_TOKEN_AUTH"
}
export interface CognitoAuthResponse {
    IdToken: string;
    RefreshToken: string;
}
export interface ApiAuthConfig<T extends TokenStore> {
    application: string;
    clientId: string;
    automaticRefresh?: boolean;
    refreshTimeoutMs?: number;
    idTokenStore?: T;
    refreshTokenStore?: T;
    useMilkmanSession?: boolean;
    milkmanBaseUrl?: string;
    sessionTokenStore?: T;
}
export declare class ApiAuth<T extends TokenStore> {
    application: string;
    clientId: string;
    automaticRefresh: boolean;
    refreshTimeoutMs: number;
    idTokenStore: T;
    refreshTokenStore: T;
    useMilkmanSession: boolean;
    milkmanBaseUrl?: string;
    sessionTokenStore: T;
    sessionTimeout: NodeJS.Timeout;
    constructor(config: ApiAuthConfig<T>);
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
