import { Controller } from "@hotwired/stimulus"

// Combobox: filterable select with search input
// Combines Input + Popover + List pattern
export default class extends Controller {
  static targets = ["input", "content", "item", "empty", "hiddenInput", "value"]
  static values = {
    open: { type: Boolean, default: false },
    value: { type: String, default: "" },
    placeholder: { type: String, default: "Search..." },
    emptyText: { type: String, default: "No results found." },
  }

  connect() {
    this._onClickOutside = this._handleClickOutside.bind(this)
    this._hideTimeouts = []
    this._allItems = this.itemTargets.map((el) => ({
      element: el,
      value: el.dataset.value || "",
      label: el.textContent.trim().toLowerCase(),
    }))
    this._syncState()
  }

  disconnect() {
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []
    document.removeEventListener("click", this._onClickOutside, true)
  }

  toggle() { this.openValue = !this.openValue }
  show() { this.openValue = true }
  hide() { this.openValue = false }

  filter(event) {
    const query = event.currentTarget.value.toLowerCase()
    let visibleCount = 0

    this._allItems.forEach(({ element, label }) => {
      const match = label.includes(query)
      element.hidden = !match
      if (match) visibleCount++
    })

    // Show/hide empty state
    this.emptyTargets.forEach((el) => {
      el.hidden = visibleCount > 0
    })
  }

  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled) return

    const value = item.dataset.value
    const label = item.textContent.trim()

    this.valueValue = value

    // Update display
    this.valueTargets.forEach((el) => { el.textContent = label })
    this.inputTargets.forEach((el) => { el.value = "" })

    this.dispatch("change", { detail: { value, label } })
    this.hide()
  }

  keydown(event) {
    if (!this.openValue && (event.key === "ArrowDown" || event.key === "Enter")) {
      event.preventDefault()
      this.show()
      return
    }

    if (event.key === "Escape") { this.hide(); return }

    const items = this._getVisibleItems()
    const current = items.indexOf(document.activeElement)

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        if (current < items.length - 1) items[current + 1]?.focus()
        else if (current === -1 && items.length > 0) items[0].focus()
        break
      case "ArrowUp":
        event.preventDefault()
        if (current > 0) items[current - 1]?.focus()
        else if (this.hasInputTarget) this.inputTarget.focus()
        break
      case "Enter":
        if (document.activeElement?.matches('[data-slot*="item"]')) {
          event.preventDefault()
          document.activeElement.click()
        }
        break
    }
  }

  openValueChanged() { this._syncOpenState() }
  valueValueChanged() { this._syncValueState() }

  _syncState() {
    this._syncOpenState()
    this._syncValueState()
  }

  _syncOpenState() {
    if (!this._hideTimeouts) return
    this.contentTargets.forEach((el) => {
      el.dataset.state = this.openValue ? "open" : "closed"
      if (this.openValue) {
        el.hidden = false
        this._position(el)
        requestAnimationFrame(() => {
          if (this.hasInputTarget) this.inputTarget.focus()
        })
      } else {
        this._hideTimeouts.push(setTimeout(() => { if (el.dataset.state === "closed") el.hidden = true }, 200))
        // Reset filter
        this._allItems.forEach(({ element }) => { element.hidden = false })
        this.emptyTargets.forEach((el) => { el.hidden = true })
      }
    })

    if (this.openValue) {
      requestAnimationFrame(() => document.addEventListener("click", this._onClickOutside, true))
    } else {
      document.removeEventListener("click", this._onClickOutside, true)
    }
  }

  _syncValueState() {
    this.itemTargets.forEach((item) => {
      const isSelected = item.dataset.value === this.valueValue
      item.dataset.state = isSelected ? "checked" : "unchecked"
      item.setAttribute("aria-selected", String(isSelected))
    })

    this.hiddenInputTargets.forEach((input) => {
      input.value = this.valueValue
    })
  }

  _position(content) {
    const anchor = this.element
    const rect = anchor.getBoundingClientRect()

    content.style.position = "fixed"
    content.style.zIndex = "50"
    content.style.width = `${rect.width}px`
    content.style.top = `${rect.bottom + 4}px`
    content.style.left = `${rect.left}px`
  }

  _getVisibleItems() {
    return this.itemTargets.filter((el) => !el.hidden && !el.dataset.disabled)
  }

  _handleClickOutside(event) {
    if (!this.element.contains(event.target)) this.hide()
  }
}
