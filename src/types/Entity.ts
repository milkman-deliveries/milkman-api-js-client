import { ID } from './ID'

export const ID_PROPERTY = 'id'

export interface GenericEntityIdentifier {
  [ID_PROPERTY]: ID
}

export type Entity<T = GenericEntityIdentifier> = object & {
  [key in keyof T]: ID
}