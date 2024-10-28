import { literals, v, withSystemFields } from '../../values'

export const OperationsEventLogSchemaFields = {
  type: literals('debug', 'info', 'notice', 'warning', 'error'),
  message: v.string(),
  data: v.optional(v.any()),
}

export const OperationsEventLogReturn = v.object(
  withSystemFields('operations_event_logs', {
    ...OperationsEventLogSchemaFields,
    ack: v.boolean(),
  }),
)
