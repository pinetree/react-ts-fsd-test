import './skeleton.css'

export interface ISkeleton {
  className?: string
}

export interface ISkeletonLine extends ISkeleton {
  width?: string
  height?: string
  inline?: boolean
  animated?: boolean
}

export const SkeletonLine = ({
  width,
  height,
  inline,
  animated = true,
  className,
}: ISkeletonLine) => {
  const style = { width, height }

  return (
    <div
      className={`skeleton ${inline ? 'inline' : ''} ${
        animated ? 'animated' : ''
      } ${className}`}
      style={style}
    >
      &nbsp;
    </div>
  )
}
