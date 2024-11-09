import * as Icons from '@phosphor-icons/react/dist/ssr'

const nav = {
  routes: [
    {
      title: 'Chats',
      icon: Icons.Chat,
      path: '/xsb/chats',
    },
    {
      title: 'Patterns',
      icon: Icons.CodesandboxLogo,
      path: '/xsb/patterns',
    },
    {
      title: 'Generations',
      icon: Icons.Sparkle,
      path: '/xsb/generations',
    },
    {
      title: 'Collections',
      icon: Icons.FolderStar,
      path: '/xsb/collections',
    },
    {
      title: 'Models',
      icon: Icons.Robot,
      path: '/xsb/models',
    },
    {
      title: 'Artifacts',
      icon: Icons.CodeBlock,
      path: '/arc',
    },
  ],
}

export const config = { nav }
