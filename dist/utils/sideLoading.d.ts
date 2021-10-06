import { Entity } from '../types/Entity';
import { ID } from '../types/ID';
declare type MappedEntities<T> = {
    [key: ID]: Entity<T>;
};
/**
 * Extract the list all the ids from a list of entities
 * @param entities The list of entities
 * @param [propertyName] The name of the id property.
 */
export declare const getAllIds: <T>(entities: T[], propertyName?: string) => ID[];
/**
 * Map a list of entities by a specified identifier.
 * @param entities The list of entities
 * @param [propertyName] The name of the id property.
 */
export declare const mapById: <T>(entities: Entity<T>[], propertyName?: string) => MappedEntities<T>;
/**
 * Map a list of entities by a specified identifier.
 * @param mappedEntities The map of entities
 * @param ids The list of the identifiers.
 */
export declare const selectByIds: <T>(mappedEntities: MappedEntities<T>, ids: ID[]) => Entity<T>[];
export {};
