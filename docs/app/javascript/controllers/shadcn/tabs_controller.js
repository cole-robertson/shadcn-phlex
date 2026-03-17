import { Controller } from "@hotwired/stimulus"

// Replicates Radix Tabs behavior
// Arrow key navigation, automatic activation, ARIA
export default class extends Controller {
  static targets = ["list", "trigger", "content"]
  static values = {
    value: { type: String, default: "" },
    orientation: { type: String, default: "horizontal" },
    activationMode: { type: String, default: "automatic" }, // "automatic" or "manual"
  }

  connect() {
    // Auto-select first tab if no value set
    if (!this.valueValue && this.triggerTargets.length > 0) {
      this.valueValue = this.triggerTargets[0].dataset.value || ""
    }
    this._syncState()
  }

  select(event) {
    const trigger = event.currentTarget
    const value = trigger.dataset.value
    if (value) this.valueValue = value
  }

  keydown(event) {
    const triggers = this.triggerTargets
    const current = triggers.indexOf(event.currentTarget)
    if (current === -1) return

    const isHorizontal = this.orientationValue === "horizontal"
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown"
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp"
    let nextIndex

    switch (event.key) {
      case nextKey:
        event.preventDefault()
        nextIndex = (current + 1) % triggers.length
        triggers[nextIndex].focus()
        if (this.activationModeValue === "automatic") {
          this.valueValue = triggers[nextIndex].dataset.value
        }
        break
      case prevKey:
        event.preventDefault()
        nextIndex = (current - 1 + triggers.length) % triggers.length
        triggers[nextIndex].focus()
        if (this.activationModeValue === "automatic") {
          this.valueValue = triggers[nextIndex].dataset.value
        }
        break
      case "Home":
        event.preventDefault()
        triggers[0].focus()
        if (this.activationModeValue === "automatic") {
          this.valueValue = triggers[0].dataset.value
        }
        break
      case "End":
        event.preventDefault()
        const last = triggers[triggers.length - 1]
        last.focus()
        if (this.activationModeValue === "automatic") {
          this.valueValue = last.dataset.value
        }
        break
      case "Enter":
      case " ":
        if (this.activationModeValue === "manual") {
          event.preventDefault()
          this.valueValue = event.currentTarget.dataset.value
        }
        break
    }
  }

  valueValueChanged() { this._syncState() }

  _syncState() {
    this.triggerTargets.forEach((trigger) => {
      const isActive = trigger.dataset.value === this.valueValue
      trigger.dataset.state = isActive ? "active" : "inactive"
      trigger.setAttribute("aria-selected", String(isActive))
      trigger.setAttribute("tabindex", isActive ? "0" : "-1")
    })

    this.contentTargets.forEach((content) => {
      const isActive = content.dataset.value === this.valueValue
      content.dataset.state = isActive ? "active" : "inactive"
      content.hidden = !isActive
      content.setAttribute("tabindex", isActive ? "0" : "-1")
    })
  }
}
