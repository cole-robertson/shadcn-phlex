import { Controller } from "@hotwired/stimulus"

// Replicates Vaul Drawer behavior (swipe to dismiss, snap points)
export default class extends Controller {
  static targets = ["trigger", "overlay", "content", "close", "handle"]
  static values = {
    open: { type: Boolean, default: false },
    direction: { type: String, default: "bottom" },
    closeOnOverlay: { type: Boolean, default: true },
    closeThreshold: { type: Number, default: 0.25 },
  }

  connect() {
    this._onKeydown = this._handleKeydown.bind(this)
    this._onPointerDown = this._handlePointerDown.bind(this)
    this._onPointerMove = this._handlePointerMove.bind(this)
    this._onPointerUp = this._handlePointerUp.bind(this)
    this._dragging = false
    this._startY = 0
    this._startX = 0
    this._currentTranslate = 0
    this._hideTimeouts = []
    this._syncState()
  }

  disconnect() {
    this._hideTimeouts.forEach(id => clearTimeout(id))
    this._hideTimeouts = []
    document.removeEventListener("keydown", this._onKeydown)
    this._unlockScroll()
    this._removeDragListeners()
  }

  toggle() { this.openValue = !this.openValue }
  show() { this.openValue = true }
  hide() { this.openValue = false }

  openValueChanged() { this._syncState() }

  clickOverlay(event) {
    if (this.closeOnOverlayValue && event.target === event.currentTarget) this.hide()
  }

  _syncState() {
    const state = this.openValue ? "open" : "closed"
    this.element.dataset.state = state

    this.overlayTargets.forEach((el) => {
      el.dataset.state = state
      if (this.openValue) el.hidden = false
      else this._hideAfterAnimation(el)
    })

    this.contentTargets.forEach((el) => {
      el.dataset.state = state
      el.style.transform = ""
      if (this.openValue) {
        el.hidden = false
        this._addDragListeners(el)
      } else {
        this._hideAfterAnimation(el)
        this._removeDragListeners()
      }
    })

    if (this.openValue) {
      this._lockScroll()
      document.addEventListener("keydown", this._onKeydown)
    } else {
      this._unlockScroll()
      document.removeEventListener("keydown", this._onKeydown)
    }
  }

  _addDragListeners(el) {
    el.addEventListener("pointerdown", this._onPointerDown)
  }

  _removeDragListeners() {
    document.removeEventListener("pointermove", this._onPointerMove)
    document.removeEventListener("pointerup", this._onPointerUp)
  }

  _handlePointerDown(event) {
    // Only drag from handle or top area
    const handle = event.target.closest('[data-slot="drawer-handle"], [class*="bg-muted"]')
    if (!handle && this.directionValue === "bottom") return

    this._dragging = true
    this._startY = event.clientY
    this._startX = event.clientX
    this._currentTranslate = 0

    document.addEventListener("pointermove", this._onPointerMove)
    document.addEventListener("pointerup", this._onPointerUp)
  }

  _handlePointerMove(event) {
    if (!this._dragging || !this.hasContentTarget) return

    const content = this.contentTarget
    const dir = this.directionValue

    let delta
    if (dir === "bottom") {
      delta = Math.max(0, event.clientY - this._startY)
      content.style.transform = `translateY(${delta}px)`
    } else if (dir === "top") {
      delta = Math.max(0, this._startY - event.clientY)
      content.style.transform = `translateY(-${delta}px)`
    } else if (dir === "right") {
      delta = Math.max(0, event.clientX - this._startX)
      content.style.transform = `translateX(${delta}px)`
    } else if (dir === "left") {
      delta = Math.max(0, this._startX - event.clientX)
      content.style.transform = `translateX(-${delta}px)`
    }
    this._currentTranslate = delta || 0
  }

  _handlePointerUp() {
    this._dragging = false
    this._removeDragListeners()

    if (!this.hasContentTarget) return
    const content = this.contentTarget
    const size = this.directionValue === "left" || this.directionValue === "right"
      ? content.offsetWidth : content.offsetHeight

    if (this._currentTranslate / size > this.closeThresholdValue) {
      this.hide()
    } else {
      content.style.transition = "transform 300ms ease"
      content.style.transform = ""
      const onEnd = () => {
        content.style.transition = ""
        content.removeEventListener("transitionend", onEnd)
      }
      content.addEventListener("transitionend", onEnd)
    }
  }

  _handleKeydown(event) {
    if (event.key === "Escape") { event.preventDefault(); this.hide() }
  }

  _lockScroll() {
    document.body.style.overflow = "hidden"
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
  }

  _unlockScroll() {
    document.body.style.overflow = ""
    document.body.style.paddingRight = ""
  }

  _hideAfterAnimation(el) {
    this._hideTimeouts.push(setTimeout(() => { if (el.dataset.state === "closed") el.hidden = true }, 500))
  }
}
