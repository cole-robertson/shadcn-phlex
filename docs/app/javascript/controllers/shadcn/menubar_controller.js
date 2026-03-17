import { Controller } from "@hotwired/stimulus"

// Replicates Radix Menubar behavior
// Horizontal menu bar with dropdown submenus, keyboard navigation
export default class extends Controller {
  static targets = ["menu", "trigger", "content", "item"]
  static values = {
    activeMenu: { type: String, default: "" },
  }

  connect() {
    this._onClickOutside = this._handleClickOutside.bind(this)
    this._onKeydown = this._handleKeydown.bind(this)
    this._hideTimeouts = []
  }

  disconnect() {
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []
    this._removeListeners()
  }

  toggleMenu(event) {
    const trigger = event.currentTarget
    const value = trigger.dataset.value

    if (this.activeMenuValue === value) {
      this.activeMenuValue = ""
    } else {
      this.activeMenuValue = value
    }
  }

  enterTrigger(event) {
    // If another menu is already open, switch to this one on hover
    if (this.activeMenuValue) {
      const value = event.currentTarget.dataset.value
      if (value !== this.activeMenuValue) {
        this.activeMenuValue = value
      }
    }
  }

  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled) return
    this.dispatch("select", { detail: { value: item.dataset.value } })
    this.activeMenuValue = ""
  }

  activeMenuValueChanged() {
    this._syncState()
    if (this.activeMenuValue) {
      document.addEventListener("click", this._onClickOutside, true)
      document.addEventListener("keydown", this._onKeydown)
    } else {
      this._removeListeners()
    }
  }

  _syncState() {
    if (!this._hideTimeouts) return
    this.triggerTargets.forEach((trigger) => {
      const isActive = trigger.dataset.value === this.activeMenuValue
      trigger.dataset.state = isActive ? "open" : "closed"
      trigger.setAttribute("aria-expanded", String(isActive))
    })

    this.contentTargets.forEach((content) => {
      const isActive = content.dataset.value === this.activeMenuValue
      content.dataset.state = isActive ? "open" : "closed"

      if (isActive) {
        content.hidden = false
        this._positionContent(content)
        requestAnimationFrame(() => {
          const firstItem = content.querySelector('[data-slot*="menubar-item"]:not([data-disabled])')
          firstItem?.focus()
        })
      } else {
        this._hideTimeouts.push(setTimeout(() => { if (content.dataset.state === "closed") content.hidden = true }, 200))
      }
    })
  }

  _positionContent(content) {
    const trigger = this.triggerTargets.find((t) => t.dataset.value === this.activeMenuValue)
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    content.style.position = "fixed"
    content.style.zIndex = "50"
    content.style.top = `${rect.bottom + 4}px`
    content.style.left = `${rect.left}px`

    // Adjust if overflowing
    requestAnimationFrame(() => {
      const contentRect = content.getBoundingClientRect()
      if (contentRect.right > window.innerWidth) {
        content.style.left = `${window.innerWidth - contentRect.width - 8}px`
      }
      if (contentRect.bottom > window.innerHeight) {
        content.style.top = `${rect.top - contentRect.height - 4}px`
      }
    })
  }

  _handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.activeMenuValue = ""
    }
  }

  _handleKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault()
      const trigger = this.triggerTargets.find((t) => t.dataset.value === this.activeMenuValue)
      this.activeMenuValue = ""
      trigger?.focus()
      return
    }

    // Navigate between menus with Left/Right
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      const triggers = this.triggerTargets
      const currentIdx = triggers.findIndex((t) => t.dataset.value === this.activeMenuValue)
      if (currentIdx === -1) return

      const isInContent = document.activeElement?.closest('[data-slot*="menubar-content"]')
      if (isInContent) {
        event.preventDefault()
        const nextIdx = event.key === "ArrowRight"
          ? (currentIdx + 1) % triggers.length
          : (currentIdx - 1 + triggers.length) % triggers.length
        this.activeMenuValue = triggers[nextIdx].dataset.value
        return
      }
    }

    // Arrow down/up within menu items
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const items = this._getActiveItems()
      const current = items.indexOf(document.activeElement)
      event.preventDefault()
      const next = event.key === "ArrowDown"
        ? (current + 1) % items.length
        : (current - 1 + items.length) % items.length
      items[next]?.focus()
    }

    if (event.key === "Enter" || event.key === " ") {
      if (document.activeElement?.matches('[data-slot*="menubar-item"]')) {
        event.preventDefault()
        document.activeElement.click()
      }
    }
  }

  _getActiveItems() {
    const content = this.contentTargets.find((c) => c.dataset.value === this.activeMenuValue)
    if (!content) return []
    return Array.from(content.querySelectorAll(
      '[data-slot*="menubar-item"]:not([data-disabled]), [data-slot*="checkbox-item"]:not([data-disabled]), [data-slot*="radio-item"]:not([data-disabled])'
    )).filter((el) => !el.closest("[hidden]"))
  }

  _removeListeners() {
    document.removeEventListener("click", this._onClickOutside, true)
    document.removeEventListener("keydown", this._onKeydown)
  }
}
