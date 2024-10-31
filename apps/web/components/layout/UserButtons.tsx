import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'

export const UserButtons = () => {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <IconButton variant="outline" radius="full" className="size-7">
            <Icons.User weight="light" className="size-5" />
          </IconButton>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton
          appearance={{
            elements: { userButtonPopoverCard: { pointerEvents: 'initial' } },
          }}
        />
      </SignedIn>
    </>
  )
}
