import { useCallback, useEffect, useState } from 'react'

export interface VirtualItem {
  index: number
  size: number
  start: number
  end: number
}

export interface VirtualizerOptions {
  count: number
  windowSize: number
  getScrollElement: () => HTMLElement
}

export interface VirtualizerState {
  getTotalSize: () => number
  getVirtualItems: () => VirtualItem[]
}

export const useVirtualizer = (
  options: VirtualizerOptions
): VirtualizerState => {
  const { count, windowSize, getScrollElement } = options

  const scrollElement = getScrollElement()
  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = useCallback(() => {
    setScrollPosition(scrollElement.scrollTop)
  }, [scrollElement])

  useEffect(() => {
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll, scrollElement])

  const getTotalSize = () => {
    return getVirtualItems().reduce((acc, item) => acc + item.size, 0)
  }

  const getVirtualItems = () => {
    const items = []
    for (let i = 0; i < count; i++) {
      items.push({
        index: i,
        size: windowSize,
        start: i * windowSize,
        end: (i + 1) * windowSize,
      })
    }
    return items
  }

  return { getTotalSize, getVirtualItems }
}
