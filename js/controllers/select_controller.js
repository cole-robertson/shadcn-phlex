import { Controller } from "@hotwired/stimulus"

// Replicates Radix Select behavior
// Custom dropdown select with keyboard navigation and form integration
export default class extends Controller {
  static targets = ["trigger", "content", "item", "value", "input"]
  static values = {
    open: { type: Boolean, default: false },
    value: { type: String, default: "" },
    placeholder: { type: String, default: "Select..." },
    disabled: { type: Boolean, default: false },
  }

  connect() {
    this._onClickOutside = this._handleClickOutside.bind(this)
    this._onKeydown = this._handleKeydown.bind(this)
    this._syncState()
  }

  disconnect() {
    this._removeListeners()
  }

  toggle() {
    if (this.disabledValue) return
    this.openValue = !this.openValue
  }

  show() { if (!this.disabledValue) this.openValue = true }
  hide() { this.openValue = false }

  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled) return

    const value = item.dataset.value
    const label = item.textContent.trim()

    this.valueValue = value

    // Update display text
    this.valueTargets.forEach((el) => {
      el.textContent = label
      el.removeAttribute("data-placeholder")
    })

    this.dispatch("change", { detail: { value, label } })
    this.hide()

    // Return focus to trigger
    this.triggerTargets[0]?.focus()
  }

  openValueChanged() { this._syncOpenState() }
  valueValueChanged() { this._syncValueState() }

  _syncState() {
    this._syncOpenState()
    this._syncValueState()
  }

  _syncOpenState() {
    const state = this.openValue ? "open" : "closed"

    this.triggerTargets.forEach((el) => {
      el.dataset.state = state
      el.setAttribute("aria-expanded", String(this.openValue))
    })

    this.contentTargets.forEach((el) => {
      el.dataset.state = state
      if (this.openValue) {
        el.hidden = false
        this._position(el)
        // Focus selected or first item
        requestAnimationFrame(() => {
          const selected = el.querySelector(`[data-value="${this.valueValue}"]`)
          const target = selected || el.querySelector('[data-slot="select-item"]:not([data-disabled])')
          target?.focus()
        })
      } else {
        setTimeout(() => { if (el.dataset.state === "closed") el.hidden = true }, 200)
      }
    })

    if (this.openValue) {
      requestAnimationFrame(() => {
        document.addEventListener("click", this._onClickOutside, true)
      })
      document.addEventListener("keydown", this._onKeydown)
    } else {
      this._removeListeners()
    }
  }

  _syncValueState() {
    // Update ARIA on items
    this.itemTargets.forEach((item) => {
      const isSelected = item.dataset.value === this.valueValue
      item.dataset.state = isSelected ? "checked" : "unchecked"
      item.setAttribute("aria-selected", String(isSelected))

      // Show/hide check indicator
      const indicator = item.querySelector("span")
      if (indicator) {
        indicator.style.visibility = isSelected ? "visible" : "hidden"
      }
    })

    // Update hidden input
    this.inputTargets.forEach((input) => {
      input.value = this.valueValue
    })

    // Update display
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
      content.dataset.side = "top"
    } else {
      content.dataset.side = "bottom"
    }

    content.style.top = `${top}px`
    content.style.left = `${rect.left}px`
  }

  _handleClickOutside(event) {
    if (!this.element.contains(event.target)) this.hide()
  }

  _handleKeydown(event) {
    if (event.key === "Escape") { event.preventDefault(); this.hide(); this.triggerTargets[0]?.focus(); return }

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
    return Array.from(this.contentTarget.querySelectorAll(
      '[data-slot="select-item"]:not([data-disabled])'
    ))
  }

  _removeListeners() {
    document.removeEventListener("click", this._onClickOutside, true)
    document.removeEventListener("keydown", this._onKeydown)
  }
}
