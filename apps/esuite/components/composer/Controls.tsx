import { RectangleHorizontal } from '@/components/icons/RectangleHorizontal'
import { RectangleVertical } from '@/components/icons/RectangleVertical'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Select } from '@radix-ui/themes'

export const QuantitySelect = ({
  max,
  ...props
}: { max: number } & React.ComponentProps<typeof Select.Root>) => {
  return (
    <Select.Root {...props}>
      <Select.Trigger placeholder="Quantity" className="min-w-24" variant="soft" color="gray" />
      <Select.Content variant="soft" color="gray">
        <Select.Group>
          <Select.Label>Quantity</Select.Label>
          <Select.Item value="1">
            <div className="flex items-center gap-1">
              <Icons.Stop className="size-5 shrink-0 -scale-75" />
              Single
            </div>
          </Select.Item>
          <Select.Item value="2" disabled={max < 2}>
            <div className="flex items-center gap-1">
              <Icons.Copy className="size-5 shrink-0 -scale-75" />
              Double
            </div>
          </Select.Item>

          <Select.Item value="4" className="items-center" disabled={max < 4}>
            <div className="flex items-center gap-1">
              <Icons.GridFour className="size-5 shrink-0" />
              Grid
            </div>
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
}

export const DimensionsSelect = (props: React.ComponentProps<typeof Select.Root>) => {
  return (
    <Select.Root {...props}>
      <Select.Trigger placeholder="Dimensions" className="min-w-24" variant="soft" color="gray" />
      <Select.Content variant="soft" color="gray">
        <Select.Group>
          <Select.Label>Dimensions</Select.Label>
          <Select.Item value="portrait">
            <div className="flex items-center gap-1">
              <RectangleVertical className="size-4 shrink-0" />
              Portrait
            </div>
          </Select.Item>
          <Select.Item value="square" className="items-center">
            <div className="flex items-center gap-1">
              <Icons.Square className="size-4 shrink-0" />
              Square
            </div>
          </Select.Item>
          <Select.Item value="landscape">
            <div className="flex items-center gap-1">
              <RectangleHorizontal className="size-4 shrink-0" />
              Landscape
            </div>
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
}
