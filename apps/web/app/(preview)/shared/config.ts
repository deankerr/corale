import * as Icons from '@phosphor-icons/react/dist/ssr'

const nav = {
  routes: [
    {
      title: 'Chats',
      icon: Icons.Chat,
      path: '/chats',
    },
    {
      title: 'Patterns',
      icon: Icons.Drone,
      path: '/patterns',
    },
    {
      title: 'Artifacts',
      icon: Icons.CodeBlock,
      path: '/artifacts',
    },
    {
      title: 'Models',
      icon: Icons.Cube,
      path: '/models',
    },
    {
      title: 'Generations',
      icon: Icons.Sparkle,
      path: '/generations',
    },
    {
      title: 'Collections',
      icon: Icons.FolderStar,
      path: '/collections',
    },
    {
      title: 'Prompts',
      icon: Icons.NotePencil,
      path: '/prompts',
    },
  ],
}

const artifactsVirtualFeed = true

export const config = { nav, artifactsVirtualFeed }
