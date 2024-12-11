import { AppLogoIcon } from '@corale/ui/icons/AppLogoIcon'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="grid min-h-screen items-center justify-items-center p-8 sm:p-20">
      <Link href="/chat">
        <AppLogoIcon className="w-48 text-gray-500" />
      </Link>
    </div>
  )
}
