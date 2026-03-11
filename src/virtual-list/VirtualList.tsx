import { Component, type JSX, type ComponentChild } from 'preact'

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  renderItem: (item: T, index: number) => ComponentChild
  overscan?: number
  direction?: 'vertical' | 'horizontal'
  className?: string
  style?: JSX.CSSProperties
}

interface VirtualListState {
  scrollOffset: number
}

export class VirtualList<T = unknown> extends Component<VirtualListProps<T>, VirtualListState> {
  private containerRef: HTMLDivElement | null = null

  constructor(props: VirtualListProps<T>) {
    super(props)
    this.state = { scrollOffset: 0 }
    this.onScroll = this.onScroll.bind(this)
  }

  private onScroll(): void {
    if (!this.containerRef) return
    const isHorizontal = this.props.direction === 'horizontal'
    const offset = isHorizontal ? this.containerRef.scrollLeft : this.containerRef.scrollTop
    this.setState({ scrollOffset: offset })
  }

  scrollToIndex(index: number): void {
    if (!this.containerRef) return
    const offset = index * this.props.itemHeight
    const isHorizontal = this.props.direction === 'horizontal'

    if (isHorizontal) {
      this.containerRef.scrollLeft = offset
    } else {
      this.containerRef.scrollTop = offset
    }
  }

  render(): ComponentChild {
    const {
      items,
      itemHeight,
      renderItem,
      overscan = 3,
      direction = 'vertical',
      className = '',
      style = {},
    } = this.props
    const { scrollOffset } = this.state

    if (!items || !items.length) return null

    const isHorizontal = direction === 'horizontal'
    const containerSize = isHorizontal
      ? (this.containerRef?.clientWidth || 1920)
      : (this.containerRef?.clientHeight || 1080)

    const totalSize = items.length * itemHeight
    const startIndex = Math.max(0, Math.floor(scrollOffset / itemHeight) - overscan)
    const endIndex = Math.min(items.length, Math.ceil((scrollOffset + containerSize) / itemHeight) + overscan)

    const visibleItems: JSX.Element[] = []
    for (let i = startIndex; i < endIndex; i++) {
      const offset = i * itemHeight
      const itemStyle: JSX.CSSProperties = isHorizontal
        ? { position: 'absolute', left: `${offset}px`, top: 0, width: `${itemHeight}px`, height: '100%' }
        : { position: 'absolute', top: `${offset}px`, left: 0, height: `${itemHeight}px`, width: '100%' }

      visibleItems.push(
        <div key={i} style={itemStyle}>
          {renderItem(items[i], i)}
        </div>
      )
    }

    const containerStyle: JSX.CSSProperties = {
      ...style,
      position: 'relative',
      overflow: 'hidden',
      ...(isHorizontal
        ? { overflowX: 'auto', whiteSpace: 'nowrap' as const }
        : { overflowY: 'auto' }),
    }

    const innerStyle: JSX.CSSProperties = isHorizontal
      ? { position: 'relative', width: `${totalSize}px`, height: '100%' }
      : { position: 'relative', height: `${totalSize}px`, width: '100%' }

    return (
      <div
        ref={(el) => { this.containerRef = el }}
        class={className}
        style={containerStyle}
        onScroll={this.onScroll}
      >
        <div style={innerStyle}>
          {visibleItems}
        </div>
      </div>
    )
  }
}
