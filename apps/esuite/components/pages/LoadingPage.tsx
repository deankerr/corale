import { AppLogo } from '@corale/esuite/components/icons/AppLogo'

export const LoadingPage = () => {
  return (
    <div className="bg-gray-1 flex h-full w-full">
      <AppLogo className="m-auto size-48 animate-pulse brightness-[.25] saturate-0" />
    </div>
  )
}
