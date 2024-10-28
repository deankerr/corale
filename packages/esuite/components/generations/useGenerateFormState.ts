import { imageModelConfig } from '@/config/config'
import { useSessionStorageValue } from '@react-hookz/web'
import { useCallback } from 'react'

type GenerateFormState = {
  modelId: string
  prompt: string
  negativePrompt: string
  quantity: number
  seed: number | undefined
  dimensions: string
  loras: { id: string; path: string; scale: number }[]
}

const defaultValue: GenerateFormState = {
  modelId: imageModelConfig.defaultModel,
  prompt: '',
  negativePrompt: '',
  quantity: 1,
  seed: undefined,
  dimensions: 'square',
  loras: [],
}

export const useGenerateFormState = (storageKey: string) => {
  const { set, ...rest } = useSessionStorageValue<GenerateFormState>(`generation-form-state-${storageKey}`, {
    defaultValue,
    initializeWithValue: false,
  })

  const setState = useCallback(
    (state: Partial<GenerateFormState>) => {
      set((prev) => {
        return {
          ...defaultValue,
          ...prev,
          ...state,
        }
      })
    },
    [set],
  )

  return {
    ...rest,
    setState,
  }
}
