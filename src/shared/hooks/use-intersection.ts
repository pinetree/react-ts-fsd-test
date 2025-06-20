import { useEffect, useRef } from 'react'

export const useIntersection = (
  callback: (target: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit
) => {
  const targetRef = useRef<HTMLDivElement>(null)

  // Мы не можем гарантировать, что ссылка на callback будет стабильной
  // Поэтому используем useRef чтобы сохранить ссылку
  // Теперь не нужно добавлять callback в массив зависимостей useEffect
  const callbackRef = useRef(callback)

  if (callbackRef.current !== callback) {
    callbackRef.current = callback
  }

  useEffect(() => {
    const element = targetRef.current

    if (!element) return

    const observer = new IntersectionObserver(entries => {
      const [target] = entries
      callbackRef.current(target)
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  // Хотелось бы и options не добавлять в массив зависимостей, но тут уже оставляем на откуп потребителям, 
  // чаще всего options - это константа, которая не должна пересоздаваться
  }, [options])

  return targetRef
}
