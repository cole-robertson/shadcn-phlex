import { Controller } from "@hotwired/stimulus"

// Replicates Radix Popover behavior
// Uses Stimulus declarative click@window for outside click (no flicker)
export default class extends Controller {
  static targets = ["trigger", "content", "anchor", "close"]
  static values = {
    open: { type: Boolean, default: false },
    side: { type: String, default: "bottom" },
    align: { type: String, default: "center" },
    sideOffset: { type: Number, default: 4 },
  }

  connect() {
    this._hideTimeouts = []
    // Ensure closed on connect
    this.contentTargets.forEach((el) => { el.dataset.state = "closed"; el.hidden = true })
    this.triggerTargets.forEach((el) => { el.dataset.state = "closed"; el.setAttribute("aria-expanded", "false") })
  }

  disconnect() {
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []
    window.removeEventListener("resize", this._onResize)
  }

  toggle() { this.openValue = !this.openValue }

  // Wired as click@window->shadcn--popover#hide on the controller element
  hide(event) {
    if (!this.openValue) return
    if (event && event.target && this.element.contains(event.target)) return
    this.openValue = false
  }

  // Wired as keydown.esc@window->shadcn--popover#hideOnEscape
  hideOnEscape() {
    if (!this.openValue) return
    this.openValue = false
    this.triggerTargets[0]?.focus()
  }

  close() { this.openValue = false }

  openValueChanged() {
    if (!this._hideTimeouts) return
    this._render()
  }

  _render() {
    const open = this.openValue
    const state = open ? "open" : "closed"

    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []

    this.element.dataset.state = state
    this.triggerTargets.forEach((el) => {
      el.dataset.state = state
      el.setAttribute("aria-expanded", String(open))
    })

    this.contentTargets.forEach((el) => {
      if (open) {
        el.getAnimations().forEach(a => a.cancel())
        el.hidden = false
        el.dataset.state = "open"
        requestAnimationFrame(() => this._position(el))
      } else {
        el.dataset.state = "closed"
        const animations = el.getAnimations()
        if (animations.length > 0) {
          Promise.all(animations.map(a => a.finished)).then(() => {
            if (el.dataset.state === "closed") el.hidden = true
          }).catch(() => {})
        } else {
          el.hidden = true
        }
      }
    })

    if (open) {
      this._onResize = () => {
        if (this.openValue && this.hasContentTarget) this._position(this.contentTarget)
      }
      window.addEventListener("resize", this._onResize)
    } else {
      window.removeEventListener("resize", this._onResize)
    }
  }

  _position(content) {
    const anchor = this.hasAnchorTarget ? this.anchorTarget : this.hasTriggerTarget ? this.triggerTarget : null
    if (!anchor) return

    const anchorRect = anchor.getBoundingClientRect()
    const offset = this.sideOffsetValue

    content.style.position = "fixed"
    content.style.zIndex = "50"

    const contentRect = content.getBoundingClientRect()
    let top, left

    switch (this.sideValue) {
      case "top":
        top = anchorRect.top - contentRect.height - offset
        content.dataset.side = "top"
        break
      case "bottom":
        top = anchorRect.bottom + offset
        content.dataset.side = "bottom"
        break
      case "left":
        top = anchorRect.top
        left = anchorRect.left - contentRect.width - offset
        content.dataset.side = "left"
        break
      case "right":
        top = anchorRect.top
        left = anchorRect.right + offset
        content.dataset.side = "right"
        break
      default:
        top = anchorRect.bottom + offset
        content.dataset.side = "bottom"
    }

    if (this.sideValue === "top" || this.sideValue === "bottom") {
      switch (this.alignValue) {
        case "start": left = anchorRect.left; break
        case "end": left = anchorRect.right - contentRect.width; break
        default: left = anchorRect.left + (anchorRect.width - contentRect.width) / 2
      }
    }

    if (top + contentRect.height > window.innerHeight && this.sideValue === "bottom") {
      top = anchorRect.top - contentRect.height - offset
      content.dataset.side = "top"
    } else if (top < 0 && this.sideValue === "top") {
      top = anchorRect.bottom + offset
      content.dataset.side = "bottom"
    }

    left = Math.max(8, Math.min(left, window.innerWidth - contentRect.width - 8))
    top = Math.max(8, Math.min(top, window.innerHeight - contentRect.height - 8))

    content.style.top = `${top}px`
    content.style.left = `${left}px`
  }
}
