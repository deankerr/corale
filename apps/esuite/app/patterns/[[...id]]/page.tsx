import { PatternEditorPage } from '@corale/esuite/components/patterns/PatternEditor'

export default function Page({ params }: { params: { id?: string[] } }) {
  return <PatternEditorPage xid={params.id?.[0]} />
}
