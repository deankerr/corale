// temporary compatibility layout for generations until they are refactored
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-dvh">{children}</div>
}
