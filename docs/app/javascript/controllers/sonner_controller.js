import { Controller } from "@hotwired/stimulus"

// Vanilla JS Sonner-compatible toast controller
// Uses Sonner's CSS and DOM structure exactly
export default class extends Controller {
  static values = {
    position: { type: String, default: "bottom-right" },
    theme: { type: String, default: "light" },
    richColors: { type: Boolean, default: true },
    closeButton: { type: Boolean, default: true },
    duration: { type: Number, default: 4000 },
    gap: { type: Number, default: 14 },
    offset: { type: Number, default: 32 },
    visibleToasts: { type: Number, default: 3 },
    width: { type: Number, default: 356 },
  }

  connect() {
    this._toasts = []
    this._counter = 0
    this._expanded = false
    this._buildToaster()
    this._bindGlobalEvents()
  }

  disconnect() {
    this._unbindGlobalEvents()
    this._toaster?.remove()
  }

  // ─── Public API via global events ───────────────────────
  show(e)    { this._add({ ...e.detail, type: "default" }) }
  success(e) { this._add({ ...e.detail, type: "success" }) }
  error(e)   { this._add({ ...e.detail, type: "error" }) }
  warning(e) { this._add({ ...e.detail, type: "warning" }) }
  info(e)    { this._add({ ...e.detail, type: "info" }) }

  // ─── Internal ───────────────────────────────────────────
  _buildToaster() {
    const [y, x] = this.positionValue.split("-")
    const t = document.createElement("ol")
    t.setAttribute("data-sonner-toaster", "true")
    t.setAttribute("data-sonner-theme", this._getTheme())
    t.setAttribute("data-rich-colors", String(this.richColorsValue))
    t.setAttribute("data-y-position", y)
    t.setAttribute("data-x-position", x)
    t.setAttribute("dir", "ltr")
    t.setAttribute("tabindex", "-1")
    t.style.setProperty("--front-toast-height", "0px")
    t.style.setProperty("--offset", `${this.offsetValue}px`)
    t.style.setProperty("--width", `${this.widthValue}px`)
    t.style.setProperty("--gap", `${this.gapValue}px`)
    t.style.setProperty(`--offset-${x}`, `${this.offsetValue}px`)
    t.style.setProperty(`--offset-${y}`, `${this.offsetValue}px`)
    t.style.setProperty("--mobile-offset-left", "16px")
    t.style.setProperty("--mobile-offset-right", "16px")
    t.style.setProperty("--mobile-offset-bottom", "16px")
    t.style.setProperty("--mobile-offset-top", "16px")

    t.addEventListener("mouseenter", () => { this._expanded = true; this._updatePositions() })
    t.addEventListener("mouseleave", () => { this._expanded = false; this._updatePositions() })

    document.body.appendChild(t)
    this._toaster = t
  }

  _getTheme() {
    if (this.themeValue === "system") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light"
    }
    return this.themeValue
  }

  _add({ title, description, type = "default", duration, action }) {
    const id = ++this._counter
    const dur = duration || this.durationValue

    // Update theme on each toast in case dark mode changed
    this._toaster.setAttribute("data-sonner-theme", this._getTheme())

    const li = document.createElement("li")
    li.setAttribute("data-sonner-toast", "")
    li.setAttribute("data-styled", "true")
    li.setAttribute("data-mounted", "false")
    li.setAttribute("data-expanded", String(this._expanded))
    li.setAttribute("data-front", "true")
    li.setAttribute("data-type", type)
    li.setAttribute("data-y-position", this.positionValue.split("-")[0])
    li.setAttribute("data-x-position", this.positionValue.split("-")[1])
    li.setAttribute("data-rich-colors", String(this.richColorsValue))
    li.setAttribute("role", "status")
    li.setAttribute("aria-live", "polite")
    li.setAttribute("aria-atomic", "true")
    li.setAttribute("tabindex", "0")
    li.style.setProperty("--index", "0")
    li.style.setProperty("--toasts-before", "0")
    li.style.setProperty("--z-index", String(id))
    li.style.setProperty("--initial-height", "0px")

    let html = ""

    // Icon
    const icon = this._getIcon(type)
    if (icon) html += `<div data-icon="">${icon}</div>`

    // Content
    html += `<div data-content="">`
    if (title) html += `<div data-title="">${this._esc(title)}</div>`
    if (description) html += `<div data-description="">${this._esc(description)}</div>`
    html += `</div>`

    // Action button
    if (action) {
      html += `<button data-button="" data-action-btn="">${this._esc(action)}</button>`
    }

    // Close button
    if (this.closeButtonValue) {
      html += `<button data-close-button="" aria-label="Close toast"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>`
    }

    li.innerHTML = html

    // Close button handler
    const closeBtn = li.querySelector("[data-close-button]")
    if (closeBtn) closeBtn.addEventListener("click", () => this._dismiss(id))

    // Swipe to dismiss
    this._addSwipe(li, id)

    // Push onto stack
    this._toasts.push({ id, el: li, timer: null })
    this._toaster.prepend(li)

    // Measure and mount
    requestAnimationFrame(() => {
      const height = li.getBoundingClientRect().height
      li.style.setProperty("--initial-height", `${height}px`)
      this._toaster.style.setProperty("--front-toast-height", `${height}px`)
      li.setAttribute("data-mounted", "true")
      this._updatePositions()
    })

    // Auto-dismiss
    if (dur > 0) {
      const timer = setTimeout(() => this._dismiss(id), dur)
      this._toasts.find(t => t.id === id).timer = timer
    }
  }

  _dismiss(id) {
    const idx = this._toasts.findIndex(t => t.id === id)
    if (idx === -1) return
    const toast = this._toasts[idx]
    if (toast.timer) clearTimeout(toast.timer)

    toast.el.setAttribute("data-removed", "true")
    toast.el.setAttribute("data-front", String(idx === this._toasts.length - 1))
    toast.el.setAttribute("data-swipe-out", "false")

    setTimeout(() => {
      toast.el.remove()
      this._toasts.splice(idx, 1)
      this._updatePositions()
    }, 400)
  }

  _updatePositions() {
    const toasts = this._toasts
    const total = toasts.length

    toasts.forEach((toast, i) => {
      const frontIdx = total - 1 - i
      toast.el.setAttribute("data-front", String(frontIdx === 0))
      toast.el.setAttribute("data-expanded", String(this._expanded))
      toast.el.style.setProperty("--index", String(frontIdx))
      toast.el.style.setProperty("--toasts-before", String(frontIdx))

      if (this._expanded) {
        // Calculate offset from accumulated heights
        let offset = 0
        for (let j = i + 1; j < total; j++) {
          offset += this._toasts[j].el.getBoundingClientRect().height + this.gapValue
        }
        toast.el.style.setProperty("--offset", `${offset}px`)
      }

      // Hide toasts beyond visible count
      toast.el.setAttribute("data-visible", String(frontIdx < this.visibleToastsValue))
    })
  }

  _addSwipe(el, id) {
    let startY = 0, swipeY = 0
    const yPos = this.positionValue.split("-")[0]

    el.addEventListener("pointerdown", (e) => {
      startY = e.clientY
      el.setAttribute("data-swiping", "true")
      el.style.transition = "none"
    })

    el.addEventListener("pointermove", (e) => {
      if (!startY) return
      const delta = e.clientY - startY
      // Only allow swiping in the dismiss direction
      if ((yPos === "bottom" && delta > 0) || (yPos === "top" && delta < 0)) {
        swipeY = delta
        el.style.setProperty("--swipe-amount-y", `${swipeY}px`)
      }
    })

    el.addEventListener("pointerup", () => {
      el.setAttribute("data-swiping", "false")
      el.style.transition = ""
      if (Math.abs(swipeY) > 80) {
        el.setAttribute("data-swipe-out", "true")
        el.setAttribute("data-swipe-direction", swipeY > 0 ? "down" : "up")
        setTimeout(() => this._dismiss(id), 200)
      } else {
        el.style.setProperty("--swipe-amount-y", "0px")
      }
      startY = 0
      swipeY = 0
    })
  }

  _getIcon(type) {
    const icons = {
      success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>`,
      error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>`,
      warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"/></svg>`,
      info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>`,
    }
    return icons[type] || null
  }

  _esc(str) {
    const d = document.createElement("div")
    d.textContent = str
    return d.innerHTML
  }

  _bindGlobalEvents() {
    this._handlers = {
      "toast:show": (e) => this.show(e),
      "toast:success": (e) => this.success(e),
      "toast:error": (e) => this.error(e),
      "toast:warning": (e) => this.warning(e),
      "toast:info": (e) => this.info(e),
    }
    Object.entries(this._handlers).forEach(([evt, fn]) => document.addEventListener(evt, fn))
  }

  _unbindGlobalEvents() {
    if (!this._handlers) return
    Object.entries(this._handlers).forEach(([evt, fn]) => document.removeEventListener(evt, fn))
  }
}
