import { twx } from '@/app/lib/utils'
import { Link } from '@/components/ui/Link'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import NextLink from 'next/link'
import { Loader } from './Loader'

export const Panel = twx.div`flex h-full w-full flex-col text-sm overflow-hidden bg-gray-1 md:rounded-md md:border`
export const PanelHeader = twx.div`flex-start h-10 shrink-0 overflow-hidden border-b px-1 font-medium`
export const PanelTitle = twx(NextLink)`font-medium underline-offset-4 hover:underline`
export const PanelToolbar = twx.div`flex-start h-10 border-b overflow-hidden w-full shrink-0 gap-1 px-1`

export const PanelBodyGrid = twx.div`grid grow grid-flow-col overflow-hidden`
export const PanelBody = twx.div`col-start-1 row-start-1 overflow-hidden bg-gray-1`

export const NavPanel = twx(Panel)`sm:w-72 shrink-0 `

export const PanelLoading = () => {
  return (
    <Panel>
      <div className="flex-center grow">
        <Loader type="grid" />
      </div>
    </Panel>
  )
}

export const PanelEmpty = () => {
  return (
    <Panel>
      <div className="flex-col-center grow">
        <Icons.Cat weight="thin" className="size-64 shrink-0 text-accentA-11 opacity-60" />

        <div className="my-8 font-mono text-lg">
          There doesn&apos;t appear to be anything at this address
        </div>

        <Link href="/">Home</Link>
      </div>
    </Panel>
  )
}
