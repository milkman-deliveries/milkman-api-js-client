export const allIds = (entities: object[], propertyName: string) => {
  const ids = []
  entities.forEach(entity => {
    const entityIds = entity[propertyName]
    if (Array.isArray(entityIds)) {
      ids.push(entityIds)
    } else {
      ids.push(entityIds)
    }
  })
}

export const byId = entities => entities.reduce((map, entity) => {
  map[entity.id] = entity
}, {})

export const selectId = (mappedEntities, id: (string | number)) => (
  mappedEntities[id]
)

export const selectIds = (mappedEntities, ids: (string | number)[]) => (
  ids.map(id => (
    selectId(mappedEntities, id)
  ))
)
