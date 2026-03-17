import { Controller } from "@hotwired/stimulus"

// Replicates Radix Collapsible behavior
export default class extends Controller {
  static targets = ["trigger", "content"]
  static values = {
    open: { type: Boolean, default: false },
  }

  connect() {
    this._syncState()
  }

  toggle() {
    this.openValue = !this.openValue
  }

  open() {
    this.openValue = true
  }

  close() {
    this.openValue = false
  }

  openValueChanged() {
    this._syncState()
  }

  _syncState() {
    const state = this.openValue ? "open" : "closed"
    this.element.dataset.state = state

    this.triggerTargets.forEach((trigger) => {
      trigger.dataset.state = state
      trigger.setAttribute("aria-expanded", String(this.openValue))
    })

    this.contentTargets.forEach((content) => {
      if (this.openValue) {
        this._animateOpen(content)
      } else {
        this._animateClose(content)
      }
    })
  }

  _animateOpen(content) {
    content.hidden = false
    content.dataset.state = "open"
    const height = content.scrollHeight
    content.style.height = "0px"
    content.style.overflow = "hidden"
    requestAnimationFrame(() => {
      content.style.transition = "height 200ms ease-out"
      content.style.height = `${height}px`
      const onEnd = () => {
        content.style.height = ""
        content.style.overflow = ""
        content.style.transition = ""
        content.removeEventListener("transitionend", onEnd)
      }
      content.addEventListener("transitionend", onEnd)
    })
  }

  _animateClose(content) {
    const height = content.scrollHeight
    content.dataset.state = "closed"
    content.style.height = `${height}px`
    content.style.overflow = "hidden"
    requestAnimationFrame(() => {
      content.style.transition = "height 200ms ease-out"
      content.style.height = "0px"
      const onEnd = () => {
        content.hidden = true
        content.style.height = ""
        content.style.overflow = ""
        content.style.transition = ""
        content.removeEventListener("transitionend", onEnd)
      }
      content.addEventListener("transitionend", onEnd)
    })
  }
}
