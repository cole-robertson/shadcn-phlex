import { Controller } from "@hotwired/stimulus"

// Replicates Sonner toast behavior
// Auto-dismiss, queue management, swipe to dismiss
export default class extends Controller {
  static targets = ["container", "toast"]
  static values = {
    position: { type: String, default: "bottom-right" },
    duration: { type: Number, default: 5000 },
    maxToasts: { type: Number, default: 5 },
  }

  connect() {
    this._toasts = new Map()
    this._counter = 0
    this._hideTimeouts = []

    // Listen for global toast events so buttons outside the controller scope can trigger toasts
    this._globalShow = (e) => this.show(e)
    this._globalSuccess = (e) => this.success(e)
    this._globalError = (e) => this.error(e)
    this._globalWarning = (e) => this.warning(e)
    this._globalInfo = (e) => this.info(e)
    document.addEventListener("toast:show", this._globalShow)
    document.addEventListener("toast:success", this._globalSuccess)
    document.addEventListener("toast:error", this._globalError)
    document.addEventListener("toast:warning", this._globalWarning)
    document.addEventListener("toast:info", this._globalInfo)
  }

  disconnect() {
    this._toasts.forEach((timer) => clearTimeout(timer))
    this._toasts.clear()
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []
    document.removeEventListener("toast:show", this._globalShow)
    document.removeEventListener("toast:success", this._globalSuccess)
    document.removeEventListener("toast:error", this._globalError)
    document.removeEventListener("toast:warning", this._globalWarning)
    document.removeEventListener("toast:info", this._globalInfo)
  }

  // Public API: works with event.detail (custom events) or event.params (Stimulus actions)
  show(event) {
    const data = event.detail || event.params || {}
    const { title, description, variant = "default", duration, action } = data
    this._addToast({ title, description, variant, duration: duration || this.durationValue, action })
  }

  success(event) {
    const data = event.detail || event.params || {}
    this._addToast({ ...data, variant: "success", duration: data.duration || this.durationValue })
  }

  error(event) {
    const data = event.detail || event.params || {}
    this._addToast({ ...data, variant: "error", duration: data.duration || this.durationValue })
  }

  warning(event) {
    const data = event.detail || event.params || {}
    this._addToast({ ...data, variant: "warning", duration: data.duration || this.durationValue })
  }

  info(event) {
    const data = event.detail || event.params || {}
    this._addToast({ ...data, variant: "info", duration: data.duration || this.durationValue })
  }

  dismiss(event) {
    const toast = event.currentTarget.closest('[data-slot="toast"]')
    if (toast) this._removeToast(toast)
  }

  _addToast({ title, description, variant, duration, action }) {
    const id = `toast-${++this._counter}`
    const container = this.hasContainerTarget ? this.containerTarget : this.element

    // Enforce max toasts
    const existing = container.querySelectorAll('[data-slot="toast"]')
    if (existing.length >= this.maxToastsValue) {
      this._removeToast(existing[0])
    }

    const toast = document.createElement("div")
    toast.dataset.slot = "toast"
    toast.dataset.variant = variant
    toast.dataset.state = "open"
    toast.id = id
    toast.setAttribute("role", "alert")
    toast.className = this._getToastClasses(variant)

    let html = '<div class="grid gap-1">'
    if (title) html += `<div data-slot="toast-title" class="text-sm font-semibold">${this._escapeHtml(title)}</div>`
    if (description) html += `<div data-slot="toast-description" class="text-sm opacity-90">${this._escapeHtml(description)}</div>`
    html += "</div>"

    if (action) {
      html += `<button data-slot="toast-action" class="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary">${this._escapeHtml(action.label)}</button>`
    }

    // Close button
    html += `<button data-action="shadcn--toast#dismiss" class="absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>`

    toast.innerHTML = html

    // Add action handler
    if (action?.handler) {
      const actionBtn = toast.querySelector('[data-slot="toast-action"]')
      if (actionBtn) {
        actionBtn.addEventListener("click", () => {
          action.handler()
          this._removeToast(toast)
        })
      }
    }

    // Swipe to dismiss
    this._addSwipeToDismiss(toast)

    container.appendChild(toast)

    // Auto-dismiss
    if (duration > 0) {
      const timer = setTimeout(() => this._removeToast(toast), duration)
      this._toasts.set(id, timer)
    }

    // Pause on hover
    toast.addEventListener("mouseenter", () => {
      const timer = this._toasts.get(id)
      if (timer) clearTimeout(timer)
    })
    toast.addEventListener("mouseleave", () => {
      if (duration > 0) {
        const timer = setTimeout(() => this._removeToast(toast), duration)
        this._toasts.set(id, timer)
      }
    })
  }

  _removeToast(toast) {
    const id = toast.id
    const timer = this._toasts.get(id)
    if (timer) clearTimeout(timer)
    this._toasts.delete(id)

    toast.dataset.state = "closed"
    toast.style.transition = "opacity 200ms, transform 200ms"
    toast.style.opacity = "0"
    toast.style.transform = "translateX(100%)"

    this._hideTimeouts.push(setTimeout(() => toast.remove(), 200))
  }

  _addSwipeToDismiss(toast) {
    let startX = 0
    let currentX = 0

    toast.addEventListener("pointerdown", (e) => {
      startX = e.clientX
      toast.style.transition = "none"
    })

    toast.addEventListener("pointermove", (e) => {
      if (!startX) return
      currentX = e.clientX - startX
      if (currentX > 0) {
        toast.style.transform = `translateX(${currentX}px)`
        toast.style.opacity = String(1 - currentX / 200)
      }
    })

    toast.addEventListener("pointerup", () => {
      if (currentX > 100) {
        this._removeToast(toast)
      } else {
        toast.style.transition = "transform 200ms, opacity 200ms"
        toast.style.transform = ""
        toast.style.opacity = ""
      }
      startX = 0
      currentX = 0
    })
  }

  _getToastClasses(variant) {
    const base = "group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all"
    const variants = {
      default: "border bg-background text-foreground",
      success: "border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100",
      error: "border-destructive/50 bg-destructive text-white",
      warning: "border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100",
      info: "border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100",
    }
    return `${base} ${variants[variant] || variants.default}`
  }

  _escapeHtml(str) {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
  }
}
