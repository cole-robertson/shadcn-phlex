import { Controller } from "@hotwired/stimulus"

// Replicates Radix Tooltip behavior
// Show on hover/focus with delay, hide on leave/blur, positioning
export default class extends Controller {
  static targets = ["trigger", "content"]
  static values = {
    open: { type: Boolean, default: false },
    side: { type: String, default: "top" },
    sideOffset: { type: Number, default: 4 },
    delayDuration: { type: Number, default: 200 },
    skipDelayDuration: { type: Number, default: 300 },
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

  mouseEnter() {
    clearTimeout(this._hideTimeout)
    this._showTimeout = setTimeout(() => { this.openValue = true }, this.delayDurationValue)
  }

  mouseLeave() {
    clearTimeout(this._showTimeout)
    this._hideTimeout = setTimeout(() => { this.openValue = false }, 100)
  }

  focusIn() {
    clearTimeout(this._hideTimeout)
    this.openValue = true
  }

  focusOut() {
    this.openValue = false
  }

  contentMouseEnter() {
    clearTimeout(this._hideTimeout)
  }

  contentMouseLeave() {
    this._hideTimeout = setTimeout(() => { this.openValue = false }, 100)
  }

  openValueChanged() { this._syncState() }

  _syncState() {
    const state = this.openValue ? "open" : "closed"
    this.element.dataset.state = state

    this.contentTargets.forEach((el) => {
      el.dataset.state = state
      if (this.openValue) {
        el.hidden = false
        el.setAttribute("role", "tooltip")
        this._position(el)
      } else {
        this._hideAfterAnimation(el)
      }
    })

    // Link trigger aria-describedby
    if (this.hasTriggerTarget && this.hasContentTarget) {
      if (this.openValue) {
        const id = this._ensureId(this.contentTarget, "tooltip")
        this.triggerTarget.setAttribute("aria-describedby", id)
      } else {
        this.triggerTarget.removeAttribute("aria-describedby")
      }
    }
  }

  _position(content) {
    const trigger = this.hasTriggerTarget ? this.triggerTarget : null
    if (!trigger) return

    const triggerRect = trigger.getBoundingClientRect()
    const offset = this.sideOffsetValue

    content.style.position = "fixed"
    content.style.zIndex = "50"
    content.style.pointerEvents = "auto"

    // Measure
    const contentRect = content.getBoundingClientRect()
    let top, left

    switch (this.sideValue) {
      case "top":
        top = triggerRect.top - contentRect.height - offset
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2
        content.dataset.side = "top"
        break
      case "bottom":
        top = triggerRect.bottom + offset
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2
        content.dataset.side = "bottom"
        break
      case "left":
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2
        left = triggerRect.left - contentRect.width - offset
        content.dataset.side = "left"
        break
      case "right":
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2
        left = triggerRect.right + offset
        content.dataset.side = "right"
        break
    }

    // Flip if overflowing
    if (this.sideValue === "top" && top < 0) {
      top = triggerRect.bottom + offset
      content.dataset.side = "bottom"
    } else if (this.sideValue === "bottom" && top + contentRect.height > window.innerHeight) {
      top = triggerRect.top - contentRect.height - offset
      content.dataset.side = "top"
    }

    left = Math.max(8, Math.min(left, window.innerWidth - contentRect.width - 8))

    content.style.top = `${top}px`
    content.style.left = `${left}px`
  }

  _hideAfterAnimation(el) {
    this._hideTimeouts.push(setTimeout(() => { if (el.dataset.state === "closed") el.hidden = true }, 150))
  }

  _ensureId(el, prefix) {
    if (!el.id) el.id = `${prefix}-${Math.random().toString(36).slice(2, 9)}`
    return el.id
  }
}
