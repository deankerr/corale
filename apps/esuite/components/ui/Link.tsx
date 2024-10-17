import { Link as RadixLink } from '@radix-ui/themes'
import NextLink, { LinkProps } from 'next/link'

export const Link = ({
  href,
  ...props
}: Omit<React.ComponentProps<typeof NextLink>, 'href'> & { href: LinkProps['href'] | null }) => {
  if (href === null) return props.children

  return (
    <RadixLink asChild>
      <NextLink {...props} href={href} />
    </RadixLink>
  )
}
