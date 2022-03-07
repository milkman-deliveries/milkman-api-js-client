import { TokenStore } from './TokenStore';
export declare class SessionTokenStore implements TokenStore {
    key: string;
    constructor(key: string);
    retrieve(): string;
    store(value: string): void;
}
