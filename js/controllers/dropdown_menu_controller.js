import { Controller } from "@hotwired/stimulus"

// Replicates Radix DropdownMenu behavior
// Click to open, keyboard navigation, sub-menus, close on outside click
export default class extends Controller {
  static targets = ["trigger", "content", "item", "sub", "subTrigger", "subContent"]
  static values = {
    open: { type: Boolean, default: false },
    closeOnSelect: { type: Boolean, default: true },
  }

  connect() {
    this._onClickOutside = this._handleClickOutside.bind(this)
    this._onKeydown = this._handleKeydown.bind(this)
    this._syncState()
  }

  disconnect() {
    this._removeListeners()
  }

  toggle(event) {
    event?.preventDefault()
    this.openValue = !this.openValue
  }

  show() { this.openValue = true }
  hide() { this.openValue = false }

  openValueChanged() { this._syncState() }

  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled) return

    // Dispatch custom event
    this.dispatch("select", { detail: { value: item.dataset.value } })

    if (this.closeOnSelectValue) {
      this.hide()
    }
  }

  _syncState() {
    const state = this.openValue ? "open" : "closed"
    this.element.dataset.state = state

    this.triggerTargets.forEach((el) => {
      el.dataset.state = state
      el.setAttribute("aria-expanded", String(this.openValue))
      el.setAttribute("aria-haspopup", "menu")
    })

    this.contentTargets.forEach((el) => {
      el.dataset.state = state
      if (this.openValue) {
        el.hidden = false
        this._positionContent(el)
        requestAnimationFrame(() => {
          const firstItem = el.querySelector('[data-slot*="menu-item"]:not([data-disabled])')
          if (firstItem) firstItem.focus()
        })
      } else {
        this._hideAfterAnimation(el)
      }
    })

    if (this.openValue) {
      document.addEventListener("click", this._onClickOutside, true)
      document.addEventListener("keydown", this._onKeydown)
    } else {
      this._removeListeners()
    }
  }

  _positionContent(content) {
    if (!this.hasTriggerTarget) return
    const trigger = this.triggerTarget
    const rect = trigger.getBoundingClientRect()
    const viewport = { width: window.innerWidth, height: window.innerHeight }

    // Reset position
    content.style.position = "fixed"
    content.style.zIndex = "50"

    // Position below trigger by default
    let top = rect.bottom + 4
    let left = rect.left

    // Measure content
    const contentRect = content.getBoundingClientRect()

    // Flip if needed
    if (top + contentRect.height > viewport.height) {
      top = rect.top - contentRect.height - 4
      content.dataset.side = "top"
    } else {
      content.dataset.side = "bottom"
    }

    // Prevent overflow right
    if (left + contentRect.width > viewport.width) {
      left = viewport.width - contentRect.width - 8
    }

    // Prevent overflow left
    if (left < 8) left = 8

    content.style.top = `${top}px`
    content.style.left = `${left}px`
  }

  _handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.hide()
    }
  }

  _handleKeydown(event) {
    switch (event.key) {
      case "Escape":
        event.preventDefault()
        this.hide()
        if (this.hasTriggerTarget) this.triggerTarget.focus()
        break

      case "ArrowDown": {
        event.preventDefault()
        const items = this._getMenuItems()
        const current = items.indexOf(document.activeElement)
        const next = current < items.length - 1 ? current + 1 : 0
        items[next]?.focus()
        break
      }

      case "ArrowUp": {
        event.preventDefault()
        const items = this._getMenuItems()
        const current = items.indexOf(document.activeElement)
        const prev = current > 0 ? current - 1 : items.length - 1
        items[prev]?.focus()
        break
      }

      case "Home":
        event.preventDefault()
        this._getMenuItems()[0]?.focus()
        break

      case "End": {
        event.preventDefault()
        const items = this._getMenuItems()
        items[items.length - 1]?.focus()
        break
      }

      case "Enter":
      case " ":
        if (document.activeElement?.matches('[data-slot*="menu-item"]')) {
          event.preventDefault()
          document.activeElement.click()
        }
        break

      case "ArrowRight": {
        // Open sub-menu
        const subTrigger = document.activeElement?.closest('[data-slot*="sub-trigger"]')
        if (subTrigger) {
          event.preventDefault()
          const sub = subTrigger.closest('[data-slot*="sub"]')
          const subContent = sub?.querySelector('[data-slot*="sub-content"]')
          if (subContent) {
            subContent.hidden = false
            subContent.dataset.state = "open"
            const firstItem = subContent.querySelector('[data-slot*="menu-item"]:not([data-disabled])')
            firstItem?.focus()
          }
        }
        break
      }

      case "ArrowLeft": {
        // Close sub-menu
        const subContent = document.activeElement?.closest('[data-slot*="sub-content"]')
        if (subContent) {
          event.preventDefault()
          subContent.dataset.state = "closed"
          subContent.hidden = true
          const subTrigger = subContent.previousElementSibling ||
            subContent.closest('[data-slot*="sub"]')?.querySelector('[data-slot*="sub-trigger"]')
          subTrigger?.focus()
        }
        break
      }
    }
  }

  _getMenuItems() {
    if (!this.hasContentTarget) return []
    return Array.from(this.contentTarget.querySelectorAll(
      '[data-slot*="menu-item"]:not([data-disabled]), [data-slot*="checkbox-item"]:not([data-disabled]), [data-slot*="radio-item"]:not([data-disabled]), [data-slot*="sub-trigger"]:not([data-disabled])'
    )).filter((el) => !el.closest("[hidden]"))
  }

  _removeListeners() {
    document.removeEventListener("click", this._onClickOutside, true)
    document.removeEventListener("keydown", this._onKeydown)
  }

  _hideAfterAnimation(el) {
    setTimeout(() => { if (el.dataset.state === "closed") el.hidden = true }, 200)
  }
}
