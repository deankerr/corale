'use client'

import { AudioPlayer, AudioPlayerSkeleton } from '@/components/audio/AudioPlayerLoader'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Panel } from '@/components/ui/Panel'
import { useMyAudioList } from '@/lib/api/audio'
import { api } from '@corale/api'
import { Card, TextArea } from '@radix-ui/themes'
import { useAction } from 'convex/react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Page() {
  const audio = useMyAudioList()

  const sendGenerate = useAction(api.entities.audio.generate.soundEffect)
  const [promptValue, setPromptValue] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerating = () => {
    if (!promptValue || isGenerating) return
    setIsGenerating(true)
    sendGenerate({ text: promptValue })
      .catch((err) => {
        console.error(err)
        toast.error('An error occurred.')
      })
      .then((xid) => setPromptValue(''))
      .finally(() => setIsGenerating(false))
  }

  return (
    <Panel>
      <div className="p-4">
        <Card className="max-w-xs space-y-4" size="2">
          <div className="text-base font-medium">Generate Sound Effect</div>
          <Label>
            Prompt
            <TextArea value={promptValue} onChange={(e) => setPromptValue(e.target.value)} disabled={isGenerating} />
          </Label>

          <div className="flex-end">
            <Button variant="surface" onClick={handleGenerating} loading={isGenerating}>
              Generate
            </Button>
          </div>
        </Card>
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        {audio.results.map((audio) =>
          audio.fileUrl ? (
            <AudioPlayer key={audio._id} url={audio.fileUrl} titleText={audio.generationData.prompt} />
          ) : (
            <AudioPlayerSkeleton key={audio._id} />
          ),
        )}
      </div>
    </Panel>
  )
}
