export interface TokenStore {
    key: string;
    retrieve(): string;
    store(value: string): void;
}
