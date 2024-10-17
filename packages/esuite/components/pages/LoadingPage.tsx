import { AppLogo } from '@/components/icons/AppLogo'

export const LoadingPage = () => {
  return (
    <div className="flex h-full w-full bg-gray-1">
      <AppLogo className="m-auto size-48 animate-pulse brightness-[.25] saturate-0" />
    </div>
  )
}
