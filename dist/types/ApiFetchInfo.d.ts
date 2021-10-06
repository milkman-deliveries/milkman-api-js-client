export interface ApiFetchInfo<T> {
    path: string;
    method: string;
    data?: T;
    options?: Partial<RequestInit>;
}
