import { TextField } from '@/components/ui/TextField'
import { Slider } from '@radix-ui/themes'

export const SliderWithInput = ({
  label,
  defaultValue,
  value,
  onValueChange,
  min,
  max,
  step,
  disabled,
  ...props
}: {
  label: string
  defaultValue?: number
  value?: number
  onValueChange?: (value: number) => unknown
} & Omit<React.ComponentProps<typeof Slider>, 'defaultValue' | 'value' | 'onValueChange'>) => {
  return (
    <div className="flex items-center gap-2">
      <TextField
        type="number"
        className="w-full max-w-20 px-1 py-0.5 text-right"
        defaultValue={defaultValue}
        value={value}
        onValueChange={(value) => onValueChange?.(Number(value))}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
      <Slider
        {...props}
        defaultValue={defaultValue !== undefined ? [defaultValue] : undefined}
        value={value !== undefined ? [value] : undefined}
        onValueChange={(values) => (values[0] !== undefined && onValueChange ? onValueChange(values[0]) : undefined)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
    </div>
  )
}
