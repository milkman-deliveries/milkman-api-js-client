import { Entity, ID_PROPERTY } from '../types/Entity'
import { ID } from '../types/ID'

type MappedEntities<T> = { [key: ID]: Entity<T> }

/**
 * Extract the list all the ids from a list of entities
 * @param entities The list of entities
 * @param [propertyName] The name of the id property.
 */
export const getAllIds = <T>(entities: T[], propertyName: string = 'id'): ID[] => {
  const ids = []
  entities.forEach(entity => {
    const entityIds = entity[propertyName]
    if (Array.isArray(entityIds)) {
      ids.push(entityIds)
    } else {
      ids.push(entityIds)
    }
  })
  return ids
}

/**
 * Map a list of entities by a specified identifier.
 * @param entities The list of entities
 * @param [propertyName] The name of the id property.
 */
export const mapById = <T>(
  entities: Entity<T>[],
  propertyName: string = ID_PROPERTY
): MappedEntities<T> => (
  entities.reduce<MappedEntities<T>>((map, entity) => {
    map[entity[propertyName]] = entity
    return map
  }, {})
)

/**
 * Map a list of entities by a specified identifier.
 * @param mappedEntities The map of entities
 * @param ids The list of the identifiers.
 */
export const selectByIds = <T>(mappedEntities: MappedEntities<T>, ids: ID[]): Entity<T>[] => (
  ids.map(id => mappedEntities[id])
)
