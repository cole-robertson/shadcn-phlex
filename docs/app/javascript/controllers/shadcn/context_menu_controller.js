import { Controller } from "@hotwired/stimulus"

// Replicates Radix ContextMenu behavior
// Right-click to open, same keyboard navigation as DropdownMenu
export default class extends Controller {
  static targets = ["trigger", "content", "item"]
  static values = {
    open: { type: Boolean, default: false },
  }

  connect() {
    this._onClickOutside = this._handleClickOutside.bind(this)
    this._onKeydown = this._handleKeydown.bind(this)
    this._onContextMenu = this._handleContextMenu.bind(this)
    this._hideTimeouts = []

    this.triggerTargets.forEach((el) => {
      el.addEventListener("contextmenu", this._onContextMenu)
    })

    this._syncState()
  }

  disconnect() {
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []
    this._removeListeners()
    this.triggerTargets.forEach((el) => {
      el.removeEventListener("contextmenu", this._onContextMenu)
    })
  }

  hide() { this.openValue = false }

  openValueChanged() { this._syncState() }

  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled) return
    this.dispatch("select", { detail: { value: item.dataset.value } })
    this.hide()
  }

  _handleContextMenu(event) {
    event.preventDefault()
    this._mouseX = event.clientX
    this._mouseY = event.clientY
    this.openValue = true
  }

  _syncState() {
    const state = this.openValue ? "open" : "closed"

    this.contentTargets.forEach((el) => {
      el.dataset.state = state
      if (this.openValue) {
        el.hidden = false
        this._positionAt(el, this._mouseX || 0, this._mouseY || 0)
        requestAnimationFrame(() => {
          const firstItem = el.querySelector('[data-slot*="menu-item"]:not([data-disabled])')
          firstItem?.focus()
        })
      } else {
        this._hideTimeouts.push(setTimeout(() => { if (el.dataset.state === "closed") el.hidden = true }, 200))
      }
    })

    if (this.openValue) {
      document.addEventListener("click", this._onClickOutside, true)
      document.addEventListener("keydown", this._onKeydown)
    } else {
      this._removeListeners()
    }
  }

  _positionAt(content, x, y) {
    content.style.position = "fixed"
    content.style.zIndex = "50"
    content.style.top = `${y}px`
    content.style.left = `${x}px`

    // Adjust if overflowing
    requestAnimationFrame(() => {
      const rect = content.getBoundingClientRect()
      if (rect.right > window.innerWidth) {
        content.style.left = `${x - rect.width}px`
      }
      if (rect.bottom > window.innerHeight) {
        content.style.top = `${y - rect.height}px`
      }
    })
  }

  _handleClickOutside(event) {
    if (!this.contentTargets.some((el) => el.contains(event.target))) {
      this.hide()
    }
  }

  _handleKeydown(event) {
    if (event.key === "Escape") { event.preventDefault(); this.hide(); return }

    const items = this._getItems()
    const current = items.indexOf(document.activeElement)

    if (event.key === "ArrowDown") {
      event.preventDefault()
      items[(current + 1) % items.length]?.focus()
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      items[(current - 1 + items.length) % items.length]?.focus()
    } else if (event.key === "Enter" || event.key === " ") {
      if (document.activeElement?.matches('[data-slot*="menu-item"]')) {
        event.preventDefault()
        document.activeElement.click()
      }
    }
  }

  _getItems() {
    if (!this.hasContentTarget) return []
    return Array.from(this.contentTarget.querySelectorAll(
      '[data-slot*="menu-item"]:not([data-disabled])'
    )).filter((el) => !el.closest("[hidden]"))
  }

  _removeListeners() {
    document.removeEventListener("click", this._onClickOutside, true)
    document.removeEventListener("keydown", this._onKeydown)
  }
}
