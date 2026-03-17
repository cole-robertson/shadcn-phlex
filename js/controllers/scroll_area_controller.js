import { Controller } from "@hotwired/stimulus"

// Replicates Radix ScrollArea behavior
// Custom scrollbar overlay, tracks scroll position
export default class extends Controller {
  static targets = ["viewport", "scrollbar", "thumb"]
  static values = {
    orientation: { type: String, default: "vertical" },
  }

  connect() {
    this._onScroll = this._handleScroll.bind(this)
    this._onPointerDown = this._handlePointerDown.bind(this)
    this._onPointerMove = this._handlePointerMove.bind(this)
    this._onPointerUp = this._handlePointerUp.bind(this)
    this._dragging = false

    if (this.hasViewportTarget) {
      this.viewportTarget.addEventListener("scroll", this._onScroll, { passive: true })
    }

    this._updateThumb()

    // Auto-hide scrollbar when not needed
    this._observer = new ResizeObserver(() => this._updateThumb())
    if (this.hasViewportTarget) {
      this._observer.observe(this.viewportTarget)
    }
  }

  disconnect() {
    if (this.hasViewportTarget) {
      this.viewportTarget.removeEventListener("scroll", this._onScroll)
    }
    this._observer?.disconnect()
    document.removeEventListener("pointermove", this._onPointerMove)
    document.removeEventListener("pointerup", this._onPointerUp)
  }

  startDrag(event) {
    event.preventDefault()
    this._dragging = true
    this._dragStart = this.orientationValue === "vertical" ? event.clientY : event.clientX
    this._scrollStart = this.orientationValue === "vertical"
      ? this.viewportTarget.scrollTop
      : this.viewportTarget.scrollLeft
    document.addEventListener("pointermove", this._onPointerMove)
    document.addEventListener("pointerup", this._onPointerUp)
  }

  _handleScroll() {
    this._updateThumb()
  }

  _handlePointerDown(event) {
    this.startDrag(event)
  }

  _handlePointerMove(event) {
    if (!this._dragging || !this.hasViewportTarget) return

    const viewport = this.viewportTarget
    const isVertical = this.orientationValue === "vertical"

    const delta = isVertical
      ? event.clientY - this._dragStart
      : event.clientX - this._dragStart

    const viewportSize = isVertical ? viewport.clientHeight : viewport.clientWidth
    const scrollSize = isVertical ? viewport.scrollHeight : viewport.scrollWidth
    const scrollRatio = scrollSize / viewportSize

    if (isVertical) {
      viewport.scrollTop = this._scrollStart + delta * scrollRatio
    } else {
      viewport.scrollLeft = this._scrollStart + delta * scrollRatio
    }
  }

  _handlePointerUp() {
    this._dragging = false
    document.removeEventListener("pointermove", this._onPointerMove)
    document.removeEventListener("pointerup", this._onPointerUp)
  }

  _updateThumb() {
    if (!this.hasViewportTarget || !this.hasThumbTarget) return

    const viewport = this.viewportTarget
    const isVertical = this.orientationValue === "vertical"

    const viewportSize = isVertical ? viewport.clientHeight : viewport.clientWidth
    const scrollSize = isVertical ? viewport.scrollHeight : viewport.scrollWidth
    const scrollPos = isVertical ? viewport.scrollTop : viewport.scrollLeft

    if (scrollSize <= viewportSize) {
      // No scroll needed, hide scrollbar
      this.scrollbarTargets.forEach((el) => { el.style.display = "none" })
      return
    }

    this.scrollbarTargets.forEach((el) => { el.style.display = "" })

    const thumbSize = Math.max((viewportSize / scrollSize) * viewportSize, 20)
    const thumbPos = (scrollPos / (scrollSize - viewportSize)) * (viewportSize - thumbSize)

    this.thumbTargets.forEach((thumb) => {
      if (isVertical) {
        thumb.style.height = `${thumbSize}px`
        thumb.style.transform = `translateY(${thumbPos}px)`
      } else {
        thumb.style.width = `${thumbSize}px`
        thumb.style.transform = `translateX(${thumbPos}px)`
      }
    })
  }
}
