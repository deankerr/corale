import { twx } from '@corale/esuite/app/lib/utils'
import { ScrollArea as ScrollAreaPrimitive } from '@radix-ui/themes'

export const ScrollArea = twx(ScrollAreaPrimitive).attrs({
  scrollbars: 'vertical',
})`grow [&>div>div]:max-w-full`
