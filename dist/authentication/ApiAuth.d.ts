/// <reference types="node" />
import 'isomorphic-fetch';
export declare const COGNITO_ENDPOINT = "https://auth.milkmantechnologies.com/";
export declare const COGNITO_TOKEN_TIMEOUT: number;
export declare enum AuthenticationMethod {
    USER_PASSWORD = "USER_PASSWORD_AUTH",
    REFRESH_TOKEN = "REFRESH_TOKEN_AUTH"
}
export interface ApiAuthConfig {
    application: string;
    clientId: string;
    automaticRefresh?: boolean;
    refreshTimeoutMs?: number;
}
export declare class ApiAuth {
    application: string;
    clientId: string;
    automaticRefresh: boolean;
    refreshTimeoutMs: number;
    sessionTimeout: NodeJS.Timeout;
    constructor(config: ApiAuthConfig);
    /**
     * Compose the url for Cognito authentication.
     */
    get authUrl(): string;
    /**
     * Calls Cognito, asking for ID token and refresh Token.
     */
    cognitoLogin(username: string, password: string): Promise<Response>;
    /**
     * Calls Cognito, asking for a new ID token.
     */
    cognitoRefresh(): Promise<Response>;
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
