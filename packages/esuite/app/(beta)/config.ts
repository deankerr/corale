import * as Icons from '@phosphor-icons/react/dist/ssr'

const nav = {
  root: '/xsb',
  routes: [
    {
      title: 'Chats',
      icon: Icons.Chat,
      route: 'chats',
      url: '/xsb/chats',
    },
    {
      title: 'Patterns',
      icon: Icons.CodesandboxLogo,
      route: 'patterns',
      url: '/xsb/patterns',
    },
    {
      title: 'Generations',
      icon: Icons.Sparkle,
      route: 'generations',
      url: '/xsb/generations',
    },
    {
      title: 'Collections',
      icon: Icons.FolderStar,
      route: 'collections',
      url: '/xsb/collections',
    },
  ],
}

export const config = { nav }
