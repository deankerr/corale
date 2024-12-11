import styles from './loader-ripples.module.css'

interface LoaderRipplesProps {
  size?: number
  color?: string
  speed?: number
}

export const LoaderRipples = ({ size = 40, color = 'currentColor', speed = 2 }: LoaderRipplesProps) => {
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
    >
      <div className={styles.dot} />
    </div>
  )
}
