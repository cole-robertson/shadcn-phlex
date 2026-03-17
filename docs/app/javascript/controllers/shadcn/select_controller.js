import { Controller } from "@hotwired/stimulus"

// Replicates Radix Select behavior
// Uses Stimulus's declarative event wiring (click@window) for click-outside
// instead of programmatic document listeners — this avoids flicker.
export default class extends Controller {
  static targets = ["trigger", "content", "item", "value", "input"]
  static values = {
    open: { type: Boolean, default: false },
    value: { type: String, default: "" },
    placeholder: { type: String, default: "Select..." },
    disabled: { type: Boolean, default: false },
  }

  connect() {
    this._hideTimeouts = []
    this._syncValueState()
    // Ensure closed on connect
    this.contentTargets.forEach((el) => { el.dataset.state = "closed"; el.hidden = true })
    this.triggerTargets.forEach((el) => { el.dataset.state = "closed"; el.setAttribute("aria-expanded", "false") })
  }

  disconnect() {
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []
  }

  // Wired as: data-action="click->shadcn--select#toggle"
  toggle() {
    if (this.disabledValue) return
    this.openValue = !this.openValue
  }

  // Wired as: data-action="click@window->shadcn--select#hide"
  // This fires on EVERY click on the page. The guard ensures it only
  // closes when the click is outside this element.
  hide(event) {
    if (!this.openValue) return
    if (event && event.target && this.element.contains(event.target)) return
    this.openValue = false
  }

  // Wired as: data-action="keydown.esc@window->shadcn--select#hideOnEscape"
  hideOnEscape(event) {
    if (!this.openValue) return
    this.openValue = false
    this.triggerTargets[0]?.focus()
  }

  // Wired as: data-action="click->shadcn--select#selectItem"
  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled) return

    const value = item.dataset.value
    const label = item.textContent.trim()

    this.valueValue = value

    this.valueTargets.forEach((el) => {
      el.textContent = label
      el.removeAttribute("data-placeholder")
    })

    this.dispatch("change", { detail: { value, label } })
    this.openValue = false
    this.triggerTargets[0]?.focus()
  }

  openValueChanged() {
    if (!this._hideTimeouts) return
    this._render()
  }

  valueValueChanged() {
    if (!this._hideTimeouts) return
    this._syncValueState()
  }

  // ── Private ─────────────────────────────────────────

  _render() {
    const open = this.openValue
    const state = open ? "open" : "closed"

    // Clear pending hides
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []

    this.triggerTargets.forEach((el) => {
      el.dataset.state = state
      el.setAttribute("aria-expanded", String(open))
    })

    this.contentTargets.forEach((el) => {
      el.dataset.state = state
      if (open) {
        el.hidden = false
        this._position(el)
        requestAnimationFrame(() => {
          const selected = el.querySelector(`[data-value="${this.valueValue}"]`)
          const target = selected || el.querySelector('[data-slot="select-item"]:not([data-disabled])')
          target?.focus()
        })
      } else {
        this._hideTimeouts.push(setTimeout(() => { el.hidden = true }, 150))
      }
    })
  }

  _syncValueState() {
    this.itemTargets.forEach((item) => {
      const isSelected = item.dataset.value === this.valueValue
      item.dataset.state = isSelected ? "checked" : "unchecked"
      item.setAttribute("aria-selected", String(isSelected))
      const indicator = item.querySelector("span")
      if (indicator) indicator.style.visibility = isSelected ? "visible" : "hidden"
    })

    this.inputTargets.forEach((input) => { input.value = this.valueValue })

    if (!this.valueValue) {
      this.valueTargets.forEach((el) => {
        el.textContent = this.placeholderValue
        el.dataset.placeholder = ""
      })
    }
  }

  _position(content) {
    if (!this.hasTriggerTarget) return
    const rect = this.triggerTarget.getBoundingClientRect()

    content.style.position = "fixed"
    content.style.zIndex = "50"
    content.style.width = `${rect.width}px`
    content.style.minWidth = `${Math.max(rect.width, 128)}px`

    let top = rect.bottom + 4
    const contentHeight = content.scrollHeight
    if (top + contentHeight > window.innerHeight) {
      top = rect.top - contentHeight - 4
    }
    content.style.top = `${top}px`
    content.style.left = `${rect.left}px`
  }

  // Keyboard nav within the open dropdown
  navigate(event) {
    if (!this.openValue) return
    const items = this._getItems()
    const current = items.indexOf(document.activeElement)

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        items[(current + 1) % items.length]?.focus()
        break
      case "ArrowUp":
        event.preventDefault()
        items[(current - 1 + items.length) % items.length]?.focus()
        break
      case "Home":
        event.preventDefault()
        items[0]?.focus()
        break
      case "End":
        event.preventDefault()
        items[items.length - 1]?.focus()
        break
      case "Enter":
      case " ":
        if (document.activeElement?.matches('[data-slot="select-item"]')) {
          event.preventDefault()
          document.activeElement.click()
        }
        break
    }
  }

  _getItems() {
    if (!this.hasContentTarget) return []
    return Array.from(this.contentTarget.querySelectorAll('[data-slot="select-item"]:not([data-disabled])'))
  }
}
