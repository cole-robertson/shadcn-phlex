import { Controller } from "@hotwired/stimulus"

// Replicates Radix Accordion behavior
// Supports single (default) or multiple open items
// data-type="single" | "multiple"
// data-collapsible="true" allows closing all items in single mode
export default class extends Controller {
  static targets = ["item", "trigger", "content"]
  static values = {
    type: { type: String, default: "single" },
    collapsible: { type: Boolean, default: false },
  }

  connect() {
    this.itemTargets.forEach((item) => {
      const content = item.querySelector('[data-slot="accordion-content"]')
      if (content && item.dataset.state !== "open") {
        content.hidden = true
        content.dataset.state = "closed"
      } else if (content && item.dataset.state === "open") {
        content.hidden = false
        content.dataset.state = "open"
      }
    })
  }

  toggle(event) {
    const trigger = event.currentTarget
    const item = trigger.closest('[data-slot="accordion-item"]')
    if (!item) return

    const isOpen = item.dataset.state === "open"

    if (this.typeValue === "single") {
      // Close all other items
      this.itemTargets.forEach((otherItem) => {
        if (otherItem !== item && otherItem.dataset.state === "open") {
          this._closeItem(otherItem)
        }
      })
    }

    if (isOpen && (this.collapsibleValue || this.typeValue === "multiple")) {
      this._closeItem(item)
    } else if (!isOpen) {
      this._openItem(item)
    }
  }

  keydown(event) {
    const triggers = this.triggerTargets
    const index = triggers.indexOf(event.currentTarget)
    let nextIndex

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        nextIndex = (index + 1) % triggers.length
        triggers[nextIndex].focus()
        break
      case "ArrowUp":
        event.preventDefault()
        nextIndex = (index - 1 + triggers.length) % triggers.length
        triggers[nextIndex].focus()
        break
      case "Home":
        event.preventDefault()
        triggers[0].focus()
        break
      case "End":
        event.preventDefault()
        triggers[triggers.length - 1].focus()
        break
    }
  }

  _openItem(item) {
    const content = item.querySelector('[data-slot="accordion-content"]')
    const trigger = item.querySelector('[data-slot="accordion-trigger"]')
    if (!content) return

    item.dataset.state = "open"
    if (trigger) {
      trigger.dataset.state = "open"
      trigger.setAttribute("aria-expanded", "true")
    }
    content.dataset.state = "open"
    content.hidden = false

    // Animate open
    const height = content.scrollHeight
    content.style.height = "0px"
    content.style.overflow = "hidden"
    requestAnimationFrame(() => {
      content.style.transition = "height 200ms ease-out"
      content.style.height = `${height}px`
      const onEnd = () => {
        content.style.height = ""
        content.style.overflow = ""
        content.style.transition = ""
        content.removeEventListener("transitionend", onEnd)
      }
      content.addEventListener("transitionend", onEnd)
    })
  }

  _closeItem(item) {
    const content = item.querySelector('[data-slot="accordion-content"]')
    const trigger = item.querySelector('[data-slot="accordion-trigger"]')
    if (!content) return

    // Animate close
    const height = content.scrollHeight
    content.style.height = `${height}px`
    content.style.overflow = "hidden"
    requestAnimationFrame(() => {
      content.style.transition = "height 200ms ease-out"
      content.style.height = "0px"
      const onEnd = () => {
        content.hidden = true
        content.style.height = ""
        content.style.overflow = ""
        content.style.transition = ""
        item.dataset.state = "closed"
        if (trigger) {
          trigger.dataset.state = "closed"
          trigger.setAttribute("aria-expanded", "false")
        }
        content.dataset.state = "closed"
        content.removeEventListener("transitionend", onEnd)
      }
      content.addEventListener("transitionend", onEnd)
    })
  }
}
