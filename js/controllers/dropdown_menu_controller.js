import { Controller } from "@hotwired/stimulus"

// Replicates Radix DropdownMenu behavior
// Uses Stimulus declarative click@window for outside click (no flicker)
export default class extends Controller {
  static targets = ["trigger", "content", "item", "sub", "subTrigger", "subContent"]
  static values = {
    open: { type: Boolean, default: false },
    closeOnSelect: { type: Boolean, default: true },
  }

  connect() {
    this._hideTimeouts = []
    this.contentTargets.forEach((el) => { el.dataset.state = "closed"; el.hidden = true })
    this.triggerTargets.forEach((el) => { el.dataset.state = "closed"; el.setAttribute("aria-expanded", "false") })
  }

  disconnect() {
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []
  }

  toggle(event) {
    event?.preventDefault()
    this.openValue = !this.openValue
  }

  // Wired as click@window->shadcn--dropdown-menu#hide
  hide(event) {
    if (!this.openValue) return
    if (event && event.target && this.element.contains(event.target)) return
    this.openValue = false
  }

  // Wired as keydown.esc@window->shadcn--dropdown-menu#hideOnEscape
  hideOnEscape() {
    if (!this.openValue) return
    this.openValue = false
    this.triggerTargets[0]?.focus()
  }

  close() { this.openValue = false }

  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled) return
    this.dispatch("select", { detail: { value: item.dataset.value } })
    if (this.closeOnSelectValue) this.close()
  }

  // Keyboard nav within the open menu
  navigate(event) {
    if (!this.openValue) return

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault()
        const items = this._getMenuItems()
        const current = items.indexOf(document.activeElement)
        items[(current + 1) % items.length]?.focus()
        break
      }
      case "ArrowUp": {
        event.preventDefault()
        const items = this._getMenuItems()
        const current = items.indexOf(document.activeElement)
        items[(current - 1 + items.length) % items.length]?.focus()
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
        const subTrigger = document.activeElement?.closest('[data-slot*="sub-trigger"]')
        if (subTrigger) {
          event.preventDefault()
          const sub = subTrigger.closest('[data-slot*="sub"]')
          const subContent = sub?.querySelector('[data-slot*="sub-content"]')
          if (subContent) {
            subContent.hidden = false
            subContent.dataset.state = "open"
            subContent.querySelector('[data-slot*="menu-item"]:not([data-disabled])')?.focus()
          }
        }
        break
      }
      case "ArrowLeft": {
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
      el.setAttribute("aria-haspopup", "menu")
    })

    this.contentTargets.forEach((el) => {
      if (open) {
        el.getAnimations().forEach(a => a.cancel())
        el.hidden = false
        el.dataset.state = "open"
        requestAnimationFrame(() => this._positionContent(el))
        requestAnimationFrame(() => {
          el.querySelector('[data-slot*="menu-item"]:not([data-disabled])')?.focus()
        })
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
  }

  _positionContent(content) {
    if (!this.hasTriggerTarget) return
    const rect = this.triggerTarget.getBoundingClientRect()

    content.style.position = "fixed"
    content.style.zIndex = "50"

    let top = rect.bottom + 4
    let left = rect.left
    const contentRect = content.getBoundingClientRect()

    if (top + contentRect.height > window.innerHeight) {
      top = rect.top - contentRect.height - 4
      content.dataset.side = "top"
    } else {
      content.dataset.side = "bottom"
    }

    if (left + contentRect.width > window.innerWidth) left = window.innerWidth - contentRect.width - 8
    if (left < 8) left = 8

    content.style.top = `${top}px`
    content.style.left = `${left}px`
  }

  _getMenuItems() {
    if (!this.hasContentTarget) return []
    return Array.from(this.contentTarget.querySelectorAll(
      '[data-slot*="menu-item"]:not([data-disabled]), [data-slot*="checkbox-item"]:not([data-disabled]), [data-slot*="radio-item"]:not([data-disabled]), [data-slot*="sub-trigger"]:not([data-disabled])'
    )).filter((el) => !el.closest("[hidden]"))
  }
}
