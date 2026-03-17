import { Controller } from "@hotwired/stimulus"

// Replicates Radix Toggle behavior
export default class extends Controller {
  static targets = ["button"]
  static values = {
    pressed: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  }

  connect() {
    this._syncState()
  }

  toggle() {
    if (this.disabledValue) return
    this.pressedValue = !this.pressedValue
    this.dispatch("change", { detail: { pressed: this.pressedValue } })
  }

  pressedValueChanged() { this._syncState() }

  _syncState() {
    const state = this.pressedValue ? "on" : "off"
    this.buttonTargets.forEach((btn) => {
      btn.dataset.state = state
      btn.setAttribute("aria-pressed", String(this.pressedValue))
    })
  }
}
