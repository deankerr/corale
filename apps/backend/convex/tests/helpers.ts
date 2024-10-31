import type { TestConvex } from 'convex-test'
import { internal } from '../_generated/api'
import type schema from '../schema'

export async function createTestUser(t: TestConvex<typeof schema>, name: string) {
  const tokenIdentifier = `test.convex.dev|user_${name}`

  await t.mutation(internal.entities.users.internal.create, {
    fields: {
      name,
      imageUrl: `https://example.com/${name}.jpg`,
      role: 'user',
      tokenIdentifier,
    },
  })

  return {
    identity: t.withIdentity({ tokenIdentifier }),
    tokenIdentifier,
  }
}
