import 'isomorphic-fetch';
export declare const COGNITO_ID_TOKEN_KEY = "MILKMAN_COGNITO_ID_TOKEN";
export declare const COGNITO_REFRESH_TOKEN_KEY = "MILKMAN_COGNITO_REFRESH_TOKEN";
export declare const retrieveIdToken: () => string;
export declare const storeIdToken: (token: string) => void;
export declare const retrieveRefreshToken: () => string;
export declare const storeRefreshToken: (token: string) => void;
export declare const SESSION_TOKEN_KEY = "MILKMAN_SESSION_TOKEN_KEY";
export declare const retrieveSessionToken: () => string;
export declare const storeSessionToken: (token: string) => void;
export interface TokenStore {
    getToken(): string;
    saveToken(value: string): void;
}
export declare class DefaultSessionTokenStore implements TokenStore {
    getToken(): string;
    saveToken(value: string): void;
}
export declare class DefaultIdTokenStore implements TokenStore {
    getToken(): string;
    saveToken(value: string): void;
}
export declare class DefaultRefreshTokenStore implements TokenStore {
    getToken(): string;
    saveToken(value: string): void;
}
