import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="grid h-screen place-content-center">
      <SignIn />
    </div>
  )
}
