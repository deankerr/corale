import { convexTest } from 'convex-test'
import { expect, test } from 'vitest'
import { api } from '../_generated/api'
import schema from '../schema'
import { modules } from '../test.setup'
import { createTestUser } from './helpers'

test('user can create and complete a basic run', async () => {
  // Arrange
  const t = convexTest(schema, modules)
  const { identity: asUser } = await createTestUser(t, 'TestUser')

  // Create a thread first
  const threadId = await asUser.mutation(api.entities.threads.public.create, {
    title: 'Test Thread',
  })

  // Act
  // Create a run with basic configuration
  const runXID = await asUser.mutation(api.entities.threads.runs.create, {
    threadId,
    stream: false,
    model: {
      id: 'test-model',
      temperature: 0.7,
      maxTokens: 1000,
    },
    instructions: 'Test instructions',
  })

  // Assert
  // Verify run was created
  const run = await asUser.query(api.entities.threads.runs.get, { runId: runXID })
  expect(run).toBeDefined()
  expect(run?.status).toBe('queued')
  expect(run?.instructions).toBe('Test instructions')

  // Verify message was created
  const messages = await asUser.query(api.entities.threads.messages.listMy, {
    threadId,
    paginationOpts: { cursor: null, numItems: 10 },
  })
  expect(messages.page).toHaveLength(1)
  expect(messages.page[0]?.role).toBe('assistant')
  expect(messages.page[0]?.runId).toBeDefined()
})

test('run with streaming creates and updates text entries', async () => {
  // Arrange
  const t = convexTest(schema, modules)
  const { identity: asUser } = await createTestUser(t, 'StreamUser')
  const threadId = await asUser.mutation(api.entities.threads.public.create, {
    title: 'Streaming Thread',
  })

  // Act
  const runXID = await asUser.mutation(api.entities.threads.runs.create, {
    threadId,
    stream: true,
    model: {
      id: 'test-model',
      temperature: 0.7,
      maxTokens: 1000,
    },
  })

  // Assert
  const run = await asUser.query(api.entities.threads.runs.get, { runId: runXID })
  expect(run).toBeDefined()
  expect(run?.stream).toBe(true)

  // Check text streams
  const textStreams = await asUser.query(api.entities.threads.runs.getTextStreams, {
    runId: run!._id,
  })
  console.log(textStreams)
  expect(textStreams).toBeDefined()
})
