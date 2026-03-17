import { Controller } from "@hotwired/stimulus"

// Replicates Radix ToggleGroup behavior
// Supports single (default) and multiple selection
export default class extends Controller {
  static targets = ["item"]
  static values = {
    type: { type: String, default: "single" }, // "single" or "multiple"
    value: { type: Array, default: [] },
    disabled: { type: Boolean, default: false },
  }

  connect() {
    this._syncState()
  }

  toggle(event) {
    if (this.disabledValue) return
    const item = event.currentTarget
    const value = item.dataset.value
    if (!value) return

    if (this.typeValue === "single") {
      // Toggle off if already selected, otherwise select
      if (this.valueValue.includes(value)) {
        this.valueValue = []
      } else {
        this.valueValue = [value]
      }
    } else {
      // Toggle in/out of array
      if (this.valueValue.includes(value)) {
        this.valueValue = this.valueValue.filter((v) => v !== value)
      } else {
        this.valueValue = [...this.valueValue, value]
      }
    }

    this.dispatch("change", { detail: { value: this.valueValue } })
  }

  keydown(event) {
    const items = this.itemTargets
    const current = items.indexOf(event.currentTarget)
    if (current === -1) return

    let nextIndex
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault()
        nextIndex = (current + 1) % items.length
        items[nextIndex].focus()
        break
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault()
        nextIndex = (current - 1 + items.length) % items.length
        items[nextIndex].focus()
        break
    }
  }

  valueValueChanged() { this._syncState() }

  _syncState() {
    this.itemTargets.forEach((item) => {
      const isPressed = this.valueValue.includes(item.dataset.value)
      item.dataset.state = isPressed ? "on" : "off"
      item.setAttribute("aria-pressed", String(isPressed))
    })
  }
}
