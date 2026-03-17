import { Controller } from "@hotwired/stimulus"

// Dark mode controller for Shadcn Phlex
//
// Usage:
//   <div data-controller="shadcn--dark-mode"
//        data-shadcn--dark-mode-mode-value="system">
//     <button data-action="click->shadcn--dark-mode#toggle">Toggle</button>
//   </div>
//
// Values:
//   mode: "light" | "dark" | "system" (default: "system")
//
// Actions:
//   toggle()    - Cycles: light → dark → system
//   setLight()  - Force light mode
//   setDark()   - Force dark mode
//   setSystem() - Follow OS preference

export default class extends Controller {
  static values = {
    mode: { type: String, default: "system" }
  }

  connect() {
    // Read stored preference, or fall back to current value
    const stored = localStorage.getItem("theme")
    if (stored && ["light", "dark", "system"].includes(stored)) {
      this.modeValue = stored
    }

    // Listen for OS preference changes
    this._mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    this._onMediaChange = this._handleMediaChange.bind(this)
    this._mediaQuery.addEventListener("change", this._onMediaChange)

    this._apply()
  }

  disconnect() {
    if (this._mediaQuery) {
      this._mediaQuery.removeEventListener("change", this._onMediaChange)
    }
  }

  modeValueChanged() {
    this._apply()
  }

  // ── Actions ──────────────────────────────────────────────

  toggle() {
    const cycle = { light: "dark", dark: "system", system: "light" }
    this.modeValue = cycle[this.modeValue] || "system"
  }

  setLight() {
    this.modeValue = "light"
  }

  setDark() {
    this.modeValue = "dark"
  }

  setSystem() {
    this.modeValue = "system"
  }

  // ── Private ──────────────────────────────────────────────

  _apply() {
    const isDark = this._shouldBeDark()

    document.documentElement.classList.toggle("dark", isDark)

    // Persist preference
    localStorage.setItem("theme", this.modeValue)

    // Dispatch custom event
    document.dispatchEvent(
      new CustomEvent("theme:change", {
        detail: { mode: this.modeValue, dark: isDark }
      })
    )
  }

  _shouldBeDark() {
    if (this.modeValue === "dark") return true
    if (this.modeValue === "light") return false
    // system
    return this._mediaQuery?.matches ?? false
  }

  _handleMediaChange() {
    if (this.modeValue === "system") {
      this._apply()
    }
  }
}
