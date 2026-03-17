import { Controller } from "@hotwired/stimulus"

// Command palette (cmdk-style)
// Cmd+K to open, search/filter, keyboard navigation, grouping
export default class extends Controller {
  static targets = ["dialog", "overlay", "input", "list", "group", "item", "empty"]
  static values = {
    open: { type: Boolean, default: false },
    shortcut: { type: String, default: "k" },
  }

  connect() {
    this._onGlobalKeydown = this._handleGlobalKeydown.bind(this)
    this._onKeydown = this._handleKeydown.bind(this)

    this._allItems = this.itemTargets.map((el) => ({
      element: el,
      label: el.textContent.trim().toLowerCase(),
      value: el.dataset.value || "",
      group: el.closest('[data-slot="command-group"]'),
    }))

    this._hideTimeouts = []
    document.addEventListener("keydown", this._onGlobalKeydown)
    this._syncState()
  }

  disconnect() {
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []
    document.removeEventListener("keydown", this._onGlobalKeydown)
    document.removeEventListener("keydown", this._onKeydown)
  }

  toggle() { this.openValue = !this.openValue }
  show() { this.openValue = true }
  hide() { this.openValue = false }

  filter(event) {
    const query = event.currentTarget.value.toLowerCase()
    let totalVisible = 0

    // Track visible items per group
    const groupCounts = new Map()

    this._allItems.forEach(({ element, label, group }) => {
      const match = !query || label.includes(query)
      element.hidden = !match
      if (match) {
        totalVisible++
        if (group) {
          groupCounts.set(group, (groupCounts.get(group) || 0) + 1)
        }
      }
    })

    // Hide groups with no visible items
    this.groupTargets.forEach((group) => {
      group.hidden = (groupCounts.get(group) || 0) === 0
    })

    // Show/hide empty state
    this.emptyTargets.forEach((el) => {
      el.hidden = totalVisible > 0
    })
  }

  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled) return

    this.dispatch("select", { detail: { value: item.dataset.value } })

    // Execute callback if specified
    const callback = item.dataset.commandCallback
    if (callback && window[callback]) {
      window[callback]()
    }

    this.hide()
  }

  clickOverlay(event) {
    if (event.target === event.currentTarget) this.hide()
  }

  openValueChanged() { this._syncState() }

  _syncState() {
    if (!this._hideTimeouts) return
    if (this.openValue) {
      this._open()
    } else {
      this._close()
    }
  }

  _open() {
    this.dialogTargets.forEach((el) => { el.dataset.state = "open"; el.hidden = false })
    this.overlayTargets.forEach((el) => { el.dataset.state = "open"; el.hidden = false })

    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", this._onKeydown)

    requestAnimationFrame(() => {
      if (this.hasInputTarget) {
        this.inputTarget.value = ""
        this.inputTarget.focus()
      }
      // Reset filter
      this._allItems.forEach(({ element }) => { element.hidden = false })
      this.groupTargets.forEach((g) => { g.hidden = false })
      this.emptyTargets.forEach((el) => { el.hidden = true })
    })
  }

  _close() {
    this.dialogTargets.forEach((el) => {
      el.dataset.state = "closed"
      this._hideTimeouts.push(setTimeout(() => { if (el.dataset.state === "closed") el.hidden = true }, 200))
    })
    this.overlayTargets.forEach((el) => {
      el.dataset.state = "closed"
      this._hideTimeouts.push(setTimeout(() => { if (el.dataset.state === "closed") el.hidden = true }, 200))
    })

    document.body.style.overflow = ""
    document.removeEventListener("keydown", this._onKeydown)
  }

  _handleGlobalKeydown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key === this.shortcutValue) {
      event.preventDefault()
      this.toggle()
    }
  }

  _handleKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault()
      this.hide()
      return
    }

    const items = this._getVisibleItems()
    const current = items.indexOf(document.activeElement)

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        if (current < items.length - 1) items[current + 1].focus()
        else if (items.length > 0) items[0].focus()
        break
      case "ArrowUp":
        event.preventDefault()
        if (current > 0) items[current - 1].focus()
        else if (this.hasInputTarget) this.inputTarget.focus()
        break
      case "Enter":
        if (document.activeElement?.dataset.slot === "command-item") {
          event.preventDefault()
          document.activeElement.click()
        }
        break
    }
  }

  _getVisibleItems() {
    return this.itemTargets.filter((el) => !el.hidden && !el.dataset.disabled)
  }
}
