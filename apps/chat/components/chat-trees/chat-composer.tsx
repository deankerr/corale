import { Button } from '@corale/ui/components/ui/button'
import { useInputAtom } from '../chat-thread/store'
import { TextareaAutosize } from '../textarea-autosize'

export const ChatComposer = (props: {
  inputId: string
  onSend?: (args: { text: string; mode: 'run' | 'add' }) => unknown
}) => {
  const [text, setText] = useInputAtom(props.inputId, 'composer')

  const handleSend = (mode: 'run' | 'add') => {
    props.onSend?.({ text, mode })
    setText('')
  }

  return (
    <div className="bg-background w-full overflow-hidden rounded-md border shadow-xl">
      <TextareaAutosize
        className="resize-none border-none"
        borderWidth={0}
        placeholder="Where do you want to go today?"
        rows={1}
        value={text}
        onValueChange={setText}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleSend('run')
          }
        }}
      />

      <div className="flex p-2 pt-0">
        <div className="mx-1 grow" />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => handleSend('add')}>
            Add
          </Button>
          <Button onClick={() => handleSend('run')}>Run</Button>
        </div>
      </div>
    </div>
  )
}
