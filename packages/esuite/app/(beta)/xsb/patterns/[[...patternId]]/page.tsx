import { PatternEditorPage } from '@/components/patterns/PatternEditor'

export default function Page({ params }: { params: { patternId?: string[] } }) {
  return <PatternEditorPage patternId={params.patternId?.[0]} />
}
