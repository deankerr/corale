import * as Icons from '@phosphor-icons/react/dist/ssr'

const nav = {
  root: '/xsb',
  routes: [
    {
      title: 'Chats',
      icon: Icons.Chat,
      route: 'chats',
    },
    {
      title: 'Patterns',
      icon: Icons.CodesandboxLogo,
      route: 'patterns',
    },
    {
      title: 'Generations',
      icon: Icons.Sparkle,
      route: 'generations',
    },
    {
      title: 'Collections',
      icon: Icons.FolderStar,
      route: 'collections',
    },
    {
      title: 'Models',
      icon: Icons.Robot,
      route: 'models',
    },
  ],
}

export const config = { nav }
