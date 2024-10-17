import { AppLogo } from '@/components/icons/AppLogo'
import { NavigationSheet } from '@/components/navigation/NavigationSheet'
import { IconButton } from '@/components/ui/Button'
import * as Icons from '@phosphor-icons/react/dist/ssr'

export const BlankPage = () => {
  return (
    <div className="flex-col-center h-full w-full bg-gray-1">
      <AppLogo className="size-48 text-gray-3" />
      <NavigationSheet>
        <IconButton variant="ghost" aria-label="Open navigation sheet" className="md:invisible">
          <Icons.List size={20} />
        </IconButton>
      </NavigationSheet>
    </div>
  )
}
