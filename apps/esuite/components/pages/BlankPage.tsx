import { AppLogo } from '@corale/esuite/components/icons/AppLogo'
import { NavigationSheet } from '@corale/esuite/components/navigation/NavigationSheet'
import { IconButton } from '@corale/esuite/components/ui/Button'
import * as Icons from '@phosphor-icons/react/dist/ssr'

export const BlankPage = () => {
  return (
    <div className="flex-col-center bg-gray-1 h-full w-full">
      <AppLogo className="text-gray-3 size-48" />
      <NavigationSheet>
        <IconButton variant="ghost" aria-label="Open navigation sheet" className="md:invisible">
          <Icons.List size={20} />
        </IconButton>
      </NavigationSheet>
    </div>
  )
}
