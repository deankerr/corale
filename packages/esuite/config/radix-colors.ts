function createFullScale(name: string) {
  const steps = [...Array(12)].map((_, i) => [i + 1, `var(--${name}${i + 1})`])
  const functional = [
    ['surface', `var(--${name}surface)`],
    ['indicator', `var(--${name}indicator)`],
    ['track', `var(--${name}track)`],
    ['contrast', `var(--${name}contrast)`],
  ]

  return Object.fromEntries([...steps, ...functional])
}

// * css variables
function createRadixColors() {
  const scale = (key: string) => Object.fromEntries([...Array(12)].map((_, i) => [i + 1, `var(--${key}${i + 1})`]))

  return {
    blackA: scale('black-a'),
    whiteA: scale('white-a'),
    accent: createFullScale('accent-'),
    accentA: createFullScale('accent-a'),
    gray: createFullScale('gray-'),
    grayA: createFullScale('gray-a'),
    mauve: createFullScale('mauve-'),
    mauveA: createFullScale('mauve-a'),
    gold: createFullScale('gold-'),
    goldA: createFullScale('gold-a'),
    bronze: createFullScale('bronze-'),
    bronzeA: createFullScale('bronze-a'),
    brown: createFullScale('brown-'),
    brownA: createFullScale('brown-a'),
    yellow: createFullScale('yellow-'),
    yellowA: createFullScale('yellow-a'),
    amber: createFullScale('amber-'),
    amberA: createFullScale('amber-a'),
    orange: createFullScale('orange-'),
    orangeA: createFullScale('orange-a'),
    tomato: createFullScale('tomato-'),
    tomatoA: createFullScale('tomato-a'),
    red: createFullScale('red-'),
    redA: createFullScale('red-a'),
    ruby: createFullScale('ruby-'),
    rubyA: createFullScale('ruby-a'),
    crimson: createFullScale('crimson-'),
    crimsonA: createFullScale('crimson-a'),
    pink: createFullScale('pink-'),
    pinkA: createFullScale('pink-a'),
    plum: createFullScale('plum-'),
    plumA: createFullScale('plum-a'),
    purple: createFullScale('purple-'),
    purpleA: createFullScale('purple-a'),
    violet: createFullScale('violet-'),
    violetA: createFullScale('violet-a'),
    iris: createFullScale('iris-'),
    irisA: createFullScale('iris-a'),
    indigo: createFullScale('indigo-'),
    indigoA: createFullScale('indigo-a'),
    blue: createFullScale('blue-'),
    blueA: createFullScale('blue-a'),
    cyan: createFullScale('cyan-'),
    cyanA: createFullScale('cyan-a'),
    teal: createFullScale('teal-'),
    tealA: createFullScale('teal-a'),
    jade: createFullScale('jade-'),
    jadeA: createFullScale('jade-a'),
    green: createFullScale('green-'),
    greenA: createFullScale('green-a'),
    grass: createFullScale('grass-'),
    grassA: createFullScale('grass-a'),
    lime: createFullScale('lime-'),
    limeA: createFullScale('lime-a'),
    mint: createFullScale('mint-'),
    mintA: createFullScale('mint-a'),
    sky: createFullScale('sky-'),
    skyA: createFullScale('sky-a'),
  }
}

const colors = {
  css: createRadixColors(),
}

export default colors
