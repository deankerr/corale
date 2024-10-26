import { PatternEditorPage } from '@/components/patterns/PatternEditor'

export default async function Page(props: { params: Promise<{ id?: string[] }> }) {
  const params = await props.params;
  return <PatternEditorPage patternId={params.id?.[0]} />
}
