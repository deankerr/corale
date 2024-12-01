import { Button } from '@corale/ui/components/ui/button'
import { Textarea } from '@corale/ui/components/ui/textarea'
import { useState } from 'react'
import { ComboBoxResponsive } from '../model-picker/model-picker'

export const Composer = (props: { onSend?: (args: { text: string; model: string | null }) => Promise<void> }) => {
  const [text, setText] = useState('')
  const [model, setModel] = useState<string | null>(null)

  const handleRun = () => {
    props.onSend?.({ text, model })
    setText('')
  }

  return (
    <div className="w-full overflow-hidden rounded-md border p-2 shadow-xl">
      <Textarea
        className="resize-none"
        placeholder="Where do you want to go today?"
        autoFocus
        value={text}
        onValueChange={setText}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleRun()
          }
        }}
      />

      <div className="flex pt-2">
        <ComboBoxResponsive model={model} setModel={setModel} />
        {model ?? 'none'}
        <div className="mx-1 grow" />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => props.onSend?.({ text, model: null })}>
            Add
          </Button>
          <Button onClick={handleRun} className="">
            Run
          </Button>
        </div>
      </div>
    </div>
  )
}
