import { Navigation } from '@/components/navigation/Navigation'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import * as Toggle from '@radix-ui/react-toggle'

export const NavigationRail = () => {
  return (
    <div className="z-20 hidden w-11 shrink-0 md:block [&:has(button[data-state=on])]:w-60">
      <Navigation className="w-11 rounded-md border transition-all hover:w-60 [&:has(button[data-state=on])]:w-60">
        <Toggle.Root className="text-gray-11 outline-accentA-8 hover:bg-grayA-2 data-[state=on]:text-accent-11 absolute left-48 top-1 z-10 flex size-10 items-center justify-center rounded">
          <Icons.SidebarSimple size={24} />
        </Toggle.Root>
      </Navigation>
    </div>
  )
}
