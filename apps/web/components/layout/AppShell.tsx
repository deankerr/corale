import { NavigationRail } from '@/components/navigation/NavigationRail'

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-dvh md:gap-1.5 md:p-1.5" id="app-shell" vaul-drawer-wrapper="">
      <NavigationRail />
      {children}
    </div>
  )
}
