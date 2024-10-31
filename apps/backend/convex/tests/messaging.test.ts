import { convexTest } from 'convex-test'
import { expect, test } from 'vitest'
import { api } from '../_generated/api'
import schema from '../schema'
import { modules } from '../test.setup'
import { createTestUser } from './helpers'

test('user can create threads and messages', async () => {
  const t = convexTest(schema, modules)

  const { identity: asSarah } = await createTestUser(t, 'Sarah')

  const threadId = await asSarah.mutation(api.entities.threads.public.create, { title: "Sarah's Thread" })

  await asSarah.mutation(api.entities.messages.public.create, {
    threadId,
    text: 'Hello, world!',
    role: 'user',
  })

  await asSarah.mutation(api.entities.messages.public.create, {
    threadId,
    text: 'Hello, again.',
    role: 'user',
  })

  const threads = await asSarah.query(api.entities.threads.public.listMy, {})
  expect(threads).toHaveLength(1)

  const messages = await asSarah.query(api.entities.messages.public.listMy, {
    threadId,
    paginationOpts: { cursor: null, numItems: 10 },
  })
  expect(messages.page).toHaveLength(2)
})
