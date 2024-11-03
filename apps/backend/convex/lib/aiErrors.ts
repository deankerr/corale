import {
  AISDKError,
  APICallError,
  EmptyResponseBodyError,
  InvalidPromptError,
  InvalidResponseDataError,
  JSONParseError,
  LoadAPIKeyError,
  NoContentGeneratedError,
  NoSuchModelError,
  TypeValidationError,
  UnsupportedFunctionalityError,
} from 'ai'

export type AIErrorCode =
  | 'api_error'
  | 'empty_response'
  | 'invalid_prompt'
  | 'invalid_response'
  | 'json_parse_error'
  | 'missing_api_key'
  | 'no_content'
  | 'model_not_found'
  | 'type_validation'
  | 'unsupported_feature'
  | 'unknown_error'

export type StructuredAIError = {
  code: AIErrorCode
  message: string
  details?: Record<string, unknown>
}

export function parseAIError(error: unknown): StructuredAIError {
  // Handle AI SDK specific errors
  if (AISDKError.isInstance(error)) {
    if (APICallError.isInstance(error)) {
      return {
        code: 'api_error',
        message: error.message,
        details: {
          statusCode: error.statusCode,
          isRetryable: error.isRetryable,
          url: error.url,
        },
      }
    }

    if (EmptyResponseBodyError.isInstance(error)) {
      return {
        code: 'empty_response',
        message: 'The AI provider returned an empty response',
      }
    }

    if (InvalidPromptError.isInstance(error)) {
      return {
        code: 'invalid_prompt',
        message: error.message,
        details: {
          prompt: error.prompt,
        },
      }
    }

    if (InvalidResponseDataError.isInstance(error)) {
      return {
        code: 'invalid_response',
        message: error.message,
        details: {
          data: error.data,
        },
      }
    }

    if (JSONParseError.isInstance(error)) {
      return {
        code: 'json_parse_error',
        message: 'Failed to parse JSON response from AI provider',
        details: {
          text: error.text,
        },
      }
    }

    if (LoadAPIKeyError.isInstance(error)) {
      return {
        code: 'missing_api_key',
        message: 'AI provider API key is missing or invalid',
      }
    }

    if (NoContentGeneratedError.isInstance(error)) {
      return {
        code: 'no_content',
        message: 'The AI model failed to generate any content',
      }
    }

    if (NoSuchModelError.isInstance(error)) {
      return {
        code: 'model_not_found',
        message: `AI model "${error.modelId}" not found`,
        details: {
          modelId: error.modelId,
          modelType: error.modelType,
        },
      }
    }

    if (TypeValidationError.isInstance(error)) {
      return {
        code: 'type_validation',
        message: 'Type validation failed for AI response',
        details: {
          value: error.value,
        },
      }
    }

    if (UnsupportedFunctionalityError.isInstance(error)) {
      return {
        code: 'unsupported_feature',
        message: `Unsupported AI functionality: ${error.functionality}`,
        details: {
          functionality: error.functionality,
        },
      }
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    return {
      code: 'unknown_error',
      message: error.message,
      details: {
        name: error.name,
        stack: error.stack,
      },
    }
  }

  // Fallback for unknown error types
  return {
    code: 'unknown_error',
    message: 'An unknown error occurred',
    details: {
      error,
    },
  }
}
