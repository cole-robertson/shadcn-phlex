import { Controller } from "@hotwired/stimulus"

// Simple controller to dispatch toast events to document
// so the global toaster picks them up
export default class extends Controller {
  static values = {
    title: String,
    description: String,
    variant: { type: String, default: "default" },
  }

  fire() {
    const eventName = this.variantValue === "default" ? "toast:show" : `toast:${this.variantValue}`
    document.dispatchEvent(new CustomEvent(eventName, {
      detail: {
        title: this.titleValue,
        description: this.descriptionValue,
      }
    }))
  }
}
