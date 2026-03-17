import { Controller } from "@hotwired/stimulus"

// Replicates Radix Checkbox behavior
// Toggle checked/unchecked/indeterminate, updates hidden input for forms
export default class extends Controller {
  static targets = ["button", "indicator", "input"]
  static values = {
    checked: { type: String, default: "false" }, // "true", "false", "indeterminate"
    disabled: { type: Boolean, default: false },
    name: String,
  }

  connect() {
    this._syncState()
  }

  toggle() {
    if (this.disabledValue) return

    if (this.checkedValue === "true") {
      this.checkedValue = "false"
    } else {
      this.checkedValue = "true"
    }

    this.dispatch("change", { detail: { checked: this.checkedValue === "true" } })
  }

  checkedValueChanged() { this._syncState() }

  _syncState() {
    const isChecked = this.checkedValue === "true"
    const isIndeterminate = this.checkedValue === "indeterminate"
    const state = isIndeterminate ? "indeterminate" : isChecked ? "checked" : "unchecked"

    this.buttonTargets.forEach((btn) => {
      btn.dataset.state = state
      btn.setAttribute("aria-checked", isIndeterminate ? "mixed" : String(isChecked))
      btn.setAttribute("data-disabled", String(this.disabledValue))
    })

    this.indicatorTargets.forEach((ind) => {
      ind.hidden = !isChecked && !isIndeterminate
    })

    // Update hidden input for form submission
    this.inputTargets.forEach((input) => {
      input.value = isChecked ? "1" : "0"
      input.checked = isChecked
    })
  }
}
