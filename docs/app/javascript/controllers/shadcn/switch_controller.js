import { Controller } from "@hotwired/stimulus"

// Replicates Radix Switch behavior
export default class extends Controller {
  static targets = ["button", "thumb", "input"]
  static values = {
    checked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  }

  connect() {
    this._syncState()
  }

  toggle() {
    if (this.disabledValue) return
    this.checkedValue = !this.checkedValue
    this.dispatch("change", { detail: { checked: this.checkedValue } })
  }

  checkedValueChanged() { this._syncState() }

  _syncState() {
    const state = this.checkedValue ? "checked" : "unchecked"

    this.buttonTargets.forEach((btn) => {
      btn.dataset.state = state
      btn.setAttribute("aria-checked", String(this.checkedValue))
    })

    this.thumbTargets.forEach((thumb) => {
      thumb.dataset.state = state
    })

    this.inputTargets.forEach((input) => {
      input.value = this.checkedValue ? "1" : "0"
      input.checked = this.checkedValue
    })
  }
}
