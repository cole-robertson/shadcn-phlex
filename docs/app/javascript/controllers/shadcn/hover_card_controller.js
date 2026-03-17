import { Controller } from "@hotwired/stimulus"

// Replicates Radix HoverCard behavior
// Show on hover with delay, content stays open while hovering content
export default class extends Controller {
  static targets = ["trigger", "content"]
  static values = {
    open: { type: Boolean, default: false },
    openDelay: { type: Number, default: 700 },
    closeDelay: { type: Number, default: 300 },
  }

  connect() {
    this._showTimeout = null
    this._hideTimeout = null
    this._hideTimeouts = []
    this._syncState()
  }

  disconnect() {
    clearTimeout(this._showTimeout)
    clearTimeout(this._hideTimeout)
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []
  }

  triggerEnter() {
    clearTimeout(this._hideTimeout)
    this._showTimeout = setTimeout(() => { this.openValue = true }, this.openDelayValue)
  }

  triggerLeave() {
    clearTimeout(this._showTimeout)
    this._hideTimeout = setTimeout(() => { this.openValue = false }, this.closeDelayValue)
  }

  contentEnter() {
    clearTimeout(this._hideTimeout)
  }

  contentLeave() {
    this._hideTimeout = setTimeout(() => { this.openValue = false }, this.closeDelayValue)
  }

  openValueChanged() { this._syncState() }

  _syncState() {
    if (!this._hideTimeouts) return
    const state = this.openValue ? "open" : "closed"

    this.contentTargets.forEach((el) => {
      el.dataset.state = state
      if (this.openValue) {
        el.hidden = false
        this._position(el)
      } else {
        this._hideTimeouts.push(setTimeout(() => { if (el.dataset.state === "closed") el.hidden = true }, 200))
      }
    })
  }

  _position(content) {
    if (!this.hasTriggerTarget) return
    const rect = this.triggerTarget.getBoundingClientRect()

    content.style.position = "fixed"
    content.style.zIndex = "50"

    const contentRect = content.getBoundingClientRect()
    let top = rect.bottom + 4
    let left = rect.left + (rect.width - contentRect.width) / 2

    if (top + contentRect.height > window.innerHeight) {
      top = rect.top - contentRect.height - 4
      content.dataset.side = "top"
    } else {
      content.dataset.side = "bottom"
    }

    left = Math.max(8, Math.min(left, window.innerWidth - contentRect.width - 8))

    content.style.top = `${top}px`
    content.style.left = `${left}px`
  }
}
