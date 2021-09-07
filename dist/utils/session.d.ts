import 'isomorphic-fetch';
export declare const COGNITO_ID_TOKEN_KEY = "MILMAN_COGNITO_ID_TOKEN";
export declare const COGNITO_REFRESH_TOKEN_KEY = "MILMAN_COGNITO_REFRESH_TOKEN";
export declare const retrieveIdToken: () => string;
export declare const storeIdToken: (token: string) => void;
export declare const retrieveRefreshToken: () => string;
export declare const storeRefreshToken: (token: string) => void;
