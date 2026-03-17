import { Controller } from "@hotwired/stimulus"

// Replicates Radix Popover behavior
// Click to toggle, close on outside click/escape, positioning
export default class extends Controller {
  static targets = ["trigger", "content", "anchor", "close"]
  static values = {
    open: { type: Boolean, default: false },
    side: { type: String, default: "bottom" },
    align: { type: String, default: "center" },
    sideOffset: { type: Number, default: 4 },
  }

  connect() {
    this._onClickOutside = this._handleClickOutside.bind(this)
    this._onKeydown = this._handleKeydown.bind(this)
    this._onResize = this._handleResize.bind(this)
    this._hideTimeouts = []
    this._syncState()
  }

  disconnect() {
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []
    this._removeListeners()
  }

  toggle() { this.openValue = !this.openValue }
  show() { this.openValue = true }
  hide() { this.openValue = false }

  openValueChanged() { this._syncState() }

  _syncState() {
    if (!this._hideTimeouts) return
    const state = this.openValue ? "open" : "closed"
    this.element.dataset.state = state

    this.triggerTargets.forEach((el) => {
      el.dataset.state = state
      el.setAttribute("aria-expanded", String(this.openValue))
    })

    this.contentTargets.forEach((el) => {
      el.dataset.state = state
      if (this.openValue) {
        el.hidden = false
        this._position(el)
      } else {
        this._hideAfterAnimation(el)
      }
    })

    if (this.openValue) {
      // Delay to avoid closing from the same click
      requestAnimationFrame(() => {
        document.addEventListener("click", this._onClickOutside, true)
      })
      document.addEventListener("keydown", this._onKeydown)
      window.addEventListener("resize", this._onResize)
    } else {
      this._removeListeners()
    }
  }

  _position(content) {
    const anchor = this.hasAnchorTarget ? this.anchorTarget : this.hasTriggerTarget ? this.triggerTarget : null
    if (!anchor) return

    const anchorRect = anchor.getBoundingClientRect()
    const offset = this.sideOffsetValue

    content.style.position = "fixed"
    content.style.zIndex = "50"

    // Calculate position based on side
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

    // Align
    if (this.sideValue === "top" || this.sideValue === "bottom") {
      switch (this.alignValue) {
        case "start": left = anchorRect.left; break
        case "end": left = anchorRect.right - contentRect.width; break
        default: left = anchorRect.left + (anchorRect.width - contentRect.width) / 2
      }
    }

    // Flip if overflowing
    if (top + contentRect.height > window.innerHeight && this.sideValue === "bottom") {
      top = anchorRect.top - contentRect.height - offset
      content.dataset.side = "top"
    } else if (top < 0 && this.sideValue === "top") {
      top = anchorRect.bottom + offset
      content.dataset.side = "bottom"
    }

    // Clamp
    left = Math.max(8, Math.min(left, window.innerWidth - contentRect.width - 8))
    top = Math.max(8, Math.min(top, window.innerHeight - contentRect.height - 8))

    content.style.top = `${top}px`
    content.style.left = `${left}px`
  }

  _handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.hide()
    }
  }

  _handleKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault()
      this.hide()
      this.triggerTargets[0]?.focus()
    }
  }

  _handleResize() {
    if (this.openValue && this.hasContentTarget) {
      this._position(this.contentTarget)
    }
  }

  _removeListeners() {
    document.removeEventListener("click", this._onClickOutside, true)
    document.removeEventListener("keydown", this._onKeydown)
    window.removeEventListener("resize", this._onResize)
  }

  _hideAfterAnimation(el) {
    this._hideTimeouts.push(setTimeout(() => { if (el.dataset.state === "closed") el.hidden = true }, 200))
  }
}
