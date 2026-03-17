import { Controller } from "@hotwired/stimulus"

// Replicates Radix Dialog behavior for Sheet (slide-out panel)
// Same as Dialog but without zoom animation, uses slide instead
export default class extends Controller {
  static targets = ["trigger", "overlay", "content", "close", "title", "description"]
  static values = {
    open: { type: Boolean, default: false },
    side: { type: String, default: "right" },
    closeOnOverlay: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true },
  }

  connect() {
    this._onKeydown = this._handleKeydown.bind(this)
    this._previouslyFocused = null
    this._hideTimeouts = []
    this._syncState()
  }

  disconnect() {
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []
    document.removeEventListener("keydown", this._onKeydown)
    this._unlockScroll()
  }

  toggle() { this.openValue = !this.openValue }
  show() { this.openValue = true }
  hide() { this.openValue = false }

  openValueChanged() { this._syncState() }

  clickOverlay(event) {
    if (this.closeOnOverlayValue && event.target === event.currentTarget) {
      this.hide()
    }
  }

  _syncState() {
    if (!this._hideTimeouts) return
    const state = this.openValue ? "open" : "closed"
    this.element.dataset.state = state

    this.overlayTargets.forEach((el) => {
      el.dataset.state = state
      if (this.openValue) {
        el.hidden = false
      } else {
        this._hideAfterAnimation(el)
      }
    })

    this.contentTargets.forEach((el) => {
      el.dataset.state = state
      el.dataset.side = this.sideValue
      if (this.openValue) {
        el.hidden = false
        el.setAttribute("role", "dialog")
        el.setAttribute("aria-modal", "true")
      } else {
        this._hideAfterAnimation(el)
      }
    })

    if (this.openValue) {
      this._lockScroll()
      document.addEventListener("keydown", this._onKeydown)
      requestAnimationFrame(() => this._trapFocus())
    } else {
      this._unlockScroll()
      document.removeEventListener("keydown", this._onKeydown)
      if (this._previouslyFocused?.focus) {
        this._previouslyFocused.focus()
        this._previouslyFocused = null
      }
    }
  }

  _trapFocus() {
    this._previouslyFocused = document.activeElement
    if (this.hasContentTarget) {
      const focusable = this._getFocusable(this.contentTarget)
      if (focusable.length > 0) focusable[0].focus()
    }
  }

  _handleKeydown(event) {
    if (event.key === "Escape" && this.closeOnEscapeValue) {
      event.preventDefault()
      this.hide()
      return
    }
    if (event.key === "Tab" && this.hasContentTarget) {
      const focusable = this._getFocusable(this.contentTarget)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  _getFocusable(container) {
    return Array.from(container.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )).filter((el) => !el.closest("[hidden]") && el.offsetParent !== null)
  }

  _lockScroll() {
    document.body.style.overflow = "hidden"
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
  }

  _unlockScroll() {
    document.body.style.overflow = ""
    document.body.style.paddingRight = ""
  }

  _hideAfterAnimation(el) {
    const onEnd = () => { if (el.dataset.state === "closed") el.hidden = true; el.removeEventListener("animationend", onEnd) }
    el.addEventListener("animationend", onEnd)
    this._hideTimeouts.push(setTimeout(() => { if (el.dataset.state === "closed") el.hidden = true }, 500))
  }
}
