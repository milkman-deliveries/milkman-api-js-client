import { ID } from './ID';
export declare const ID_PROPERTY = "id";
export interface GenericEntityIdentifier {
    [ID_PROPERTY]: ID;
}
export declare type Entity<T = GenericEntityIdentifier> = object & {
    [key in keyof T]: ID;
};
