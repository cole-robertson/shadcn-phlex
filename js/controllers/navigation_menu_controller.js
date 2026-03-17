import { Controller } from "@hotwired/stimulus"

// Replicates Radix NavigationMenu behavior
// Hover/click to open submenus, keyboard navigation, viewport
export default class extends Controller {
  static targets = ["item", "trigger", "content", "viewport", "link"]
  static values = {
    activeItem: { type: String, default: "" },
    delayDuration: { type: Number, default: 200 },
  }

  connect() {
    this._showTimeout = null
    this._hideTimeout = null
    this._onClickOutside = this._handleClickOutside.bind(this)
    document.addEventListener("click", this._onClickOutside, true)
  }

  disconnect() {
    clearTimeout(this._showTimeout)
    clearTimeout(this._hideTimeout)
    document.removeEventListener("click", this._onClickOutside, true)
  }

  enterTrigger(event) {
    clearTimeout(this._hideTimeout)
    const value = event.currentTarget.dataset.value
    this._showTimeout = setTimeout(() => {
      this.activeItemValue = value
    }, this.delayDurationValue)
  }

  leaveTrigger() {
    clearTimeout(this._showTimeout)
    this._hideTimeout = setTimeout(() => {
      this.activeItemValue = ""
    }, this.delayDurationValue)
  }

  clickTrigger(event) {
    const value = event.currentTarget.dataset.value
    if (this.activeItemValue === value) {
      this.activeItemValue = ""
    } else {
      this.activeItemValue = value
    }
  }

  enterContent() {
    clearTimeout(this._hideTimeout)
  }

  leaveContent() {
    this._hideTimeout = setTimeout(() => {
      this.activeItemValue = ""
    }, this.delayDurationValue)
  }

  keydown(event) {
    const triggers = this.triggerTargets
    const current = triggers.indexOf(event.currentTarget)

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault()
        triggers[(current + 1) % triggers.length]?.focus()
        break
      case "ArrowLeft":
        event.preventDefault()
        triggers[(current - 1 + triggers.length) % triggers.length]?.focus()
        break
      case "ArrowDown":
        event.preventDefault()
        if (this.activeItemValue) {
          // Focus first link in active content
          const content = this._getActiveContent()
          const firstLink = content?.querySelector('[data-slot="navigation-menu-link"]')
          firstLink?.focus()
        } else {
          this.activeItemValue = event.currentTarget.dataset.value
        }
        break
      case "Escape":
        event.preventDefault()
        this.activeItemValue = ""
        event.currentTarget.focus()
        break
      case "Enter":
      case " ":
        event.preventDefault()
        this.clickTrigger(event)
        break
    }
  }

  contentKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault()
      this.activeItemValue = ""
      // Focus the trigger that opened this content
      const trigger = this.triggerTargets.find(
        (t) => t.dataset.value === this._lastActiveItem
      )
      trigger?.focus()
    }

    // Arrow navigation within content links
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      const links = Array.from(
        this._getActiveContent()?.querySelectorAll('[data-slot="navigation-menu-link"]') || []
      )
      const current = links.indexOf(document.activeElement)
      const next = event.key === "ArrowDown"
        ? (current + 1) % links.length
        : (current - 1 + links.length) % links.length
      links[next]?.focus()
    }
  }

  activeItemValueChanged() {
    this._lastActiveItem = this.activeItemValue || this._lastActiveItem
    this._syncState()
  }

  _syncState() {
    this.triggerTargets.forEach((trigger) => {
      const isActive = trigger.dataset.value === this.activeItemValue
      trigger.dataset.state = isActive ? "open" : "closed"
      trigger.setAttribute("aria-expanded", String(isActive))
    })

    this.contentTargets.forEach((content) => {
      const isActive = content.dataset.value === this.activeItemValue
      content.dataset.state = isActive ? "open" : "closed"
      content.hidden = !isActive

      if (isActive) {
        content.dataset.motion = "from-start"
      }
    })

    // Update viewport
    this.viewportTargets.forEach((viewport) => {
      const hasActive = this.activeItemValue !== ""
      viewport.dataset.state = hasActive ? "open" : "closed"
      viewport.hidden = !hasActive
    })
  }

  _getActiveContent() {
    return this.contentTargets.find((c) => c.dataset.value === this.activeItemValue)
  }

  _handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.activeItemValue = ""
    }
  }
}
