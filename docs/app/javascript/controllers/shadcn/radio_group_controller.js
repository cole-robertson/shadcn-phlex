import { Controller } from "@hotwired/stimulus"

// Replicates Radix RadioGroup behavior
// Arrow key navigation, single selection, form integration
export default class extends Controller {
  static targets = ["item", "input"]
  static values = {
    value: { type: String, default: "" },
    orientation: { type: String, default: "vertical" },
    disabled: { type: Boolean, default: false },
  }

  connect() {
    this._syncState()
  }

  select(event) {
    if (this.disabledValue) return
    const item = event.currentTarget
    const value = item.dataset.value
    if (value && value !== this.valueValue) {
      this.valueValue = value
      this.dispatch("change", { detail: { value } })
    }
  }

  keydown(event) {
    const items = this.itemTargets.filter((el) => !el.dataset.disabled)
    const current = items.indexOf(event.currentTarget)
    if (current === -1) return

    const isVertical = this.orientationValue === "vertical"
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight"
    const prevKey = isVertical ? "ArrowUp" : "ArrowLeft"
    let nextIndex

    switch (event.key) {
      case nextKey:
        event.preventDefault()
        nextIndex = (current + 1) % items.length
        items[nextIndex].focus()
        this.valueValue = items[nextIndex].dataset.value
        break
      case prevKey:
        event.preventDefault()
        nextIndex = (current - 1 + items.length) % items.length
        items[nextIndex].focus()
        this.valueValue = items[nextIndex].dataset.value
        break
      case " ":
        event.preventDefault()
        this.valueValue = event.currentTarget.dataset.value
        break
    }
  }

  valueValueChanged() { this._syncState() }

  _syncState() {
    this.itemTargets.forEach((item) => {
      const isChecked = item.dataset.value === this.valueValue
      item.dataset.state = isChecked ? "checked" : "unchecked"
      item.setAttribute("aria-checked", String(isChecked))
      item.setAttribute("tabindex", isChecked ? "0" : "-1")

      // Show/hide indicator
      const indicator = item.querySelector("span")
      if (indicator) {
        indicator.hidden = !isChecked
      }
    })

    // Update hidden input for form submission
    this.inputTargets.forEach((input) => {
      input.value = this.valueValue
    })
  }
}
