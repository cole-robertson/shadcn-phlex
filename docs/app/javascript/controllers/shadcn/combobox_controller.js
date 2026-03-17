import { Controller } from "@hotwired/stimulus"

// Combobox: filterable select with search input
// Uses Stimulus declarative click@window for outside click (no flicker)
export default class extends Controller {
  static targets = ["input", "content", "item", "empty", "hiddenInput", "value"]
  static values = {
    open: { type: Boolean, default: false },
    value: { type: String, default: "" },
    placeholder: { type: String, default: "Search..." },
    emptyText: { type: String, default: "No results found." },
  }

  connect() {
    this._hideTimeouts = []
    this._allItems = this.itemTargets.map((el) => ({
      element: el,
      value: el.dataset.value || "",
      label: el.textContent.trim().toLowerCase(),
    }))
    this.contentTargets.forEach((el) => { el.dataset.state = "closed"; el.hidden = true })
  }

  disconnect() {
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []
  }

  toggle() { this.openValue = !this.openValue }

  // Wired as click@window->shadcn--combobox#hide
  hide(event) {
    if (!this.openValue) return
    if (event && event.target && this.element.contains(event.target)) return
    this.openValue = false
  }

  // Wired as keydown.esc@window->shadcn--combobox#hideOnEscape
  hideOnEscape() {
    if (!this.openValue) return
    this.openValue = false
  }

  close() { this.openValue = false }

  filter(event) {
    const query = event.currentTarget.value.toLowerCase()
    let visibleCount = 0

    this._allItems.forEach(({ element, label }) => {
      const match = label.includes(query)
      element.hidden = !match
      if (match) visibleCount++
    })

    this.emptyTargets.forEach((el) => { el.hidden = visibleCount > 0 })
  }

  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled) return

    const value = item.dataset.value
    const label = item.textContent.trim()

    this.valueValue = value
    this.valueTargets.forEach((el) => { el.textContent = label })
    this.inputTargets.forEach((el) => { el.value = "" })

    this.dispatch("change", { detail: { value, label } })
    this.openValue = false
  }

  keydown(event) {
    if (!this.openValue && (event.key === "ArrowDown" || event.key === "Enter")) {
      event.preventDefault()
      this.openValue = true
      return
    }
    if (event.key === "Escape") { this.openValue = false; return }

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

  openValueChanged() {
    if (!this._hideTimeouts) return
    this._render()
  }

  valueValueChanged() { this._syncValueState() }

  _render() {
    const open = this.openValue

    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []

    this.contentTargets.forEach((el) => {
      if (open) {
        el.getAnimations().forEach(a => a.cancel())
        el.hidden = false
        el.dataset.state = "open"
        this._position(el)
        requestAnimationFrame(() => {
          if (this.hasInputTarget) this.inputTarget.focus()
        })
      } else {
        el.dataset.state = "closed"
        // Reset filter
        this._allItems.forEach(({ element }) => { element.hidden = false })
        this.emptyTargets.forEach((em) => { em.hidden = true })

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

  _syncValueState() {
    this.itemTargets.forEach((item) => {
      const isSelected = item.dataset.value === this.valueValue
      item.dataset.state = isSelected ? "checked" : "unchecked"
      item.setAttribute("aria-selected", String(isSelected))
    })
    this.hiddenInputTargets.forEach((input) => { input.value = this.valueValue })
  }

  _position(content) {
    const rect = this.element.getBoundingClientRect()
    content.style.position = "fixed"
    content.style.zIndex = "50"
    content.style.width = `${rect.width}px`
    content.style.top = `${rect.bottom + 4}px`
    content.style.left = `${rect.left}px`
  }

  _getVisibleItems() {
    return this.itemTargets.filter((el) => !el.hidden && !el.dataset.disabled)
  }
}
