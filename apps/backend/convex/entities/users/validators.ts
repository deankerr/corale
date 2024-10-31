import { literals, v, withSystemFields } from '../../values'

export const UserSchemaFields = {
  name: v.string(),
  imageUrl: v.string(),
  role: literals('user', 'admin'),
}

export const UserReturn = v.object(withSystemFields('users', UserSchemaFields))

export const UsersApiKeysSchemaFields = {
  valid: v.boolean(),
}
