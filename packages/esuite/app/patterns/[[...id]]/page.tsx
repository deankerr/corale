import { PatternEditorPage } from '@/components/patterns/PatternEditor'

export default function Page({ params }: { params: { id?: string[] } }) {
  return <PatternEditorPage patternId={params.id?.[0]} />
}
