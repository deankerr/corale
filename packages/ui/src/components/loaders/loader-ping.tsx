import styles from './loader-ping.module.css'

interface PulseLoaderProps {
  size?: number
  color?: string
  speed?: number
}

export const LoaderPing = ({ size = 40, color = 'currentColor', speed = 2 }: PulseLoaderProps) => {
  return (
    <div
      className={styles.container}
      style={
        {
          '--uib-size': `${size}px`,
          '--uib-color': color,
          '--uib-speed': `${speed}s`,
        } as React.CSSProperties
      }
    />
  )
}
