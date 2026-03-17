import { Controller } from "@hotwired/stimulus"

// Replicates Radix Dialog behavior
// Focus trap, scroll lock, escape to close, overlay click to close
export default class extends Controller {
  static targets = ["trigger", "overlay", "content", "close", "title", "description"]
  static values = {
    open: { type: Boolean, default: false },
    modal: { type: Boolean, default: true },
    closeOnOverlay: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true },
  }

  connect() {
    this._onKeydown = this._handleKeydown.bind(this)
    this._previouslyFocused = null
    this._syncState()
  }

  disconnect() {
    this._removeListeners()
    this._unlockScroll()
  }

  toggle() {
    this.openValue = !this.openValue
  }

  show() {
    this.openValue = true
  }

  hide() {
    this.openValue = false
  }

  openValueChanged() {
    this._syncState()
  }

  clickOverlay(event) {
    if (this.closeOnOverlayValue && event.target === event.currentTarget) {
      this.hide()
    }
  }

  _syncState() {
    if (this.openValue) {
      this._open()
    } else {
      this._close()
    }
  }

  _open() {
    this._previouslyFocused = document.activeElement

    this.element.dataset.state = "open"

    this.overlayTargets.forEach((el) => {
      el.dataset.state = "open"
      el.hidden = false
    })

    this.contentTargets.forEach((el) => {
      el.dataset.state = "open"
      el.hidden = false
      el.setAttribute("role", "dialog")
      el.setAttribute("aria-modal", String(this.modalValue))

      // Link title/description for ARIA
      if (this.hasTitleTarget) {
        const titleId = this._ensureId(this.titleTarget, "dialog-title")
        el.setAttribute("aria-labelledby", titleId)
      }
      if (this.hasDescriptionTarget) {
        const descId = this._ensureId(this.descriptionTarget, "dialog-desc")
        el.setAttribute("aria-describedby", descId)
      }
    })

    if (this.modalValue) {
      this._lockScroll()
    }

    document.addEventListener("keydown", this._onKeydown)

    // Focus first focusable element in content
    requestAnimationFrame(() => {
      if (this.hasContentTarget) {
        const focusable = this._getFocusableElements(this.contentTarget)
        if (focusable.length > 0) {
          focusable[0].focus()
        }
      }
    })
  }

  _close() {
    this.element.dataset.state = "closed"

    this.overlayTargets.forEach((el) => {
      el.dataset.state = "closed"
      // Delay hiding for exit animation
      this._hideAfterAnimation(el)
    })

    this.contentTargets.forEach((el) => {
      el.dataset.state = "closed"
      this._hideAfterAnimation(el)
    })

    this._removeListeners()
    this._unlockScroll()

    // Restore focus
    if (this._previouslyFocused && this._previouslyFocused.focus) {
      this._previouslyFocused.focus()
      this._previouslyFocused = null
    }
  }

  _handleKeydown(event) {
    if (event.key === "Escape" && this.closeOnEscapeValue) {
      event.preventDefault()
      event.stopPropagation()
      this.hide()
      return
    }

    // Focus trap
    if (event.key === "Tab" && this.modalValue && this.hasContentTarget) {
      const focusable = this._getFocusableElements(this.contentTarget)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
  }

  _getFocusableElements(container) {
    const selector = [
      'a[href]', 'button:not([disabled])', 'input:not([disabled])',
      'select:not([disabled])', 'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])', '[contenteditable]'
    ].join(", ")
    return Array.from(container.querySelectorAll(selector)).filter(
      (el) => !el.closest("[hidden]") && el.offsetParent !== null
    )
  }

  _lockScroll() {
    this._scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = "hidden"
    document.body.style.paddingRight = `${this._scrollbarWidth}px`
  }

  _unlockScroll() {
    document.body.style.overflow = ""
    document.body.style.paddingRight = ""
  }

  _removeListeners() {
    document.removeEventListener("keydown", this._onKeydown)
  }

  _hideAfterAnimation(el) {
    const onAnimEnd = () => {
      if (el.dataset.state === "closed") {
        el.hidden = true
      }
      el.removeEventListener("animationend", onAnimEnd)
    }
    el.addEventListener("animationend", onAnimEnd)
    // Fallback if no animation
    setTimeout(() => {
      if (el.dataset.state === "closed") {
        el.hidden = true
      }
    }, 300)
  }

  _ensureId(el, prefix) {
    if (!el.id) {
      el.id = `${prefix}-${Math.random().toString(36).slice(2, 9)}`
    }
    return el.id
  }
}
