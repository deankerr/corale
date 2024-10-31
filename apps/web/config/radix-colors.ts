// prettier-ignore
const colorNames = ['accent', 'gray', 'mauve', 'slate', 'sage', 'olive', 'sand', 'tomato', 'red', 'ruby', 'crimson', 'pink', 'plum', 'purple', 'violet', 'iris', 'indigo', 'blue', 'cyan', 'teal', 'jade', 'green', 'grass', 'bronze', 'gold', 'brown', 'orange', 'amber', 'yellow', 'lime', 'mint', 'sky'] as const

type ScaleStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type SolidColorScale = Record<ScaleStep, string>
type AlphaColorScale = Record<`a${ScaleStep}`, string>
type FunctionalScale = Record<'surface' | 'indicator' | 'track' | 'contrast', string>

type PrimaryColor = (typeof colorNames)[number]
type ColorName = PrimaryColor | 'black' | 'white'

type RadixColors = Record<PrimaryColor, SolidColorScale & AlphaColorScale & FunctionalScale> & {
  black: AlphaColorScale
  white: AlphaColorScale
}

function createSolidScale(name: ColorName) {
  return [...Array(12)].map((_, i) => [i + 1, `var(--${name}-${i + 1})`])
}

function createAlphaScale(name: ColorName) {
  return [...Array(12)].map((_, i) => [`a${i + 1}`, `var(--${name}-a${i + 1})`])
}

function createFunctionalSteps(name: ColorName) {
  return ['surface', 'indicator', 'track', 'contrast'].map((key) => [key, `var(--${name}-${key})`])
}

function createRadixColors() {
  const colors = {} as RadixColors

  colorNames.forEach((name) => {
    colors[name] = Object.fromEntries([
      ...createSolidScale(name),
      ...createAlphaScale(name),
      ...createFunctionalSteps(name),
    ])
  })

  colors.black = Object.fromEntries([...createAlphaScale('black'), ['DEFAULT', '#000000']])
  colors.white = Object.fromEntries([...createAlphaScale('white'), ['DEFAULT', '#FFFFFF']])

  return colors
}

const colors = {
  css: createRadixColors(),
}

export default colors
