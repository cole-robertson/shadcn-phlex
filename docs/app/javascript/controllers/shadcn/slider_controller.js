import { Controller } from "@hotwired/stimulus"

// Replicates Radix Slider behavior
// Drag, keyboard (arrows, page up/down, home/end), ARIA, form integration
export default class extends Controller {
  static targets = ["track", "range", "thumb", "input"]
  static values = {
    value: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    disabled: { type: Boolean, default: false },
    orientation: { type: String, default: "horizontal" },
  }

  connect() {
    this._onPointerMove = this._handlePointerMove.bind(this)
    this._onPointerUp = this._handlePointerUp.bind(this)
    this._dragging = false
    this._syncState()
  }

  disconnect() {
    document.removeEventListener("pointermove", this._onPointerMove)
    document.removeEventListener("pointerup", this._onPointerUp)
  }

  // Click on track to set value
  clickTrack(event) {
    if (this.disabledValue) return
    this._setValueFromPointer(event)
  }

  // Start dragging thumb
  startDrag(event) {
    if (this.disabledValue) return
    event.preventDefault()
    this._dragging = true
    document.addEventListener("pointermove", this._onPointerMove)
    document.addEventListener("pointerup", this._onPointerUp)
  }

  // Keyboard control
  keydown(event) {
    if (this.disabledValue) return

    const step = this.stepValue
    const bigStep = (this.maxValue - this.minValue) / 10

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault()
        this.valueValue = Math.min(this.maxValue, this.valueValue + step)
        break
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault()
        this.valueValue = Math.max(this.minValue, this.valueValue - step)
        break
      case "PageUp":
        event.preventDefault()
        this.valueValue = Math.min(this.maxValue, this.valueValue + bigStep)
        break
      case "PageDown":
        event.preventDefault()
        this.valueValue = Math.max(this.minValue, this.valueValue - bigStep)
        break
      case "Home":
        event.preventDefault()
        this.valueValue = this.minValue
        break
      case "End":
        event.preventDefault()
        this.valueValue = this.maxValue
        break
    }

    this.dispatch("change", { detail: { value: this.valueValue } })
  }

  valueValueChanged() { this._syncState() }

  _handlePointerMove(event) {
    if (!this._dragging) return
    this._setValueFromPointer(event)
  }

  _handlePointerUp() {
    this._dragging = false
    document.removeEventListener("pointermove", this._onPointerMove)
    document.removeEventListener("pointerup", this._onPointerUp)
    this.dispatch("change", { detail: { value: this.valueValue } })
  }

  _setValueFromPointer(event) {
    if (!this.hasTrackTarget) return

    const rect = this.trackTarget.getBoundingClientRect()
    let ratio

    if (this.orientationValue === "horizontal") {
      ratio = (event.clientX - rect.left) / rect.width
    } else {
      ratio = 1 - (event.clientY - rect.top) / rect.height
    }

    ratio = Math.max(0, Math.min(1, ratio))
    const raw = this.minValue + ratio * (this.maxValue - this.minValue)
    const stepped = Math.round(raw / this.stepValue) * this.stepValue
    this.valueValue = Math.max(this.minValue, Math.min(this.maxValue, stepped))
  }

  _syncState() {
    const pct = ((this.valueValue - this.minValue) / (this.maxValue - this.minValue)) * 100

    this.rangeTargets.forEach((el) => {
      if (this.orientationValue === "horizontal") {
        el.style.width = `${pct}%`
      } else {
        el.style.height = `${pct}%`
      }
    })

    this.thumbTargets.forEach((el) => {
      if (this.orientationValue === "horizontal") {
        el.style.left = `${pct}%`
        el.style.transform = "translateX(-50%)"
      } else {
        el.style.bottom = `${pct}%`
        el.style.transform = "translateY(50%)"
      }
      el.setAttribute("aria-valuenow", String(this.valueValue))
      el.setAttribute("aria-valuemin", String(this.minValue))
      el.setAttribute("aria-valuemax", String(this.maxValue))
    })

    this.inputTargets.forEach((input) => {
      input.value = String(this.valueValue)
    })
  }
}
