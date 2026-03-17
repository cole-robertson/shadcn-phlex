(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/@rails/actioncable/src/adapters.js
  var adapters_default;
  var init_adapters = __esm({
    "node_modules/@rails/actioncable/src/adapters.js"() {
      adapters_default = {
        logger: typeof console !== "undefined" ? console : void 0,
        WebSocket: typeof WebSocket !== "undefined" ? WebSocket : void 0
      };
    }
  });

  // node_modules/@rails/actioncable/src/logger.js
  var logger_default;
  var init_logger = __esm({
    "node_modules/@rails/actioncable/src/logger.js"() {
      init_adapters();
      logger_default = {
        log(...messages) {
          if (this.enabled) {
            messages.push(Date.now());
            adapters_default.logger.log("[ActionCable]", ...messages);
          }
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection_monitor.js
  var now, secondsSince, ConnectionMonitor, connection_monitor_default;
  var init_connection_monitor = __esm({
    "node_modules/@rails/actioncable/src/connection_monitor.js"() {
      init_logger();
      now = () => (/* @__PURE__ */ new Date()).getTime();
      secondsSince = (time) => (now() - time) / 1e3;
      ConnectionMonitor = class {
        constructor(connection) {
          this.visibilityDidChange = this.visibilityDidChange.bind(this);
          this.connection = connection;
          this.reconnectAttempts = 0;
        }
        start() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            addEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log(`ConnectionMonitor started. stale threshold = ${this.constructor.staleThreshold} s`);
          }
        }
        stop() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            removeEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log("ConnectionMonitor stopped");
          }
        }
        isRunning() {
          return this.startedAt && !this.stoppedAt;
        }
        recordMessage() {
          this.pingedAt = now();
        }
        recordConnect() {
          this.reconnectAttempts = 0;
          delete this.disconnectedAt;
          logger_default.log("ConnectionMonitor recorded connect");
        }
        recordDisconnect() {
          this.disconnectedAt = now();
          logger_default.log("ConnectionMonitor recorded disconnect");
        }
        // Private
        startPolling() {
          this.stopPolling();
          this.poll();
        }
        stopPolling() {
          clearTimeout(this.pollTimeout);
        }
        poll() {
          this.pollTimeout = setTimeout(
            () => {
              this.reconnectIfStale();
              this.poll();
            },
            this.getPollInterval()
          );
        }
        getPollInterval() {
          const { staleThreshold, reconnectionBackoffRate } = this.constructor;
          const backoff = Math.pow(1 + reconnectionBackoffRate, Math.min(this.reconnectAttempts, 10));
          const jitterMax = this.reconnectAttempts === 0 ? 1 : reconnectionBackoffRate;
          const jitter = jitterMax * Math.random();
          return staleThreshold * 1e3 * backoff * (1 + jitter);
        }
        reconnectIfStale() {
          if (this.connectionIsStale()) {
            logger_default.log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, time stale = ${secondsSince(this.refreshedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`);
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              logger_default.log(`ConnectionMonitor skipping reopening recent disconnect. time disconnected = ${secondsSince(this.disconnectedAt)} s`);
            } else {
              logger_default.log("ConnectionMonitor reopening");
              this.connection.reopen();
            }
          }
        }
        get refreshedAt() {
          return this.pingedAt ? this.pingedAt : this.startedAt;
        }
        connectionIsStale() {
          return secondsSince(this.refreshedAt) > this.constructor.staleThreshold;
        }
        disconnectedRecently() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        }
        visibilityDidChange() {
          if (document.visibilityState === "visible") {
            setTimeout(
              () => {
                if (this.connectionIsStale() || !this.connection.isOpen()) {
                  logger_default.log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`);
                  this.connection.reopen();
                }
              },
              200
            );
          }
        }
      };
      ConnectionMonitor.staleThreshold = 6;
      ConnectionMonitor.reconnectionBackoffRate = 0.15;
      connection_monitor_default = ConnectionMonitor;
    }
  });

  // node_modules/@rails/actioncable/src/internal.js
  var internal_default;
  var init_internal = __esm({
    "node_modules/@rails/actioncable/src/internal.js"() {
      internal_default = {
        "message_types": {
          "welcome": "welcome",
          "disconnect": "disconnect",
          "ping": "ping",
          "confirmation": "confirm_subscription",
          "rejection": "reject_subscription"
        },
        "disconnect_reasons": {
          "unauthorized": "unauthorized",
          "invalid_request": "invalid_request",
          "server_restart": "server_restart",
          "remote": "remote"
        },
        "default_mount_path": "/cable",
        "protocols": [
          "actioncable-v1-json",
          "actioncable-unsupported"
        ]
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection.js
  var message_types, protocols, supportedProtocols, indexOf, Connection, connection_default;
  var init_connection = __esm({
    "node_modules/@rails/actioncable/src/connection.js"() {
      init_adapters();
      init_connection_monitor();
      init_internal();
      init_logger();
      ({ message_types, protocols } = internal_default);
      supportedProtocols = protocols.slice(0, protocols.length - 1);
      indexOf = [].indexOf;
      Connection = class {
        constructor(consumer2) {
          this.open = this.open.bind(this);
          this.consumer = consumer2;
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new connection_monitor_default(this);
          this.disconnected = true;
        }
        send(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        }
        open() {
          if (this.isActive()) {
            logger_default.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`);
            return false;
          } else {
            const socketProtocols = [...protocols, ...this.consumer.subprotocols || []];
            logger_default.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${socketProtocols}`);
            if (this.webSocket) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new adapters_default.WebSocket(this.consumer.url, socketProtocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        }
        close({ allowReconnect } = { allowReconnect: true }) {
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isOpen()) {
            return this.webSocket.close();
          }
        }
        reopen() {
          logger_default.log(`Reopening WebSocket, current state is ${this.getState()}`);
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error2) {
              logger_default.log("Failed to reopen WebSocket", error2);
            } finally {
              logger_default.log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`);
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        }
        getProtocol() {
          if (this.webSocket) {
            return this.webSocket.protocol;
          }
        }
        isOpen() {
          return this.isState("open");
        }
        isActive() {
          return this.isState("open", "connecting");
        }
        triedToReconnect() {
          return this.monitor.reconnectAttempts > 0;
        }
        // Private
        isProtocolSupported() {
          return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
        }
        isState(...states) {
          return indexOf.call(states, this.getState()) >= 0;
        }
        getState() {
          if (this.webSocket) {
            for (let state in adapters_default.WebSocket) {
              if (adapters_default.WebSocket[state] === this.webSocket.readyState) {
                return state.toLowerCase();
              }
            }
          }
          return null;
        }
        installEventHandlers() {
          for (let eventName in this.events) {
            const handler = this.events[eventName].bind(this);
            this.webSocket[`on${eventName}`] = handler;
          }
        }
        uninstallEventHandlers() {
          for (let eventName in this.events) {
            this.webSocket[`on${eventName}`] = function() {
            };
          }
        }
      };
      Connection.reopenDelay = 500;
      Connection.prototype.events = {
        message(event) {
          if (!this.isProtocolSupported()) {
            return;
          }
          const { identifier, message, reason, reconnect, type } = JSON.parse(event.data);
          this.monitor.recordMessage();
          switch (type) {
            case message_types.welcome:
              if (this.triedToReconnect()) {
                this.reconnectAttempted = true;
              }
              this.monitor.recordConnect();
              return this.subscriptions.reload();
            case message_types.disconnect:
              logger_default.log(`Disconnecting. Reason: ${reason}`);
              return this.close({ allowReconnect: reconnect });
            case message_types.ping:
              return null;
            case message_types.confirmation:
              this.subscriptions.confirmSubscription(identifier);
              if (this.reconnectAttempted) {
                this.reconnectAttempted = false;
                return this.subscriptions.notify(identifier, "connected", { reconnected: true });
              } else {
                return this.subscriptions.notify(identifier, "connected", { reconnected: false });
              }
            case message_types.rejection:
              return this.subscriptions.reject(identifier);
            default:
              return this.subscriptions.notify(identifier, "received", message);
          }
        },
        open() {
          logger_default.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`);
          this.disconnected = false;
          if (!this.isProtocolSupported()) {
            logger_default.log("Protocol is unsupported. Stopping monitor and disconnecting.");
            return this.close({ allowReconnect: false });
          }
        },
        close(event) {
          logger_default.log("WebSocket onclose event");
          if (this.disconnected) {
            return;
          }
          this.disconnected = true;
          this.monitor.recordDisconnect();
          return this.subscriptions.notifyAll("disconnected", { willAttemptReconnect: this.monitor.isRunning() });
        },
        error() {
          logger_default.log("WebSocket onerror event");
        }
      };
      connection_default = Connection;
    }
  });

  // node_modules/@rails/actioncable/src/subscription.js
  var extend, Subscription;
  var init_subscription = __esm({
    "node_modules/@rails/actioncable/src/subscription.js"() {
      extend = function(object, properties) {
        if (properties != null) {
          for (let key in properties) {
            const value = properties[key];
            object[key] = value;
          }
        }
        return object;
      };
      Subscription = class {
        constructor(consumer2, params = {}, mixin) {
          this.consumer = consumer2;
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }
        // Perform a channel action with the optional data passed as an attribute
        perform(action, data = {}) {
          data.action = action;
          return this.send(data);
        }
        send(data) {
          return this.consumer.send({ command: "message", identifier: this.identifier, data: JSON.stringify(data) });
        }
        unsubscribe() {
          return this.consumer.subscriptions.remove(this);
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/subscription_guarantor.js
  var SubscriptionGuarantor, subscription_guarantor_default;
  var init_subscription_guarantor = __esm({
    "node_modules/@rails/actioncable/src/subscription_guarantor.js"() {
      init_logger();
      SubscriptionGuarantor = class {
        constructor(subscriptions) {
          this.subscriptions = subscriptions;
          this.pendingSubscriptions = [];
        }
        guarantee(subscription) {
          if (this.pendingSubscriptions.indexOf(subscription) == -1) {
            logger_default.log(`SubscriptionGuarantor guaranteeing ${subscription.identifier}`);
            this.pendingSubscriptions.push(subscription);
          } else {
            logger_default.log(`SubscriptionGuarantor already guaranteeing ${subscription.identifier}`);
          }
          this.startGuaranteeing();
        }
        forget(subscription) {
          logger_default.log(`SubscriptionGuarantor forgetting ${subscription.identifier}`);
          this.pendingSubscriptions = this.pendingSubscriptions.filter((s) => s !== subscription);
        }
        startGuaranteeing() {
          this.stopGuaranteeing();
          this.retrySubscribing();
        }
        stopGuaranteeing() {
          clearTimeout(this.retryTimeout);
        }
        retrySubscribing() {
          this.retryTimeout = setTimeout(
            () => {
              if (this.subscriptions && typeof this.subscriptions.subscribe === "function") {
                this.pendingSubscriptions.map((subscription) => {
                  logger_default.log(`SubscriptionGuarantor resubscribing ${subscription.identifier}`);
                  this.subscriptions.subscribe(subscription);
                });
              }
            },
            500
          );
        }
      };
      subscription_guarantor_default = SubscriptionGuarantor;
    }
  });

  // node_modules/@rails/actioncable/src/subscriptions.js
  var Subscriptions;
  var init_subscriptions = __esm({
    "node_modules/@rails/actioncable/src/subscriptions.js"() {
      init_logger();
      init_subscription();
      init_subscription_guarantor();
      Subscriptions = class {
        constructor(consumer2) {
          this.consumer = consumer2;
          this.guarantor = new subscription_guarantor_default(this);
          this.subscriptions = [];
        }
        create(channelName, mixin) {
          const channel = channelName;
          const params = typeof channel === "object" ? channel : { channel };
          const subscription = new Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        }
        // Private
        add(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.subscribe(subscription);
          return subscription;
        }
        remove(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        }
        reject(identifier) {
          return this.findAll(identifier).map((subscription) => {
            this.forget(subscription);
            this.notify(subscription, "rejected");
            return subscription;
          });
        }
        forget(subscription) {
          this.guarantor.forget(subscription);
          this.subscriptions = this.subscriptions.filter((s) => s !== subscription);
          return subscription;
        }
        findAll(identifier) {
          return this.subscriptions.filter((s) => s.identifier === identifier);
        }
        reload() {
          return this.subscriptions.map((subscription) => this.subscribe(subscription));
        }
        notifyAll(callbackName, ...args) {
          return this.subscriptions.map((subscription) => this.notify(subscription, callbackName, ...args));
        }
        notify(subscription, callbackName, ...args) {
          let subscriptions;
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          return subscriptions.map((subscription2) => typeof subscription2[callbackName] === "function" ? subscription2[callbackName](...args) : void 0);
        }
        subscribe(subscription) {
          if (this.sendCommand(subscription, "subscribe")) {
            this.guarantor.guarantee(subscription);
          }
        }
        confirmSubscription(identifier) {
          logger_default.log(`Subscription confirmed ${identifier}`);
          this.findAll(identifier).map((subscription) => this.guarantor.forget(subscription));
        }
        sendCommand(subscription, command) {
          const { identifier } = subscription;
          return this.consumer.send({ command, identifier });
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/consumer.js
  function createWebSocketURL(url) {
    if (typeof url === "function") {
      url = url();
    }
    if (url && !/^wss?:/i.test(url)) {
      const a = document.createElement("a");
      a.href = url;
      a.href = a.href;
      a.protocol = a.protocol.replace("http", "ws");
      return a.href;
    } else {
      return url;
    }
  }
  var Consumer;
  var init_consumer = __esm({
    "node_modules/@rails/actioncable/src/consumer.js"() {
      init_connection();
      init_subscriptions();
      Consumer = class {
        constructor(url) {
          this._url = url;
          this.subscriptions = new Subscriptions(this);
          this.connection = new connection_default(this);
          this.subprotocols = [];
        }
        get url() {
          return createWebSocketURL(this._url);
        }
        send(data) {
          return this.connection.send(data);
        }
        connect() {
          return this.connection.open();
        }
        disconnect() {
          return this.connection.close({ allowReconnect: false });
        }
        ensureActiveConnection() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        }
        addSubProtocol(subprotocol) {
          this.subprotocols = [...this.subprotocols, subprotocol];
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/index.js
  var src_exports = {};
  __export(src_exports, {
    Connection: () => connection_default,
    ConnectionMonitor: () => connection_monitor_default,
    Consumer: () => Consumer,
    INTERNAL: () => internal_default,
    Subscription: () => Subscription,
    SubscriptionGuarantor: () => subscription_guarantor_default,
    Subscriptions: () => Subscriptions,
    adapters: () => adapters_default,
    createConsumer: () => createConsumer,
    createWebSocketURL: () => createWebSocketURL,
    getConfig: () => getConfig,
    logger: () => logger_default
  });
  function createConsumer(url = getConfig("url") || internal_default.default_mount_path) {
    return new Consumer(url);
  }
  function getConfig(name) {
    const element = document.head.querySelector(`meta[name='action-cable-${name}']`);
    if (element) {
      return element.getAttribute("content");
    }
  }
  var init_src = __esm({
    "node_modules/@rails/actioncable/src/index.js"() {
      init_adapters();
      init_connection();
      init_connection_monitor();
      init_consumer();
      init_internal();
      init_logger();
      init_subscription();
      init_subscription_guarantor();
      init_subscriptions();
    }
  });

  // node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js
  var turbo_es2017_esm_exports = {};
  __export(turbo_es2017_esm_exports, {
    FetchEnctype: () => FetchEnctype,
    FetchMethod: () => FetchMethod,
    FetchRequest: () => FetchRequest,
    FetchResponse: () => FetchResponse,
    FrameElement: () => FrameElement,
    FrameLoadingStyle: () => FrameLoadingStyle,
    FrameRenderer: () => FrameRenderer,
    PageRenderer: () => PageRenderer,
    PageSnapshot: () => PageSnapshot,
    StreamActions: () => StreamActions,
    StreamElement: () => StreamElement,
    StreamSourceElement: () => StreamSourceElement,
    cache: () => cache,
    config: () => config,
    connectStreamSource: () => connectStreamSource,
    disconnectStreamSource: () => disconnectStreamSource,
    fetch: () => fetchWithTurboHeaders,
    fetchEnctypeFromString: () => fetchEnctypeFromString,
    fetchMethodFromString: () => fetchMethodFromString,
    isSafe: () => isSafe,
    morphBodyElements: () => morphBodyElements,
    morphChildren: () => morphChildren,
    morphElements: () => morphElements,
    morphTurboFrameElements: () => morphTurboFrameElements,
    navigator: () => sessionNavigator,
    registerAdapter: () => registerAdapter,
    renderStreamMessage: () => renderStreamMessage,
    session: () => session,
    setConfirmMethod: () => setConfirmMethod,
    setFormMode: () => setFormMode,
    setProgressBarDelay: () => setProgressBarDelay,
    start: () => start,
    visit: () => visit
  });
  var FrameLoadingStyle = {
    eager: "eager",
    lazy: "lazy"
  };
  var FrameElement = class _FrameElement extends HTMLElement {
    static delegateConstructor = void 0;
    loaded = Promise.resolve();
    static get observedAttributes() {
      return ["disabled", "loading", "src"];
    }
    constructor() {
      super();
      this.delegate = new _FrameElement.delegateConstructor(this);
    }
    connectedCallback() {
      this.delegate.connect();
    }
    disconnectedCallback() {
      this.delegate.disconnect();
    }
    reload() {
      return this.delegate.sourceURLReloaded();
    }
    attributeChangedCallback(name) {
      if (name == "loading") {
        this.delegate.loadingStyleChanged();
      } else if (name == "src") {
        this.delegate.sourceURLChanged();
      } else if (name == "disabled") {
        this.delegate.disabledChanged();
      }
    }
    /**
     * Gets the URL to lazily load source HTML from
     */
    get src() {
      return this.getAttribute("src");
    }
    /**
     * Sets the URL to lazily load source HTML from
     */
    set src(value) {
      if (value) {
        this.setAttribute("src", value);
      } else {
        this.removeAttribute("src");
      }
    }
    /**
     * Gets the refresh mode for the frame.
     */
    get refresh() {
      return this.getAttribute("refresh");
    }
    /**
     * Sets the refresh mode for the frame.
     */
    set refresh(value) {
      if (value) {
        this.setAttribute("refresh", value);
      } else {
        this.removeAttribute("refresh");
      }
    }
    get shouldReloadWithMorph() {
      return this.src && this.refresh === "morph";
    }
    /**
     * Determines if the element is loading
     */
    get loading() {
      return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    /**
     * Sets the value of if the element is loading
     */
    set loading(value) {
      if (value) {
        this.setAttribute("loading", value);
      } else {
        this.removeAttribute("loading");
      }
    }
    /**
     * Gets the disabled state of the frame.
     *
     * If disabled, no requests will be intercepted by the frame.
     */
    get disabled() {
      return this.hasAttribute("disabled");
    }
    /**
     * Sets the disabled state of the frame.
     *
     * If disabled, no requests will be intercepted by the frame.
     */
    set disabled(value) {
      if (value) {
        this.setAttribute("disabled", "");
      } else {
        this.removeAttribute("disabled");
      }
    }
    /**
     * Gets the autoscroll state of the frame.
     *
     * If true, the frame will be scrolled into view automatically on update.
     */
    get autoscroll() {
      return this.hasAttribute("autoscroll");
    }
    /**
     * Sets the autoscroll state of the frame.
     *
     * If true, the frame will be scrolled into view automatically on update.
     */
    set autoscroll(value) {
      if (value) {
        this.setAttribute("autoscroll", "");
      } else {
        this.removeAttribute("autoscroll");
      }
    }
    /**
     * Determines if the element has finished loading
     */
    get complete() {
      return !this.delegate.isLoading;
    }
    /**
     * Gets the active state of the frame.
     *
     * If inactive, source changes will not be observed.
     */
    get isActive() {
      return this.ownerDocument === document && !this.isPreview;
    }
    /**
     * Sets the active state of the frame.
     *
     * If inactive, source changes will not be observed.
     */
    get isPreview() {
      return this.ownerDocument?.documentElement?.hasAttribute("data-turbo-preview");
    }
  };
  function frameLoadingStyleFromString(style) {
    switch (style.toLowerCase()) {
      case "lazy":
        return FrameLoadingStyle.lazy;
      default:
        return FrameLoadingStyle.eager;
    }
  }
  var drive = {
    enabled: true,
    progressBarDelay: 500,
    unvisitableExtensions: /* @__PURE__ */ new Set(
      [
        ".7z",
        ".aac",
        ".apk",
        ".avi",
        ".bmp",
        ".bz2",
        ".css",
        ".csv",
        ".deb",
        ".dmg",
        ".doc",
        ".docx",
        ".exe",
        ".gif",
        ".gz",
        ".heic",
        ".heif",
        ".ico",
        ".iso",
        ".jpeg",
        ".jpg",
        ".js",
        ".json",
        ".m4a",
        ".mkv",
        ".mov",
        ".mp3",
        ".mp4",
        ".mpeg",
        ".mpg",
        ".msi",
        ".ogg",
        ".ogv",
        ".pdf",
        ".pkg",
        ".png",
        ".ppt",
        ".pptx",
        ".rar",
        ".rtf",
        ".svg",
        ".tar",
        ".tif",
        ".tiff",
        ".txt",
        ".wav",
        ".webm",
        ".webp",
        ".wma",
        ".wmv",
        ".xls",
        ".xlsx",
        ".xml",
        ".zip"
      ]
    )
  };
  function activateScriptElement(element) {
    if (element.getAttribute("data-turbo-eval") == "false") {
      return element;
    } else {
      const createdScriptElement = document.createElement("script");
      const cspNonce = getCspNonce();
      if (cspNonce) {
        createdScriptElement.nonce = cspNonce;
      }
      createdScriptElement.textContent = element.textContent;
      createdScriptElement.async = false;
      copyElementAttributes(createdScriptElement, element);
      return createdScriptElement;
    }
  }
  function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of sourceElement.attributes) {
      destinationElement.setAttribute(name, value);
    }
  }
  function createDocumentFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
  }
  function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, {
      cancelable,
      bubbles: true,
      composed: true,
      detail
    });
    if (target && target.isConnected) {
      target.dispatchEvent(event);
    } else {
      document.documentElement.dispatchEvent(event);
    }
    return event;
  }
  function cancelEvent(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  function nextRepaint() {
    if (document.visibilityState === "hidden") {
      return nextEventLoopTick();
    } else {
      return nextAnimationFrame();
    }
  }
  function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
  function nextEventLoopTick() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
  }
  function parseHTMLDocument(html = "") {
    return new DOMParser().parseFromString(html, "text/html");
  }
  function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  }
  function interpolate(strings, values) {
    return strings.reduce((result, string, i) => {
      const value = values[i] == void 0 ? "" : values[i];
      return result + string + value;
    }, "");
  }
  function uuid() {
    return Array.from({ length: 36 }).map((_, i) => {
      if (i == 8 || i == 13 || i == 18 || i == 23) {
        return "-";
      } else if (i == 14) {
        return "4";
      } else if (i == 19) {
        return (Math.floor(Math.random() * 4) + 8).toString(16);
      } else {
        return Math.floor(Math.random() * 16).toString(16);
      }
    }).join("");
  }
  function getAttribute(attributeName, ...elements) {
    for (const value of elements.map((element) => element?.getAttribute(attributeName))) {
      if (typeof value == "string") return value;
    }
    return null;
  }
  function hasAttribute(attributeName, ...elements) {
    return elements.some((element) => element && element.hasAttribute(attributeName));
  }
  function markAsBusy(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.setAttribute("busy", "");
      }
      element.setAttribute("aria-busy", "true");
    }
  }
  function clearBusyState(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.removeAttribute("busy");
      }
      element.removeAttribute("aria-busy");
    }
  }
  function waitForLoad(element, timeoutInMilliseconds = 2e3) {
    return new Promise((resolve) => {
      const onComplete = () => {
        element.removeEventListener("error", onComplete);
        element.removeEventListener("load", onComplete);
        resolve();
      };
      element.addEventListener("load", onComplete, { once: true });
      element.addEventListener("error", onComplete, { once: true });
      setTimeout(resolve, timeoutInMilliseconds);
    });
  }
  function getHistoryMethodForAction(action) {
    switch (action) {
      case "replace":
        return history.replaceState;
      case "advance":
      case "restore":
        return history.pushState;
    }
  }
  function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
  }
  function getVisitAction(...elements) {
    const action = getAttribute("data-turbo-action", ...elements);
    return isAction(action) ? action : null;
  }
  function getMetaElement(name) {
    return document.querySelector(`meta[name="${name}"]`);
  }
  function getMetaContent(name) {
    const element = getMetaElement(name);
    return element && element.content;
  }
  function getCspNonce() {
    const element = getMetaElement("csp-nonce");
    if (element) {
      const { nonce, content } = element;
      return nonce == "" ? content : nonce;
    }
  }
  function setMetaContent(name, content) {
    let element = getMetaElement(name);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("name", name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
    return element;
  }
  function findClosestRecursively(element, selector) {
    if (element instanceof Element) {
      return element.closest(selector) || findClosestRecursively(element.assignedSlot || element.getRootNode()?.host, selector);
    }
  }
  function elementIsFocusable(element) {
    const inertDisabledOrHidden = "[inert], :disabled, [hidden], details:not([open]), dialog:not([open])";
    return !!element && element.closest(inertDisabledOrHidden) == null && typeof element.focus == "function";
  }
  function queryAutofocusableElement(elementOrDocumentFragment) {
    return Array.from(elementOrDocumentFragment.querySelectorAll("[autofocus]")).find(elementIsFocusable);
  }
  async function around(callback, reader) {
    const before = reader();
    callback();
    await nextAnimationFrame();
    const after = reader();
    return [before, after];
  }
  function doesNotTargetIFrame(name) {
    if (name === "_blank") {
      return false;
    } else if (name) {
      for (const element of document.getElementsByName(name)) {
        if (element instanceof HTMLIFrameElement) return false;
      }
      return true;
    } else {
      return true;
    }
  }
  function findLinkFromClickTarget(target) {
    const link = findClosestRecursively(target, "a[href], a[xlink\\:href]");
    if (!link) return null;
    if (link.href.startsWith("#")) return null;
    if (link.hasAttribute("download")) return null;
    const linkTarget = link.getAttribute("target");
    if (linkTarget && linkTarget !== "_self") return null;
    return link;
  }
  function debounce(fn, delay) {
    let timeoutId = null;
    return (...args) => {
      const callback = () => fn.apply(this, args);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };
  }
  var submitter = {
    "aria-disabled": {
      beforeSubmit: (submitter2) => {
        submitter2.setAttribute("aria-disabled", "true");
        submitter2.addEventListener("click", cancelEvent);
      },
      afterSubmit: (submitter2) => {
        submitter2.removeAttribute("aria-disabled");
        submitter2.removeEventListener("click", cancelEvent);
      }
    },
    "disabled": {
      beforeSubmit: (submitter2) => submitter2.disabled = true,
      afterSubmit: (submitter2) => submitter2.disabled = false
    }
  };
  var Config = class {
    #submitter = null;
    constructor(config2) {
      Object.assign(this, config2);
    }
    get submitter() {
      return this.#submitter;
    }
    set submitter(value) {
      this.#submitter = submitter[value] || value;
    }
  };
  var forms = new Config({
    mode: "on",
    submitter: "disabled"
  });
  var config = {
    drive,
    forms
  };
  function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
  }
  function getAnchor(url) {
    let anchorMatch;
    if (url.hash) {
      return url.hash.slice(1);
    } else if (anchorMatch = url.href.match(/#(.*)$/)) {
      return anchorMatch[1];
    }
  }
  function getAction$1(form, submitter2) {
    const action = submitter2?.getAttribute("formaction") || form.getAttribute("action") || form.action;
    return expandURL(action);
  }
  function getExtension(url) {
    return (getLastPathComponent(url).match(/\.[^.]*$/) || [])[0] || "";
  }
  function isPrefixedBy(baseURL, url) {
    const prefix = addTrailingSlash(url.origin + url.pathname);
    return addTrailingSlash(baseURL.href) === prefix || baseURL.href.startsWith(prefix);
  }
  function locationIsVisitable(location2, rootLocation) {
    return isPrefixedBy(location2, rootLocation) && !config.drive.unvisitableExtensions.has(getExtension(location2));
  }
  function getLocationForLink(link) {
    return expandURL(link.getAttribute("href") || "");
  }
  function getRequestURL(url) {
    const anchor = getAnchor(url);
    return anchor != null ? url.href.slice(0, -(anchor.length + 1)) : url.href;
  }
  function toCacheKey(url) {
    return getRequestURL(url);
  }
  function urlsAreEqual(left, right) {
    return expandURL(left).href == expandURL(right).href;
  }
  function getPathComponents(url) {
    return url.pathname.split("/").slice(1);
  }
  function getLastPathComponent(url) {
    return getPathComponents(url).slice(-1)[0];
  }
  function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
  }
  var FetchResponse = class {
    constructor(response) {
      this.response = response;
    }
    get succeeded() {
      return this.response.ok;
    }
    get failed() {
      return !this.succeeded;
    }
    get clientError() {
      return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
      return this.response.redirected;
    }
    get location() {
      return expandURL(this.response.url);
    }
    get isHTML() {
      return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
      return this.response.status;
    }
    get contentType() {
      return this.header("Content-Type");
    }
    get responseText() {
      return this.response.clone().text();
    }
    get responseHTML() {
      if (this.isHTML) {
        return this.response.clone().text();
      } else {
        return Promise.resolve(void 0);
      }
    }
    header(name) {
      return this.response.headers.get(name);
    }
  };
  var LimitedSet = class extends Set {
    constructor(maxSize) {
      super();
      this.maxSize = maxSize;
    }
    add(value) {
      if (this.size >= this.maxSize) {
        const iterator = this.values();
        const oldestValue = iterator.next().value;
        this.delete(oldestValue);
      }
      super.add(value);
    }
  };
  var recentRequests = new LimitedSet(20);
  function fetchWithTurboHeaders(url, options = {}) {
    const modifiedHeaders = new Headers(options.headers || {});
    const requestUID = uuid();
    recentRequests.add(requestUID);
    modifiedHeaders.append("X-Turbo-Request-Id", requestUID);
    return window.fetch(url, {
      ...options,
      headers: modifiedHeaders
    });
  }
  function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
      case "get":
        return FetchMethod.get;
      case "post":
        return FetchMethod.post;
      case "put":
        return FetchMethod.put;
      case "patch":
        return FetchMethod.patch;
      case "delete":
        return FetchMethod.delete;
    }
  }
  var FetchMethod = {
    get: "get",
    post: "post",
    put: "put",
    patch: "patch",
    delete: "delete"
  };
  function fetchEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
      case FetchEnctype.multipart:
        return FetchEnctype.multipart;
      case FetchEnctype.plain:
        return FetchEnctype.plain;
      default:
        return FetchEnctype.urlEncoded;
    }
  }
  var FetchEnctype = {
    urlEncoded: "application/x-www-form-urlencoded",
    multipart: "multipart/form-data",
    plain: "text/plain"
  };
  var FetchRequest = class {
    abortController = new AbortController();
    #resolveRequestPromise = (_value) => {
    };
    constructor(delegate, method, location2, requestBody = new URLSearchParams(), target = null, enctype = FetchEnctype.urlEncoded) {
      const [url, body] = buildResourceAndBody(expandURL(location2), method, requestBody, enctype);
      this.delegate = delegate;
      this.url = url;
      this.target = target;
      this.fetchOptions = {
        credentials: "same-origin",
        redirect: "follow",
        method: method.toUpperCase(),
        headers: { ...this.defaultHeaders },
        body,
        signal: this.abortSignal,
        referrer: this.delegate.referrer?.href
      };
      this.enctype = enctype;
    }
    get method() {
      return this.fetchOptions.method;
    }
    set method(value) {
      const fetchBody = this.isSafe ? this.url.searchParams : this.fetchOptions.body || new FormData();
      const fetchMethod = fetchMethodFromString(value) || FetchMethod.get;
      this.url.search = "";
      const [url, body] = buildResourceAndBody(this.url, fetchMethod, fetchBody, this.enctype);
      this.url = url;
      this.fetchOptions.body = body;
      this.fetchOptions.method = fetchMethod.toUpperCase();
    }
    get headers() {
      return this.fetchOptions.headers;
    }
    set headers(value) {
      this.fetchOptions.headers = value;
    }
    get body() {
      if (this.isSafe) {
        return this.url.searchParams;
      } else {
        return this.fetchOptions.body;
      }
    }
    set body(value) {
      this.fetchOptions.body = value;
    }
    get location() {
      return this.url;
    }
    get params() {
      return this.url.searchParams;
    }
    get entries() {
      return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
      this.abortController.abort();
    }
    async perform() {
      const { fetchOptions } = this;
      this.delegate.prepareRequest(this);
      const event = await this.#allowRequestToBeIntercepted(fetchOptions);
      try {
        this.delegate.requestStarted(this);
        if (event.detail.fetchRequest) {
          this.response = event.detail.fetchRequest.response;
        } else {
          this.response = fetchWithTurboHeaders(this.url.href, fetchOptions);
        }
        const response = await this.response;
        return await this.receive(response);
      } catch (error2) {
        if (error2.name !== "AbortError") {
          if (this.#willDelegateErrorHandling(error2)) {
            this.delegate.requestErrored(this, error2);
          }
          throw error2;
        }
      } finally {
        this.delegate.requestFinished(this);
      }
    }
    async receive(response) {
      const fetchResponse = new FetchResponse(response);
      const event = dispatch("turbo:before-fetch-response", {
        cancelable: true,
        detail: { fetchResponse },
        target: this.target
      });
      if (event.defaultPrevented) {
        this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
      } else if (fetchResponse.succeeded) {
        this.delegate.requestSucceededWithResponse(this, fetchResponse);
      } else {
        this.delegate.requestFailedWithResponse(this, fetchResponse);
      }
      return fetchResponse;
    }
    get defaultHeaders() {
      return {
        Accept: "text/html, application/xhtml+xml"
      };
    }
    get isSafe() {
      return isSafe(this.method);
    }
    get abortSignal() {
      return this.abortController.signal;
    }
    acceptResponseType(mimeType) {
      this.headers["Accept"] = [mimeType, this.headers["Accept"]].join(", ");
    }
    async #allowRequestToBeIntercepted(fetchOptions) {
      const requestInterception = new Promise((resolve) => this.#resolveRequestPromise = resolve);
      const event = dispatch("turbo:before-fetch-request", {
        cancelable: true,
        detail: {
          fetchOptions,
          url: this.url,
          resume: this.#resolveRequestPromise
        },
        target: this.target
      });
      this.url = event.detail.url;
      if (event.defaultPrevented) await requestInterception;
      return event;
    }
    #willDelegateErrorHandling(error2) {
      const event = dispatch("turbo:fetch-request-error", {
        target: this.target,
        cancelable: true,
        detail: { request: this, error: error2 }
      });
      return !event.defaultPrevented;
    }
  };
  function isSafe(fetchMethod) {
    return fetchMethodFromString(fetchMethod) == FetchMethod.get;
  }
  function buildResourceAndBody(resource, method, requestBody, enctype) {
    const searchParams = Array.from(requestBody).length > 0 ? new URLSearchParams(entriesExcludingFiles(requestBody)) : resource.searchParams;
    if (isSafe(method)) {
      return [mergeIntoURLSearchParams(resource, searchParams), null];
    } else if (enctype == FetchEnctype.urlEncoded) {
      return [resource, searchParams];
    } else {
      return [resource, requestBody];
    }
  }
  function entriesExcludingFiles(requestBody) {
    const entries = [];
    for (const [name, value] of requestBody) {
      if (value instanceof File) continue;
      else entries.push([name, value]);
    }
    return entries;
  }
  function mergeIntoURLSearchParams(url, requestBody) {
    const searchParams = new URLSearchParams(entriesExcludingFiles(requestBody));
    url.search = searchParams.toString();
    return url;
  }
  var AppearanceObserver = class {
    started = false;
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
      this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.intersectionObserver.observe(this.element);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.intersectionObserver.unobserve(this.element);
      }
    }
    intersect = (entries) => {
      const lastEntry = entries.slice(-1)[0];
      if (lastEntry?.isIntersecting) {
        this.delegate.elementAppearedInViewport(this.element);
      }
    };
  };
  var StreamMessage = class {
    static contentType = "text/vnd.turbo-stream.html";
    static wrap(message) {
      if (typeof message == "string") {
        return new this(createDocumentFragment(message));
      } else {
        return message;
      }
    }
    constructor(fragment) {
      this.fragment = importStreamElements(fragment);
    }
  };
  function importStreamElements(fragment) {
    for (const element of fragment.querySelectorAll("turbo-stream")) {
      const streamElement = document.importNode(element, true);
      for (const inertScriptElement of streamElement.templateElement.content.querySelectorAll("script")) {
        inertScriptElement.replaceWith(activateScriptElement(inertScriptElement));
      }
      element.replaceWith(streamElement);
    }
    return fragment;
  }
  var identity = (key) => key;
  var LRUCache = class {
    keys = [];
    entries = {};
    #toCacheKey;
    constructor(size, toCacheKey2 = identity) {
      this.size = size;
      this.#toCacheKey = toCacheKey2;
    }
    has(key) {
      return this.#toCacheKey(key) in this.entries;
    }
    get(key) {
      if (this.has(key)) {
        const entry = this.read(key);
        this.touch(key);
        return entry;
      }
    }
    put(key, entry) {
      this.write(key, entry);
      this.touch(key);
      return entry;
    }
    clear() {
      for (const key of Object.keys(this.entries)) {
        this.evict(key);
      }
    }
    // Private
    read(key) {
      return this.entries[this.#toCacheKey(key)];
    }
    write(key, entry) {
      this.entries[this.#toCacheKey(key)] = entry;
    }
    touch(key) {
      key = this.#toCacheKey(key);
      const index = this.keys.indexOf(key);
      if (index > -1) this.keys.splice(index, 1);
      this.keys.unshift(key);
      this.trim();
    }
    trim() {
      for (const key of this.keys.splice(this.size)) {
        this.evict(key);
      }
    }
    evict(key) {
      delete this.entries[key];
    }
  };
  var PREFETCH_DELAY = 100;
  var PrefetchCache = class extends LRUCache {
    #prefetchTimeout = null;
    #maxAges = {};
    constructor(size = 1, prefetchDelay = PREFETCH_DELAY) {
      super(size, toCacheKey);
      this.prefetchDelay = prefetchDelay;
    }
    putLater(url, request, ttl) {
      this.#prefetchTimeout = setTimeout(() => {
        request.perform();
        this.put(url, request, ttl);
        this.#prefetchTimeout = null;
      }, this.prefetchDelay);
    }
    put(url, request, ttl = cacheTtl) {
      super.put(url, request);
      this.#maxAges[toCacheKey(url)] = new Date((/* @__PURE__ */ new Date()).getTime() + ttl);
    }
    clear() {
      super.clear();
      if (this.#prefetchTimeout) clearTimeout(this.#prefetchTimeout);
    }
    evict(key) {
      super.evict(key);
      delete this.#maxAges[key];
    }
    has(key) {
      if (super.has(key)) {
        const maxAge = this.#maxAges[toCacheKey(key)];
        return maxAge && maxAge > Date.now();
      } else {
        return false;
      }
    }
  };
  var cacheTtl = 10 * 1e3;
  var prefetchCache = new PrefetchCache();
  var FormSubmissionState = {
    initialized: "initialized",
    requesting: "requesting",
    waiting: "waiting",
    receiving: "receiving",
    stopping: "stopping",
    stopped: "stopped"
  };
  var FormSubmission = class _FormSubmission {
    state = FormSubmissionState.initialized;
    static confirmMethod(message) {
      return Promise.resolve(confirm(message));
    }
    constructor(delegate, formElement, submitter2, mustRedirect = false) {
      const method = getMethod(formElement, submitter2);
      const action = getAction(getFormAction(formElement, submitter2), method);
      const body = buildFormData(formElement, submitter2);
      const enctype = getEnctype(formElement, submitter2);
      this.delegate = delegate;
      this.formElement = formElement;
      this.submitter = submitter2;
      this.fetchRequest = new FetchRequest(this, method, action, body, formElement, enctype);
      this.mustRedirect = mustRedirect;
    }
    get method() {
      return this.fetchRequest.method;
    }
    set method(value) {
      this.fetchRequest.method = value;
    }
    get action() {
      return this.fetchRequest.url.toString();
    }
    set action(value) {
      this.fetchRequest.url = expandURL(value);
    }
    get body() {
      return this.fetchRequest.body;
    }
    get enctype() {
      return this.fetchRequest.enctype;
    }
    get isSafe() {
      return this.fetchRequest.isSafe;
    }
    get location() {
      return this.fetchRequest.url;
    }
    // The submission process
    async start() {
      const { initialized, requesting } = FormSubmissionState;
      const confirmationMessage = getAttribute("data-turbo-confirm", this.submitter, this.formElement);
      if (typeof confirmationMessage === "string") {
        const confirmMethod = typeof config.forms.confirm === "function" ? config.forms.confirm : _FormSubmission.confirmMethod;
        const answer = await confirmMethod(confirmationMessage, this.formElement, this.submitter);
        if (!answer) {
          return;
        }
      }
      if (this.state == initialized) {
        this.state = requesting;
        return this.fetchRequest.perform();
      }
    }
    stop() {
      const { stopping, stopped } = FormSubmissionState;
      if (this.state != stopping && this.state != stopped) {
        this.state = stopping;
        this.fetchRequest.cancel();
        return true;
      }
    }
    // Fetch request delegate
    prepareRequest(request) {
      if (!request.isSafe) {
        const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
        if (token) {
          request.headers["X-CSRF-Token"] = token;
        }
      }
      if (this.requestAcceptsTurboStreamResponse(request)) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      this.state = FormSubmissionState.waiting;
      if (this.submitter) config.forms.submitter.beforeSubmit(this.submitter);
      this.setSubmitsWith();
      markAsBusy(this.formElement);
      dispatch("turbo:submit-start", {
        target: this.formElement,
        detail: { formSubmission: this }
      });
      this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request, response) {
      prefetchCache.clear();
      this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request, response) {
      if (response.clientError || response.serverError) {
        this.delegate.formSubmissionFailedWithResponse(this, response);
        return;
      }
      prefetchCache.clear();
      if (this.requestMustRedirect(request) && responseSucceededWithoutRedirect(response)) {
        const error2 = new Error("Form responses must redirect to another location");
        this.delegate.formSubmissionErrored(this, error2);
      } else {
        this.state = FormSubmissionState.receiving;
        this.result = { success: true, fetchResponse: response };
        this.delegate.formSubmissionSucceededWithResponse(this, response);
      }
    }
    requestFailedWithResponse(request, response) {
      this.result = { success: false, fetchResponse: response };
      this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request, error2) {
      this.result = { success: false, error: error2 };
      this.delegate.formSubmissionErrored(this, error2);
    }
    requestFinished(_request) {
      this.state = FormSubmissionState.stopped;
      if (this.submitter) config.forms.submitter.afterSubmit(this.submitter);
      this.resetSubmitterText();
      clearBusyState(this.formElement);
      dispatch("turbo:submit-end", {
        target: this.formElement,
        detail: { formSubmission: this, ...this.result }
      });
      this.delegate.formSubmissionFinished(this);
    }
    // Private
    setSubmitsWith() {
      if (!this.submitter || !this.submitsWith) return;
      if (this.submitter.matches("button")) {
        this.originalSubmitText = this.submitter.innerHTML;
        this.submitter.innerHTML = this.submitsWith;
      } else if (this.submitter.matches("input")) {
        const input = this.submitter;
        this.originalSubmitText = input.value;
        input.value = this.submitsWith;
      }
    }
    resetSubmitterText() {
      if (!this.submitter || !this.originalSubmitText) return;
      if (this.submitter.matches("button")) {
        this.submitter.innerHTML = this.originalSubmitText;
      } else if (this.submitter.matches("input")) {
        const input = this.submitter;
        input.value = this.originalSubmitText;
      }
    }
    requestMustRedirect(request) {
      return !request.isSafe && this.mustRedirect;
    }
    requestAcceptsTurboStreamResponse(request) {
      return !request.isSafe || hasAttribute("data-turbo-stream", this.submitter, this.formElement);
    }
    get submitsWith() {
      return this.submitter?.getAttribute("data-turbo-submits-with");
    }
  };
  function buildFormData(formElement, submitter2) {
    const formData = new FormData(formElement);
    const name = submitter2?.getAttribute("name");
    const value = submitter2?.getAttribute("value");
    if (name) {
      formData.append(name, value || "");
    }
    return formData;
  }
  function getCookieValue(cookieName) {
    if (cookieName != null) {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      const cookie = cookies.find((cookie2) => cookie2.startsWith(cookieName));
      if (cookie) {
        const value = cookie.split("=").slice(1).join("=");
        return value ? decodeURIComponent(value) : void 0;
      }
    }
  }
  function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
  }
  function getFormAction(formElement, submitter2) {
    const formElementAction = typeof formElement.action === "string" ? formElement.action : null;
    if (submitter2?.hasAttribute("formaction")) {
      return submitter2.getAttribute("formaction") || "";
    } else {
      return formElement.getAttribute("action") || formElementAction || "";
    }
  }
  function getAction(formAction, fetchMethod) {
    const action = expandURL(formAction);
    if (isSafe(fetchMethod)) {
      action.search = "";
    }
    return action;
  }
  function getMethod(formElement, submitter2) {
    const method = submitter2?.getAttribute("formmethod") || formElement.getAttribute("method") || "";
    return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
  }
  function getEnctype(formElement, submitter2) {
    return fetchEnctypeFromString(submitter2?.getAttribute("formenctype") || formElement.enctype);
  }
  var Snapshot = class {
    constructor(element) {
      this.element = element;
    }
    get activeElement() {
      return this.element.ownerDocument.activeElement;
    }
    get children() {
      return [...this.element.children];
    }
    hasAnchor(anchor) {
      return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
      return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
      return this.element.isConnected;
    }
    get firstAutofocusableElement() {
      return queryAutofocusableElement(this.element);
    }
    get permanentElements() {
      return queryPermanentElementsAll(this.element);
    }
    getPermanentElementById(id) {
      return getPermanentElementById(this.element, id);
    }
    getPermanentElementMapForSnapshot(snapshot) {
      const permanentElementMap = {};
      for (const currentPermanentElement of this.permanentElements) {
        const { id } = currentPermanentElement;
        const newPermanentElement = snapshot.getPermanentElementById(id);
        if (newPermanentElement) {
          permanentElementMap[id] = [currentPermanentElement, newPermanentElement];
        }
      }
      return permanentElementMap;
    }
  };
  function getPermanentElementById(node, id) {
    return node.querySelector(`#${id}[data-turbo-permanent]`);
  }
  function queryPermanentElementsAll(node) {
    return node.querySelectorAll("[id][data-turbo-permanent]");
  }
  var FormSubmitObserver = class {
    started = false;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("submit", this.submitCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("submit", this.submitCaptured, true);
        this.started = false;
      }
    }
    submitCaptured = () => {
      this.eventTarget.removeEventListener("submit", this.submitBubbled, false);
      this.eventTarget.addEventListener("submit", this.submitBubbled, false);
    };
    submitBubbled = (event) => {
      if (!event.defaultPrevented) {
        const form = event.target instanceof HTMLFormElement ? event.target : void 0;
        const submitter2 = event.submitter || void 0;
        if (form && submissionDoesNotDismissDialog(form, submitter2) && submissionDoesNotTargetIFrame(form, submitter2) && this.delegate.willSubmitForm(form, submitter2)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.delegate.formSubmitted(form, submitter2);
        }
      }
    };
  };
  function submissionDoesNotDismissDialog(form, submitter2) {
    const method = submitter2?.getAttribute("formmethod") || form.getAttribute("method");
    return method != "dialog";
  }
  function submissionDoesNotTargetIFrame(form, submitter2) {
    const target = submitter2?.getAttribute("formtarget") || form.getAttribute("target");
    return doesNotTargetIFrame(target);
  }
  var View = class {
    #resolveRenderPromise = (_value) => {
    };
    #resolveInterceptionPromise = (_value) => {
    };
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
    }
    // Scrolling
    scrollToAnchor(anchor) {
      const element = this.snapshot.getElementForAnchor(anchor);
      if (element) {
        this.focusElement(element);
        this.scrollToElement(element);
      } else {
        this.scrollToPosition({ x: 0, y: 0 });
      }
    }
    scrollToAnchorFromLocation(location2) {
      this.scrollToAnchor(getAnchor(location2));
    }
    scrollToElement(element) {
      element.scrollIntoView();
    }
    focusElement(element) {
      if (element instanceof HTMLElement) {
        if (element.hasAttribute("tabindex")) {
          element.focus();
        } else {
          element.setAttribute("tabindex", "-1");
          element.focus();
          element.removeAttribute("tabindex");
        }
      }
    }
    scrollToPosition({ x, y }) {
      this.scrollRoot.scrollTo(x, y);
    }
    scrollToTop() {
      this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
      return window;
    }
    // Rendering
    async render(renderer) {
      const { isPreview, shouldRender, willRender, newSnapshot: snapshot } = renderer;
      const shouldInvalidate = willRender;
      if (shouldRender) {
        try {
          this.renderPromise = new Promise((resolve) => this.#resolveRenderPromise = resolve);
          this.renderer = renderer;
          await this.prepareToRenderSnapshot(renderer);
          const renderInterception = new Promise((resolve) => this.#resolveInterceptionPromise = resolve);
          const options = { resume: this.#resolveInterceptionPromise, render: this.renderer.renderElement, renderMethod: this.renderer.renderMethod };
          const immediateRender = this.delegate.allowsImmediateRender(snapshot, options);
          if (!immediateRender) await renderInterception;
          await this.renderSnapshot(renderer);
          this.delegate.viewRenderedSnapshot(snapshot, isPreview, this.renderer.renderMethod);
          this.delegate.preloadOnLoadLinksForView(this.element);
          this.finishRenderingSnapshot(renderer);
        } finally {
          delete this.renderer;
          this.#resolveRenderPromise(void 0);
          delete this.renderPromise;
        }
      } else if (shouldInvalidate) {
        this.invalidate(renderer.reloadReason);
      }
    }
    invalidate(reason) {
      this.delegate.viewInvalidated(reason);
    }
    async prepareToRenderSnapshot(renderer) {
      this.markAsPreview(renderer.isPreview);
      await renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
      if (isPreview) {
        this.element.setAttribute("data-turbo-preview", "");
      } else {
        this.element.removeAttribute("data-turbo-preview");
      }
    }
    markVisitDirection(direction) {
      this.element.setAttribute("data-turbo-visit-direction", direction);
    }
    unmarkVisitDirection() {
      this.element.removeAttribute("data-turbo-visit-direction");
    }
    async renderSnapshot(renderer) {
      await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
      renderer.finishRendering();
    }
  };
  var FrameView = class extends View {
    missing() {
      this.element.innerHTML = `<strong class="turbo-frame-error">Content missing</strong>`;
    }
    get snapshot() {
      return new Snapshot(this.element);
    }
  };
  var LinkInterceptor = class {
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("click", this.clickBubbled);
      document.addEventListener("turbo:click", this.linkClicked);
      document.addEventListener("turbo:before-visit", this.willVisit);
    }
    stop() {
      this.element.removeEventListener("click", this.clickBubbled);
      document.removeEventListener("turbo:click", this.linkClicked);
      document.removeEventListener("turbo:before-visit", this.willVisit);
    }
    clickBubbled = (event) => {
      if (this.clickEventIsSignificant(event)) {
        this.clickEvent = event;
      } else {
        delete this.clickEvent;
      }
    };
    linkClicked = (event) => {
      if (this.clickEvent && this.clickEventIsSignificant(event)) {
        if (this.delegate.shouldInterceptLinkClick(event.target, event.detail.url, event.detail.originalEvent)) {
          this.clickEvent.preventDefault();
          event.preventDefault();
          this.delegate.linkClickIntercepted(event.target, event.detail.url, event.detail.originalEvent);
        }
      }
      delete this.clickEvent;
    };
    willVisit = (_event) => {
      delete this.clickEvent;
    };
    clickEventIsSignificant(event) {
      const target = event.composed ? event.target?.parentElement : event.target;
      const element = findLinkFromClickTarget(target) || target;
      return element instanceof Element && element.closest("turbo-frame, html") == this.element;
    }
  };
  var LinkClickObserver = class {
    started = false;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("click", this.clickCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("click", this.clickCaptured, true);
        this.started = false;
      }
    }
    clickCaptured = () => {
      this.eventTarget.removeEventListener("click", this.clickBubbled, false);
      this.eventTarget.addEventListener("click", this.clickBubbled, false);
    };
    clickBubbled = (event) => {
      if (event instanceof MouseEvent && this.clickEventIsSignificant(event)) {
        const target = event.composedPath && event.composedPath()[0] || event.target;
        const link = findLinkFromClickTarget(target);
        if (link && doesNotTargetIFrame(link.target)) {
          const location2 = getLocationForLink(link);
          if (this.delegate.willFollowLinkToLocation(link, location2, event)) {
            event.preventDefault();
            this.delegate.followedLinkToLocation(link, location2);
          }
        }
      }
    };
    clickEventIsSignificant(event) {
      return !(event.target && event.target.isContentEditable || event.defaultPrevented || event.which > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    }
  };
  var FormLinkClickObserver = class {
    constructor(delegate, element) {
      this.delegate = delegate;
      this.linkInterceptor = new LinkClickObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
    }
    stop() {
      this.linkInterceptor.stop();
    }
    // Link hover observer delegate
    canPrefetchRequestToLocation(link, location2) {
      return false;
    }
    prefetchAndCacheRequestToLocation(link, location2) {
      return;
    }
    // Link click observer delegate
    willFollowLinkToLocation(link, location2, originalEvent) {
      return this.delegate.willSubmitFormLinkToLocation(link, location2, originalEvent) && (link.hasAttribute("data-turbo-method") || link.hasAttribute("data-turbo-stream"));
    }
    followedLinkToLocation(link, location2) {
      const form = document.createElement("form");
      const type = "hidden";
      for (const [name, value] of location2.searchParams) {
        form.append(Object.assign(document.createElement("input"), { type, name, value }));
      }
      const action = Object.assign(location2, { search: "" });
      form.setAttribute("data-turbo", "true");
      form.setAttribute("action", action.href);
      form.setAttribute("hidden", "");
      const method = link.getAttribute("data-turbo-method");
      if (method) form.setAttribute("method", method);
      const turboFrame = link.getAttribute("data-turbo-frame");
      if (turboFrame) form.setAttribute("data-turbo-frame", turboFrame);
      const turboAction = getVisitAction(link);
      if (turboAction) form.setAttribute("data-turbo-action", turboAction);
      const turboConfirm = link.getAttribute("data-turbo-confirm");
      if (turboConfirm) form.setAttribute("data-turbo-confirm", turboConfirm);
      const turboStream = link.hasAttribute("data-turbo-stream");
      if (turboStream) form.setAttribute("data-turbo-stream", "");
      this.delegate.submittedFormLinkToLocation(link, location2, form);
      document.body.appendChild(form);
      form.addEventListener("turbo:submit-end", () => form.remove(), { once: true });
      requestAnimationFrame(() => form.requestSubmit());
    }
  };
  var Bardo = class {
    static async preservingPermanentElements(delegate, permanentElementMap, callback) {
      const bardo = new this(delegate, permanentElementMap);
      bardo.enter();
      await callback();
      bardo.leave();
    }
    constructor(delegate, permanentElementMap) {
      this.delegate = delegate;
      this.permanentElementMap = permanentElementMap;
    }
    enter() {
      for (const id in this.permanentElementMap) {
        const [currentPermanentElement, newPermanentElement] = this.permanentElementMap[id];
        this.delegate.enteringBardo(currentPermanentElement, newPermanentElement);
        this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
      }
    }
    leave() {
      for (const id in this.permanentElementMap) {
        const [currentPermanentElement] = this.permanentElementMap[id];
        this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
        this.replacePlaceholderWithPermanentElement(currentPermanentElement);
        this.delegate.leavingBardo(currentPermanentElement);
      }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
      const placeholder = createPlaceholderForPermanentElement(permanentElement);
      permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
      const clone = permanentElement.cloneNode(true);
      permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
      const placeholder = this.getPlaceholderById(permanentElement.id);
      placeholder?.replaceWith(permanentElement);
    }
    getPlaceholderById(id) {
      return this.placeholders.find((element) => element.content == id);
    }
    get placeholders() {
      return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
  };
  function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
  }
  var Renderer = class {
    #activeElement = null;
    static renderElement(currentElement, newElement) {
    }
    constructor(currentSnapshot, newSnapshot, isPreview, willRender = true) {
      this.currentSnapshot = currentSnapshot;
      this.newSnapshot = newSnapshot;
      this.isPreview = isPreview;
      this.willRender = willRender;
      this.renderElement = this.constructor.renderElement;
      this.promise = new Promise((resolve, reject) => this.resolvingFunctions = { resolve, reject });
    }
    get shouldRender() {
      return true;
    }
    get shouldAutofocus() {
      return true;
    }
    get reloadReason() {
      return;
    }
    prepareToRender() {
      return;
    }
    render() {
    }
    finishRendering() {
      if (this.resolvingFunctions) {
        this.resolvingFunctions.resolve();
        delete this.resolvingFunctions;
      }
    }
    async preservingPermanentElements(callback) {
      await Bardo.preservingPermanentElements(this, this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
      if (this.shouldAutofocus) {
        const element = this.connectedSnapshot.firstAutofocusableElement;
        if (element) {
          element.focus();
        }
      }
    }
    // Bardo delegate
    enteringBardo(currentPermanentElement) {
      if (this.#activeElement) return;
      if (currentPermanentElement.contains(this.currentSnapshot.activeElement)) {
        this.#activeElement = this.currentSnapshot.activeElement;
      }
    }
    leavingBardo(currentPermanentElement) {
      if (currentPermanentElement.contains(this.#activeElement) && this.#activeElement instanceof HTMLElement) {
        this.#activeElement.focus();
        this.#activeElement = null;
      }
    }
    get connectedSnapshot() {
      return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
      return this.currentSnapshot.element;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    get permanentElementMap() {
      return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
    get renderMethod() {
      return "replace";
    }
  };
  var FrameRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      const destinationRange = document.createRange();
      destinationRange.selectNodeContents(currentElement);
      destinationRange.deleteContents();
      const frameElement = newElement;
      const sourceRange = frameElement.ownerDocument?.createRange();
      if (sourceRange) {
        sourceRange.selectNodeContents(frameElement);
        currentElement.appendChild(sourceRange.extractContents());
      }
    }
    constructor(delegate, currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
      super(currentSnapshot, newSnapshot, renderElement, isPreview, willRender);
      this.delegate = delegate;
    }
    get shouldRender() {
      return true;
    }
    async render() {
      await nextRepaint();
      this.preservingPermanentElements(() => {
        this.loadFrameElement();
      });
      this.scrollFrameIntoView();
      await nextRepaint();
      this.focusFirstAutofocusableElement();
      await nextRepaint();
      this.activateScriptElements();
    }
    loadFrameElement() {
      this.delegate.willRenderFrame(this.currentElement, this.newElement);
      this.renderElement(this.currentElement, this.newElement);
    }
    scrollFrameIntoView() {
      if (this.currentElement.autoscroll || this.newElement.autoscroll) {
        const element = this.currentElement.firstElementChild;
        const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
        const behavior = readScrollBehavior(this.currentElement.getAttribute("data-autoscroll-behavior"), "auto");
        if (element) {
          element.scrollIntoView({ block, behavior });
          return true;
        }
      }
      return false;
    }
    activateScriptElements() {
      for (const inertScriptElement of this.newScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    get newScriptElements() {
      return this.currentElement.querySelectorAll("script");
    }
  };
  function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
      return value;
    } else {
      return defaultValue;
    }
  }
  function readScrollBehavior(value, defaultValue) {
    if (value == "auto" || value == "smooth") {
      return value;
    } else {
      return defaultValue;
    }
  }
  var Idiomorph = (function() {
    const noOp = () => {
    };
    const defaults = {
      morphStyle: "outerHTML",
      callbacks: {
        beforeNodeAdded: noOp,
        afterNodeAdded: noOp,
        beforeNodeMorphed: noOp,
        afterNodeMorphed: noOp,
        beforeNodeRemoved: noOp,
        afterNodeRemoved: noOp,
        beforeAttributeUpdated: noOp
      },
      head: {
        style: "merge",
        shouldPreserve: (elt) => elt.getAttribute("im-preserve") === "true",
        shouldReAppend: (elt) => elt.getAttribute("im-re-append") === "true",
        shouldRemove: noOp,
        afterHeadMorphed: noOp
      },
      restoreFocus: true
    };
    function morph(oldNode, newContent, config2 = {}) {
      oldNode = normalizeElement(oldNode);
      const newNode = normalizeParent(newContent);
      const ctx = createMorphContext(oldNode, newNode, config2);
      const morphedNodes = saveAndRestoreFocus(ctx, () => {
        return withHeadBlocking(
          ctx,
          oldNode,
          newNode,
          /** @param {MorphContext} ctx */
          (ctx2) => {
            if (ctx2.morphStyle === "innerHTML") {
              morphChildren2(ctx2, oldNode, newNode);
              return Array.from(oldNode.childNodes);
            } else {
              return morphOuterHTML(ctx2, oldNode, newNode);
            }
          }
        );
      });
      ctx.pantry.remove();
      return morphedNodes;
    }
    function morphOuterHTML(ctx, oldNode, newNode) {
      const oldParent = normalizeParent(oldNode);
      morphChildren2(
        ctx,
        oldParent,
        newNode,
        // these two optional params are the secret sauce
        oldNode,
        // start point for iteration
        oldNode.nextSibling
        // end point for iteration
      );
      return Array.from(oldParent.childNodes);
    }
    function saveAndRestoreFocus(ctx, fn) {
      if (!ctx.config.restoreFocus) return fn();
      let activeElement = (
        /** @type {HTMLInputElement|HTMLTextAreaElement|null} */
        document.activeElement
      );
      if (!(activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
        return fn();
      }
      const { id: activeElementId, selectionStart, selectionEnd } = activeElement;
      const results = fn();
      if (activeElementId && activeElementId !== document.activeElement?.getAttribute("id")) {
        activeElement = ctx.target.querySelector(`[id="${activeElementId}"]`);
        activeElement?.focus();
      }
      if (activeElement && !activeElement.selectionEnd && selectionEnd) {
        activeElement.setSelectionRange(selectionStart, selectionEnd);
      }
      return results;
    }
    const morphChildren2 = /* @__PURE__ */ (function() {
      function morphChildren3(ctx, oldParent, newParent, insertionPoint = null, endPoint = null) {
        if (oldParent instanceof HTMLTemplateElement && newParent instanceof HTMLTemplateElement) {
          oldParent = oldParent.content;
          newParent = newParent.content;
        }
        insertionPoint ||= oldParent.firstChild;
        for (const newChild of newParent.childNodes) {
          if (insertionPoint && insertionPoint != endPoint) {
            const bestMatch = findBestMatch(
              ctx,
              newChild,
              insertionPoint,
              endPoint
            );
            if (bestMatch) {
              if (bestMatch !== insertionPoint) {
                removeNodesBetween(ctx, insertionPoint, bestMatch);
              }
              morphNode(bestMatch, newChild, ctx);
              insertionPoint = bestMatch.nextSibling;
              continue;
            }
          }
          if (newChild instanceof Element) {
            const newChildId = (
              /** @type {String} */
              newChild.getAttribute("id")
            );
            if (ctx.persistentIds.has(newChildId)) {
              const movedChild = moveBeforeById(
                oldParent,
                newChildId,
                insertionPoint,
                ctx
              );
              morphNode(movedChild, newChild, ctx);
              insertionPoint = movedChild.nextSibling;
              continue;
            }
          }
          const insertedNode = createNode(
            oldParent,
            newChild,
            insertionPoint,
            ctx
          );
          if (insertedNode) {
            insertionPoint = insertedNode.nextSibling;
          }
        }
        while (insertionPoint && insertionPoint != endPoint) {
          const tempNode = insertionPoint;
          insertionPoint = insertionPoint.nextSibling;
          removeNode(ctx, tempNode);
        }
      }
      function createNode(oldParent, newChild, insertionPoint, ctx) {
        if (ctx.callbacks.beforeNodeAdded(newChild) === false) return null;
        if (ctx.idMap.has(newChild)) {
          const newEmptyChild = document.createElement(
            /** @type {Element} */
            newChild.tagName
          );
          oldParent.insertBefore(newEmptyChild, insertionPoint);
          morphNode(newEmptyChild, newChild, ctx);
          ctx.callbacks.afterNodeAdded(newEmptyChild);
          return newEmptyChild;
        } else {
          const newClonedChild = document.importNode(newChild, true);
          oldParent.insertBefore(newClonedChild, insertionPoint);
          ctx.callbacks.afterNodeAdded(newClonedChild);
          return newClonedChild;
        }
      }
      const findBestMatch = /* @__PURE__ */ (function() {
        function findBestMatch2(ctx, node, startPoint, endPoint) {
          let softMatch = null;
          let nextSibling = node.nextSibling;
          let siblingSoftMatchCount = 0;
          let cursor = startPoint;
          while (cursor && cursor != endPoint) {
            if (isSoftMatch(cursor, node)) {
              if (isIdSetMatch(ctx, cursor, node)) {
                return cursor;
              }
              if (softMatch === null) {
                if (!ctx.idMap.has(cursor)) {
                  softMatch = cursor;
                }
              }
            }
            if (softMatch === null && nextSibling && isSoftMatch(cursor, nextSibling)) {
              siblingSoftMatchCount++;
              nextSibling = nextSibling.nextSibling;
              if (siblingSoftMatchCount >= 2) {
                softMatch = void 0;
              }
            }
            if (ctx.activeElementAndParents.includes(cursor)) break;
            cursor = cursor.nextSibling;
          }
          return softMatch || null;
        }
        function isIdSetMatch(ctx, oldNode, newNode) {
          let oldSet = ctx.idMap.get(oldNode);
          let newSet = ctx.idMap.get(newNode);
          if (!newSet || !oldSet) return false;
          for (const id of oldSet) {
            if (newSet.has(id)) {
              return true;
            }
          }
          return false;
        }
        function isSoftMatch(oldNode, newNode) {
          const oldElt = (
            /** @type {Element} */
            oldNode
          );
          const newElt = (
            /** @type {Element} */
            newNode
          );
          return oldElt.nodeType === newElt.nodeType && oldElt.tagName === newElt.tagName && // If oldElt has an `id` with possible state and it doesn't match newElt.id then avoid morphing.
          // We'll still match an anonymous node with an IDed newElt, though, because if it got this far,
          // its not persistent, and new nodes can't have any hidden state.
          // We can't use .id because of form input shadowing, and we can't count on .getAttribute's presence because it could be a document-fragment
          (!oldElt.getAttribute?.("id") || oldElt.getAttribute?.("id") === newElt.getAttribute?.("id"));
        }
        return findBestMatch2;
      })();
      function removeNode(ctx, node) {
        if (ctx.idMap.has(node)) {
          moveBefore(ctx.pantry, node, null);
        } else {
          if (ctx.callbacks.beforeNodeRemoved(node) === false) return;
          node.parentNode?.removeChild(node);
          ctx.callbacks.afterNodeRemoved(node);
        }
      }
      function removeNodesBetween(ctx, startInclusive, endExclusive) {
        let cursor = startInclusive;
        while (cursor && cursor !== endExclusive) {
          let tempNode = (
            /** @type {Node} */
            cursor
          );
          cursor = cursor.nextSibling;
          removeNode(ctx, tempNode);
        }
        return cursor;
      }
      function moveBeforeById(parentNode, id, after, ctx) {
        const target = (
          /** @type {Element} - will always be found */
          // ctx.target.id unsafe because of form input shadowing
          // ctx.target could be a document fragment which doesn't have `getAttribute`
          ctx.target.getAttribute?.("id") === id && ctx.target || ctx.target.querySelector(`[id="${id}"]`) || ctx.pantry.querySelector(`[id="${id}"]`)
        );
        removeElementFromAncestorsIdMaps(target, ctx);
        moveBefore(parentNode, target, after);
        return target;
      }
      function removeElementFromAncestorsIdMaps(element, ctx) {
        const id = (
          /** @type {String} */
          element.getAttribute("id")
        );
        while (element = element.parentNode) {
          let idSet = ctx.idMap.get(element);
          if (idSet) {
            idSet.delete(id);
            if (!idSet.size) {
              ctx.idMap.delete(element);
            }
          }
        }
      }
      function moveBefore(parentNode, element, after) {
        if (parentNode.moveBefore) {
          try {
            parentNode.moveBefore(element, after);
          } catch (e) {
            parentNode.insertBefore(element, after);
          }
        } else {
          parentNode.insertBefore(element, after);
        }
      }
      return morphChildren3;
    })();
    const morphNode = /* @__PURE__ */ (function() {
      function morphNode2(oldNode, newContent, ctx) {
        if (ctx.ignoreActive && oldNode === document.activeElement) {
          return null;
        }
        if (ctx.callbacks.beforeNodeMorphed(oldNode, newContent) === false) {
          return oldNode;
        }
        if (oldNode instanceof HTMLHeadElement && ctx.head.ignore) ;
        else if (oldNode instanceof HTMLHeadElement && ctx.head.style !== "morph") {
          handleHeadElement(
            oldNode,
            /** @type {HTMLHeadElement} */
            newContent,
            ctx
          );
        } else {
          morphAttributes(oldNode, newContent, ctx);
          if (!ignoreValueOfActiveElement(oldNode, ctx)) {
            morphChildren2(ctx, oldNode, newContent);
          }
        }
        ctx.callbacks.afterNodeMorphed(oldNode, newContent);
        return oldNode;
      }
      function morphAttributes(oldNode, newNode, ctx) {
        let type = newNode.nodeType;
        if (type === 1) {
          const oldElt = (
            /** @type {Element} */
            oldNode
          );
          const newElt = (
            /** @type {Element} */
            newNode
          );
          const oldAttributes = oldElt.attributes;
          const newAttributes = newElt.attributes;
          for (const newAttribute of newAttributes) {
            if (ignoreAttribute(newAttribute.name, oldElt, "update", ctx)) {
              continue;
            }
            if (oldElt.getAttribute(newAttribute.name) !== newAttribute.value) {
              oldElt.setAttribute(newAttribute.name, newAttribute.value);
            }
          }
          for (let i = oldAttributes.length - 1; 0 <= i; i--) {
            const oldAttribute = oldAttributes[i];
            if (!oldAttribute) continue;
            if (!newElt.hasAttribute(oldAttribute.name)) {
              if (ignoreAttribute(oldAttribute.name, oldElt, "remove", ctx)) {
                continue;
              }
              oldElt.removeAttribute(oldAttribute.name);
            }
          }
          if (!ignoreValueOfActiveElement(oldElt, ctx)) {
            syncInputValue(oldElt, newElt, ctx);
          }
        }
        if (type === 8 || type === 3) {
          if (oldNode.nodeValue !== newNode.nodeValue) {
            oldNode.nodeValue = newNode.nodeValue;
          }
        }
      }
      function syncInputValue(oldElement, newElement, ctx) {
        if (oldElement instanceof HTMLInputElement && newElement instanceof HTMLInputElement && newElement.type !== "file") {
          let newValue = newElement.value;
          let oldValue = oldElement.value;
          syncBooleanAttribute(oldElement, newElement, "checked", ctx);
          syncBooleanAttribute(oldElement, newElement, "disabled", ctx);
          if (!newElement.hasAttribute("value")) {
            if (!ignoreAttribute("value", oldElement, "remove", ctx)) {
              oldElement.value = "";
              oldElement.removeAttribute("value");
            }
          } else if (oldValue !== newValue) {
            if (!ignoreAttribute("value", oldElement, "update", ctx)) {
              oldElement.setAttribute("value", newValue);
              oldElement.value = newValue;
            }
          }
        } else if (oldElement instanceof HTMLOptionElement && newElement instanceof HTMLOptionElement) {
          syncBooleanAttribute(oldElement, newElement, "selected", ctx);
        } else if (oldElement instanceof HTMLTextAreaElement && newElement instanceof HTMLTextAreaElement) {
          let newValue = newElement.value;
          let oldValue = oldElement.value;
          if (ignoreAttribute("value", oldElement, "update", ctx)) {
            return;
          }
          if (newValue !== oldValue) {
            oldElement.value = newValue;
          }
          if (oldElement.firstChild && oldElement.firstChild.nodeValue !== newValue) {
            oldElement.firstChild.nodeValue = newValue;
          }
        }
      }
      function syncBooleanAttribute(oldElement, newElement, attributeName, ctx) {
        const newLiveValue = newElement[attributeName], oldLiveValue = oldElement[attributeName];
        if (newLiveValue !== oldLiveValue) {
          const ignoreUpdate = ignoreAttribute(
            attributeName,
            oldElement,
            "update",
            ctx
          );
          if (!ignoreUpdate) {
            oldElement[attributeName] = newElement[attributeName];
          }
          if (newLiveValue) {
            if (!ignoreUpdate) {
              oldElement.setAttribute(attributeName, "");
            }
          } else {
            if (!ignoreAttribute(attributeName, oldElement, "remove", ctx)) {
              oldElement.removeAttribute(attributeName);
            }
          }
        }
      }
      function ignoreAttribute(attr, element, updateType, ctx) {
        if (attr === "value" && ctx.ignoreActiveValue && element === document.activeElement) {
          return true;
        }
        return ctx.callbacks.beforeAttributeUpdated(attr, element, updateType) === false;
      }
      function ignoreValueOfActiveElement(possibleActiveElement, ctx) {
        return !!ctx.ignoreActiveValue && possibleActiveElement === document.activeElement && possibleActiveElement !== document.body;
      }
      return morphNode2;
    })();
    function withHeadBlocking(ctx, oldNode, newNode, callback) {
      if (ctx.head.block) {
        const oldHead = oldNode.querySelector("head");
        const newHead = newNode.querySelector("head");
        if (oldHead && newHead) {
          const promises = handleHeadElement(oldHead, newHead, ctx);
          return Promise.all(promises).then(() => {
            const newCtx = Object.assign(ctx, {
              head: {
                block: false,
                ignore: true
              }
            });
            return callback(newCtx);
          });
        }
      }
      return callback(ctx);
    }
    function handleHeadElement(oldHead, newHead, ctx) {
      let added = [];
      let removed = [];
      let preserved = [];
      let nodesToAppend = [];
      let srcToNewHeadNodes = /* @__PURE__ */ new Map();
      for (const newHeadChild of newHead.children) {
        srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
      }
      for (const currentHeadElt of oldHead.children) {
        let inNewContent = srcToNewHeadNodes.has(currentHeadElt.outerHTML);
        let isReAppended = ctx.head.shouldReAppend(currentHeadElt);
        let isPreserved = ctx.head.shouldPreserve(currentHeadElt);
        if (inNewContent || isPreserved) {
          if (isReAppended) {
            removed.push(currentHeadElt);
          } else {
            srcToNewHeadNodes.delete(currentHeadElt.outerHTML);
            preserved.push(currentHeadElt);
          }
        } else {
          if (ctx.head.style === "append") {
            if (isReAppended) {
              removed.push(currentHeadElt);
              nodesToAppend.push(currentHeadElt);
            }
          } else {
            if (ctx.head.shouldRemove(currentHeadElt) !== false) {
              removed.push(currentHeadElt);
            }
          }
        }
      }
      nodesToAppend.push(...srcToNewHeadNodes.values());
      let promises = [];
      for (const newNode of nodesToAppend) {
        let newElt = (
          /** @type {ChildNode} */
          document.createRange().createContextualFragment(newNode.outerHTML).firstChild
        );
        if (ctx.callbacks.beforeNodeAdded(newElt) !== false) {
          if ("href" in newElt && newElt.href || "src" in newElt && newElt.src) {
            let resolve;
            let promise = new Promise(function(_resolve) {
              resolve = _resolve;
            });
            newElt.addEventListener("load", function() {
              resolve();
            });
            promises.push(promise);
          }
          oldHead.appendChild(newElt);
          ctx.callbacks.afterNodeAdded(newElt);
          added.push(newElt);
        }
      }
      for (const removedElement of removed) {
        if (ctx.callbacks.beforeNodeRemoved(removedElement) !== false) {
          oldHead.removeChild(removedElement);
          ctx.callbacks.afterNodeRemoved(removedElement);
        }
      }
      ctx.head.afterHeadMorphed(oldHead, {
        added,
        kept: preserved,
        removed
      });
      return promises;
    }
    const createMorphContext = /* @__PURE__ */ (function() {
      function createMorphContext2(oldNode, newContent, config2) {
        const { persistentIds, idMap } = createIdMaps(oldNode, newContent);
        const mergedConfig = mergeDefaults(config2);
        const morphStyle = mergedConfig.morphStyle || "outerHTML";
        if (!["innerHTML", "outerHTML"].includes(morphStyle)) {
          throw `Do not understand how to morph style ${morphStyle}`;
        }
        return {
          target: oldNode,
          newContent,
          config: mergedConfig,
          morphStyle,
          ignoreActive: mergedConfig.ignoreActive,
          ignoreActiveValue: mergedConfig.ignoreActiveValue,
          restoreFocus: mergedConfig.restoreFocus,
          idMap,
          persistentIds,
          pantry: createPantry(),
          activeElementAndParents: createActiveElementAndParents(oldNode),
          callbacks: mergedConfig.callbacks,
          head: mergedConfig.head
        };
      }
      function mergeDefaults(config2) {
        let finalConfig = Object.assign({}, defaults);
        Object.assign(finalConfig, config2);
        finalConfig.callbacks = Object.assign(
          {},
          defaults.callbacks,
          config2.callbacks
        );
        finalConfig.head = Object.assign({}, defaults.head, config2.head);
        return finalConfig;
      }
      function createPantry() {
        const pantry = document.createElement("div");
        pantry.hidden = true;
        document.body.insertAdjacentElement("afterend", pantry);
        return pantry;
      }
      function createActiveElementAndParents(oldNode) {
        let activeElementAndParents = [];
        let elt = document.activeElement;
        if (elt?.tagName !== "BODY" && oldNode.contains(elt)) {
          while (elt) {
            activeElementAndParents.push(elt);
            if (elt === oldNode) break;
            elt = elt.parentElement;
          }
        }
        return activeElementAndParents;
      }
      function findIdElements(root) {
        let elements = Array.from(root.querySelectorAll("[id]"));
        if (root.getAttribute?.("id")) {
          elements.push(root);
        }
        return elements;
      }
      function populateIdMapWithTree(idMap, persistentIds, root, elements) {
        for (const elt of elements) {
          const id = (
            /** @type {String} */
            elt.getAttribute("id")
          );
          if (persistentIds.has(id)) {
            let current = elt;
            while (current) {
              let idSet = idMap.get(current);
              if (idSet == null) {
                idSet = /* @__PURE__ */ new Set();
                idMap.set(current, idSet);
              }
              idSet.add(id);
              if (current === root) break;
              current = current.parentElement;
            }
          }
        }
      }
      function createIdMaps(oldContent, newContent) {
        const oldIdElements = findIdElements(oldContent);
        const newIdElements = findIdElements(newContent);
        const persistentIds = createPersistentIds(oldIdElements, newIdElements);
        let idMap = /* @__PURE__ */ new Map();
        populateIdMapWithTree(idMap, persistentIds, oldContent, oldIdElements);
        const newRoot = newContent.__idiomorphRoot || newContent;
        populateIdMapWithTree(idMap, persistentIds, newRoot, newIdElements);
        return { persistentIds, idMap };
      }
      function createPersistentIds(oldIdElements, newIdElements) {
        let duplicateIds = /* @__PURE__ */ new Set();
        let oldIdTagNameMap = /* @__PURE__ */ new Map();
        for (const { id, tagName } of oldIdElements) {
          if (oldIdTagNameMap.has(id)) {
            duplicateIds.add(id);
          } else {
            oldIdTagNameMap.set(id, tagName);
          }
        }
        let persistentIds = /* @__PURE__ */ new Set();
        for (const { id, tagName } of newIdElements) {
          if (persistentIds.has(id)) {
            duplicateIds.add(id);
          } else if (oldIdTagNameMap.get(id) === tagName) {
            persistentIds.add(id);
          }
        }
        for (const id of duplicateIds) {
          persistentIds.delete(id);
        }
        return persistentIds;
      }
      return createMorphContext2;
    })();
    const { normalizeElement, normalizeParent } = /* @__PURE__ */ (function() {
      const generatedByIdiomorph = /* @__PURE__ */ new WeakSet();
      function normalizeElement2(content) {
        if (content instanceof Document) {
          return content.documentElement;
        } else {
          return content;
        }
      }
      function normalizeParent2(newContent) {
        if (newContent == null) {
          return document.createElement("div");
        } else if (typeof newContent === "string") {
          return normalizeParent2(parseContent(newContent));
        } else if (generatedByIdiomorph.has(
          /** @type {Element} */
          newContent
        )) {
          return (
            /** @type {Element} */
            newContent
          );
        } else if (newContent instanceof Node) {
          if (newContent.parentNode) {
            return (
              /** @type {any} */
              new SlicedParentNode(newContent)
            );
          } else {
            const dummyParent = document.createElement("div");
            dummyParent.append(newContent);
            return dummyParent;
          }
        } else {
          const dummyParent = document.createElement("div");
          for (const elt of [...newContent]) {
            dummyParent.append(elt);
          }
          return dummyParent;
        }
      }
      class SlicedParentNode {
        /** @param {Node} node */
        constructor(node) {
          this.originalNode = node;
          this.realParentNode = /** @type {Element} */
          node.parentNode;
          this.previousSibling = node.previousSibling;
          this.nextSibling = node.nextSibling;
        }
        /** @returns {Node[]} */
        get childNodes() {
          const nodes = [];
          let cursor = this.previousSibling ? this.previousSibling.nextSibling : this.realParentNode.firstChild;
          while (cursor && cursor != this.nextSibling) {
            nodes.push(cursor);
            cursor = cursor.nextSibling;
          }
          return nodes;
        }
        /**
         * @param {string} selector
         * @returns {Element[]}
         */
        querySelectorAll(selector) {
          return this.childNodes.reduce(
            (results, node) => {
              if (node instanceof Element) {
                if (node.matches(selector)) results.push(node);
                const nodeList = node.querySelectorAll(selector);
                for (let i = 0; i < nodeList.length; i++) {
                  results.push(nodeList[i]);
                }
              }
              return results;
            },
            /** @type {Element[]} */
            []
          );
        }
        /**
         * @param {Node} node
         * @param {Node} referenceNode
         * @returns {Node}
         */
        insertBefore(node, referenceNode) {
          return this.realParentNode.insertBefore(node, referenceNode);
        }
        /**
         * @param {Node} node
         * @param {Node} referenceNode
         * @returns {Node}
         */
        moveBefore(node, referenceNode) {
          return this.realParentNode.moveBefore(node, referenceNode);
        }
        /**
         * for later use with populateIdMapWithTree to halt upwards iteration
         * @returns {Node}
         */
        get __idiomorphRoot() {
          return this.originalNode;
        }
      }
      function parseContent(newContent) {
        let parser = new DOMParser();
        let contentWithSvgsRemoved = newContent.replace(
          /<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim,
          ""
        );
        if (contentWithSvgsRemoved.match(/<\/html>/) || contentWithSvgsRemoved.match(/<\/head>/) || contentWithSvgsRemoved.match(/<\/body>/)) {
          let content = parser.parseFromString(newContent, "text/html");
          if (contentWithSvgsRemoved.match(/<\/html>/)) {
            generatedByIdiomorph.add(content);
            return content;
          } else {
            let htmlElement = content.firstChild;
            if (htmlElement) {
              generatedByIdiomorph.add(htmlElement);
            }
            return htmlElement;
          }
        } else {
          let responseDoc = parser.parseFromString(
            "<body><template>" + newContent + "</template></body>",
            "text/html"
          );
          let content = (
            /** @type {HTMLTemplateElement} */
            responseDoc.body.querySelector("template").content
          );
          generatedByIdiomorph.add(content);
          return content;
        }
      }
      return { normalizeElement: normalizeElement2, normalizeParent: normalizeParent2 };
    })();
    return {
      morph,
      defaults
    };
  })();
  function morphElements(currentElement, newElement, { callbacks, ...options } = {}) {
    Idiomorph.morph(currentElement, newElement, {
      ...options,
      callbacks: new DefaultIdiomorphCallbacks(callbacks)
    });
  }
  function morphChildren(currentElement, newElement, options = {}) {
    morphElements(currentElement, newElement.childNodes, {
      ...options,
      morphStyle: "innerHTML"
    });
  }
  function shouldRefreshFrameWithMorphing(currentFrame, newFrame) {
    return currentFrame instanceof FrameElement && currentFrame.shouldReloadWithMorph && (!newFrame || areFramesCompatibleForRefreshing(currentFrame, newFrame)) && !currentFrame.closest("[data-turbo-permanent]");
  }
  function areFramesCompatibleForRefreshing(currentFrame, newFrame) {
    return newFrame instanceof Element && newFrame.nodeName === "TURBO-FRAME" && currentFrame.id === newFrame.id && (!newFrame.getAttribute("src") || urlsAreEqual(currentFrame.src, newFrame.getAttribute("src")));
  }
  function closestFrameReloadableWithMorphing(node) {
    return node.parentElement.closest("turbo-frame[src][refresh=morph]");
  }
  var DefaultIdiomorphCallbacks = class {
    #beforeNodeMorphed;
    constructor({ beforeNodeMorphed } = {}) {
      this.#beforeNodeMorphed = beforeNodeMorphed || (() => true);
    }
    beforeNodeAdded = (node) => {
      return !(node.id && node.hasAttribute("data-turbo-permanent") && document.getElementById(node.id));
    };
    beforeNodeMorphed = (currentElement, newElement) => {
      if (currentElement instanceof Element) {
        if (!currentElement.hasAttribute("data-turbo-permanent") && this.#beforeNodeMorphed(currentElement, newElement)) {
          const event = dispatch("turbo:before-morph-element", {
            cancelable: true,
            target: currentElement,
            detail: { currentElement, newElement }
          });
          return !event.defaultPrevented;
        } else {
          return false;
        }
      }
    };
    beforeAttributeUpdated = (attributeName, target, mutationType) => {
      const event = dispatch("turbo:before-morph-attribute", {
        cancelable: true,
        target,
        detail: { attributeName, mutationType }
      });
      return !event.defaultPrevented;
    };
    beforeNodeRemoved = (node) => {
      return this.beforeNodeMorphed(node);
    };
    afterNodeMorphed = (currentElement, newElement) => {
      if (currentElement instanceof Element) {
        dispatch("turbo:morph-element", {
          target: currentElement,
          detail: { currentElement, newElement }
        });
      }
    };
  };
  var MorphingFrameRenderer = class extends FrameRenderer {
    static renderElement(currentElement, newElement) {
      dispatch("turbo:before-frame-morph", {
        target: currentElement,
        detail: { currentElement, newElement }
      });
      morphChildren(currentElement, newElement, {
        callbacks: {
          beforeNodeMorphed: (node, newNode) => {
            if (shouldRefreshFrameWithMorphing(node, newNode) && closestFrameReloadableWithMorphing(node) === currentElement) {
              node.reload();
              return false;
            }
            return true;
          }
        }
      });
    }
    async preservingPermanentElements(callback) {
      return await callback();
    }
  };
  var ProgressBar = class _ProgressBar {
    static animationDuration = 300;
    /*ms*/
    static get defaultCSS() {
      return unindent`
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 2147483647;
        transition:
          width ${_ProgressBar.animationDuration}ms ease-out,
          opacity ${_ProgressBar.animationDuration / 2}ms ${_ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    hiding = false;
    value = 0;
    visible = false;
    constructor() {
      this.stylesheetElement = this.createStylesheetElement();
      this.progressElement = this.createProgressElement();
      this.installStylesheetElement();
      this.setValue(0);
    }
    show() {
      if (!this.visible) {
        this.visible = true;
        this.installProgressElement();
        this.startTrickling();
      }
    }
    hide() {
      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(() => {
          this.uninstallProgressElement();
          this.stopTrickling();
          this.visible = false;
          this.hiding = false;
        });
      }
    }
    setValue(value) {
      this.value = value;
      this.refresh();
    }
    // Private
    installStylesheetElement() {
      document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
    fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, _ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
    startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = window.setInterval(this.trickle, _ProgressBar.animationDuration);
      }
    }
    stopTrickling() {
      window.clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
    trickle = () => {
      this.setValue(this.value + Math.random() / 100);
    };
    refresh() {
      requestAnimationFrame(() => {
        this.progressElement.style.width = `${10 + this.value * 90}%`;
      });
    }
    createStylesheetElement() {
      const element = document.createElement("style");
      element.type = "text/css";
      element.textContent = _ProgressBar.defaultCSS;
      const cspNonce = getCspNonce();
      if (cspNonce) {
        element.nonce = cspNonce;
      }
      return element;
    }
    createProgressElement() {
      const element = document.createElement("div");
      element.className = "turbo-progress-bar";
      return element;
    }
  };
  var HeadSnapshot = class extends Snapshot {
    detailsByOuterHTML = this.children.filter((element) => !elementIsNoscript(element)).map((element) => elementWithoutNonce(element)).reduce((result, element) => {
      const { outerHTML } = element;
      const details = outerHTML in result ? result[outerHTML] : {
        type: elementType(element),
        tracked: elementIsTracked(element),
        elements: []
      };
      return {
        ...result,
        [outerHTML]: {
          ...details,
          elements: [...details.elements, element]
        }
      };
    }, {});
    get trackedElementSignature() {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked).join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML)).map((outerHTML) => this.detailsByOuterHTML[outerHTML]).filter(({ type }) => type == matchedType).map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
        if (type == null && !tracked) {
          return [...result, ...elements];
        } else if (elements.length > 1) {
          return [...result, ...elements.slice(1)];
        } else {
          return result;
        }
      }, []);
    }
    getMetaValue(name) {
      const element = this.findMetaElementByName(name);
      return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const {
          elements: [element]
        } = this.detailsByOuterHTML[outerHTML];
        return elementIsMetaElementWithName(element, name) ? element : result;
      }, void 0 | void 0);
    }
  };
  function elementType(element) {
    if (elementIsScript(element)) {
      return "script";
    } else if (elementIsStylesheet(element)) {
      return "stylesheet";
    }
  }
  function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
  }
  function elementIsScript(element) {
    const tagName = element.localName;
    return tagName == "script";
  }
  function elementIsNoscript(element) {
    const tagName = element.localName;
    return tagName == "noscript";
  }
  function elementIsStylesheet(element) {
    const tagName = element.localName;
    return tagName == "style" || tagName == "link" && element.getAttribute("rel") == "stylesheet";
  }
  function elementIsMetaElementWithName(element, name) {
    const tagName = element.localName;
    return tagName == "meta" && element.getAttribute("name") == name;
  }
  function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
      element.setAttribute("nonce", "");
    }
    return element;
  }
  var PageSnapshot = class _PageSnapshot extends Snapshot {
    static fromHTMLString(html = "") {
      return this.fromDocument(parseHTMLDocument(html));
    }
    static fromElement(element) {
      return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ documentElement, body, head }) {
      return new this(documentElement, body, new HeadSnapshot(head));
    }
    constructor(documentElement, body, headSnapshot) {
      super(body);
      this.documentElement = documentElement;
      this.headSnapshot = headSnapshot;
    }
    clone() {
      const clonedElement = this.element.cloneNode(true);
      const selectElements = this.element.querySelectorAll("select");
      const clonedSelectElements = clonedElement.querySelectorAll("select");
      for (const [index, source] of selectElements.entries()) {
        const clone = clonedSelectElements[index];
        for (const option of clone.selectedOptions) option.selected = false;
        for (const option of source.selectedOptions) clone.options[option.index].selected = true;
      }
      for (const clonedPasswordInput of clonedElement.querySelectorAll('input[type="password"]')) {
        clonedPasswordInput.value = "";
      }
      for (const clonedNoscriptElement of clonedElement.querySelectorAll("noscript")) {
        clonedNoscriptElement.remove();
      }
      return new _PageSnapshot(this.documentElement, clonedElement, this.headSnapshot);
    }
    get lang() {
      return this.documentElement.getAttribute("lang");
    }
    get dir() {
      return this.documentElement.getAttribute("dir");
    }
    get headElement() {
      return this.headSnapshot.element;
    }
    get rootLocation() {
      const root = this.getSetting("root") ?? "/";
      return expandURL(root);
    }
    get cacheControlValue() {
      return this.getSetting("cache-control");
    }
    get isPreviewable() {
      return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
      return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
      return this.getSetting("visit-control") != "reload";
    }
    get prefersViewTransitions() {
      const viewTransitionEnabled = this.getSetting("view-transition") === "true" || this.headSnapshot.getMetaValue("view-transition") === "same-origin";
      return viewTransitionEnabled && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    get refreshMethod() {
      return this.getSetting("refresh-method");
    }
    get refreshScroll() {
      return this.getSetting("refresh-scroll");
    }
    // Private
    getSetting(name) {
      return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
  };
  var ViewTransitioner = class {
    #viewTransitionStarted = false;
    #lastOperation = Promise.resolve();
    renderChange(useViewTransition, render) {
      if (useViewTransition && this.viewTransitionsAvailable && !this.#viewTransitionStarted) {
        this.#viewTransitionStarted = true;
        this.#lastOperation = this.#lastOperation.then(async () => {
          await document.startViewTransition(render).finished;
        });
      } else {
        this.#lastOperation = this.#lastOperation.then(render);
      }
      return this.#lastOperation;
    }
    get viewTransitionsAvailable() {
      return document.startViewTransition;
    }
  };
  var defaultOptions = {
    action: "advance",
    historyChanged: false,
    visitCachedSnapshot: () => {
    },
    willRender: true,
    updateHistory: true,
    shouldCacheSnapshot: true,
    acceptsStreamResponse: false,
    refresh: {}
  };
  var TimingMetric = {
    visitStart: "visitStart",
    requestStart: "requestStart",
    requestEnd: "requestEnd",
    visitEnd: "visitEnd"
  };
  var VisitState = {
    initialized: "initialized",
    started: "started",
    canceled: "canceled",
    failed: "failed",
    completed: "completed"
  };
  var SystemStatusCode = {
    networkFailure: 0,
    timeoutFailure: -1,
    contentTypeMismatch: -2
  };
  var Direction = {
    advance: "forward",
    restore: "back",
    replace: "none"
  };
  var Visit = class {
    identifier = uuid();
    // Required by turbo-ios
    timingMetrics = {};
    followedRedirect = false;
    historyChanged = false;
    scrolled = false;
    shouldCacheSnapshot = true;
    acceptsStreamResponse = false;
    snapshotCached = false;
    state = VisitState.initialized;
    viewTransitioner = new ViewTransitioner();
    constructor(delegate, location2, restorationIdentifier, options = {}) {
      this.delegate = delegate;
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier || uuid();
      const {
        action,
        historyChanged,
        referrer,
        snapshot,
        snapshotHTML,
        response,
        visitCachedSnapshot,
        willRender,
        updateHistory,
        shouldCacheSnapshot,
        acceptsStreamResponse,
        direction,
        refresh
      } = {
        ...defaultOptions,
        ...options
      };
      this.action = action;
      this.historyChanged = historyChanged;
      this.referrer = referrer;
      this.snapshot = snapshot;
      this.snapshotHTML = snapshotHTML;
      this.response = response;
      this.isPageRefresh = this.view.isPageRefresh(this);
      this.visitCachedSnapshot = visitCachedSnapshot;
      this.willRender = willRender;
      this.updateHistory = updateHistory;
      this.scrolled = !willRender;
      this.shouldCacheSnapshot = shouldCacheSnapshot;
      this.acceptsStreamResponse = acceptsStreamResponse;
      this.direction = direction || Direction[action];
      this.refresh = refresh;
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    get restorationData() {
      return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    start() {
      if (this.state == VisitState.initialized) {
        this.recordTimingMetric(TimingMetric.visitStart);
        this.state = VisitState.started;
        this.adapter.visitStarted(this);
        this.delegate.visitStarted(this);
      }
    }
    cancel() {
      if (this.state == VisitState.started) {
        if (this.request) {
          this.request.cancel();
        }
        this.cancelRender();
        this.state = VisitState.canceled;
      }
    }
    complete() {
      if (this.state == VisitState.started) {
        this.recordTimingMetric(TimingMetric.visitEnd);
        this.adapter.visitCompleted(this);
        this.state = VisitState.completed;
        this.followRedirect();
        if (!this.followedRedirect) {
          this.delegate.visitCompleted(this);
        }
      }
    }
    fail() {
      if (this.state == VisitState.started) {
        this.state = VisitState.failed;
        this.adapter.visitFailed(this);
        this.delegate.visitCompleted(this);
      }
    }
    changeHistory() {
      if (!this.historyChanged && this.updateHistory) {
        const actionForHistory = this.location.href === this.referrer?.href ? "replace" : this.action;
        const method = getHistoryMethodForAction(actionForHistory);
        this.history.update(method, this.location, this.restorationIdentifier);
        this.historyChanged = true;
      }
    }
    issueRequest() {
      if (this.hasPreloadedResponse()) {
        this.simulateRequest();
      } else if (this.shouldIssueRequest() && !this.request) {
        this.request = new FetchRequest(this, FetchMethod.get, this.location);
        this.request.perform();
      }
    }
    simulateRequest() {
      if (this.response) {
        this.startRequest();
        this.recordResponse();
        this.finishRequest();
      }
    }
    startRequest() {
      this.recordTimingMetric(TimingMetric.requestStart);
      this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
      this.response = response;
      if (response) {
        const { statusCode } = response;
        if (isSuccessful(statusCode)) {
          this.adapter.visitRequestCompleted(this);
        } else {
          this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
        }
      }
    }
    finishRequest() {
      this.recordTimingMetric(TimingMetric.requestEnd);
      this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
      if (this.response) {
        const { statusCode, responseHTML } = this.response;
        this.render(async () => {
          if (this.shouldCacheSnapshot) this.cacheSnapshot();
          if (this.view.renderPromise) await this.view.renderPromise;
          if (isSuccessful(statusCode) && responseHTML != null) {
            const snapshot = PageSnapshot.fromHTMLString(responseHTML);
            await this.renderPageSnapshot(snapshot, false);
            this.adapter.visitRendered(this);
            this.complete();
          } else {
            await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML), this);
            this.adapter.visitRendered(this);
            this.fail();
          }
        });
      }
    }
    getCachedSnapshot() {
      const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
      if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
        if (this.action == "restore" || snapshot.isPreviewable) {
          return snapshot;
        }
      }
    }
    getPreloadedSnapshot() {
      if (this.snapshotHTML) {
        return PageSnapshot.fromHTMLString(this.snapshotHTML);
      }
    }
    hasCachedSnapshot() {
      return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
      const snapshot = this.getCachedSnapshot();
      if (snapshot) {
        const isPreview = this.shouldIssueRequest();
        this.render(async () => {
          this.cacheSnapshot();
          if (this.isPageRefresh) {
            this.adapter.visitRendered(this);
          } else {
            if (this.view.renderPromise) await this.view.renderPromise;
            await this.renderPageSnapshot(snapshot, isPreview);
            this.adapter.visitRendered(this);
            if (!isPreview) {
              this.complete();
            }
          }
        });
      }
    }
    followRedirect() {
      if (this.redirectedToLocation && !this.followedRedirect && this.response?.redirected) {
        this.adapter.visitProposedToLocation(this.redirectedToLocation, {
          action: "replace",
          response: this.response,
          shouldCacheSnapshot: false,
          willRender: false
        });
        this.followedRedirect = true;
      }
    }
    // Fetch request delegate
    prepareRequest(request) {
      if (this.acceptsStreamResponse) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted() {
      this.startRequest();
    }
    requestPreventedHandlingResponse(_request, _response) {
    }
    async requestSucceededWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.redirectedToLocation = response.redirected ? response.location : void 0;
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    async requestFailedWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    requestErrored(_request, _error) {
      this.recordResponse({
        statusCode: SystemStatusCode.networkFailure,
        redirected: false
      });
    }
    requestFinished() {
      this.finishRequest();
    }
    // Scrolling
    performScroll() {
      if (!this.scrolled && !this.view.forceReloaded && !this.view.shouldPreserveScrollPosition(this)) {
        if (this.action == "restore") {
          this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
        } else {
          this.scrollToAnchor() || this.view.scrollToTop();
        }
        this.scrolled = true;
      }
    }
    scrollToRestoredPosition() {
      const { scrollPosition } = this.restorationData;
      if (scrollPosition) {
        this.view.scrollToPosition(scrollPosition);
        return true;
      }
    }
    scrollToAnchor() {
      const anchor = getAnchor(this.location);
      if (anchor != null) {
        this.view.scrollToAnchor(anchor);
        return true;
      }
    }
    // Instrumentation
    recordTimingMetric(metric) {
      this.timingMetrics[metric] = (/* @__PURE__ */ new Date()).getTime();
    }
    getTimingMetrics() {
      return { ...this.timingMetrics };
    }
    // Private
    hasPreloadedResponse() {
      return typeof this.response == "object";
    }
    shouldIssueRequest() {
      if (this.action == "restore") {
        return !this.hasCachedSnapshot();
      } else {
        return this.willRender;
      }
    }
    cacheSnapshot() {
      if (!this.snapshotCached) {
        this.view.cacheSnapshot(this.snapshot).then((snapshot) => snapshot && this.visitCachedSnapshot(snapshot));
        this.snapshotCached = true;
      }
    }
    async render(callback) {
      this.cancelRender();
      await new Promise((resolve) => {
        this.frame = document.visibilityState === "hidden" ? setTimeout(() => resolve(), 0) : requestAnimationFrame(() => resolve());
      });
      await callback();
      delete this.frame;
    }
    async renderPageSnapshot(snapshot, isPreview) {
      await this.viewTransitioner.renderChange(this.view.shouldTransitionTo(snapshot), async () => {
        await this.view.renderPage(snapshot, isPreview, this.willRender, this);
        this.performScroll();
      });
    }
    cancelRender() {
      if (this.frame) {
        cancelAnimationFrame(this.frame);
        delete this.frame;
      }
    }
  };
  function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
  var BrowserAdapter = class {
    progressBar = new ProgressBar();
    constructor(session2) {
      this.session = session2;
    }
    visitProposedToLocation(location2, options) {
      if (locationIsVisitable(location2, this.navigator.rootLocation)) {
        this.navigator.startVisit(location2, options?.restorationIdentifier || uuid(), options);
      } else {
        window.location.href = location2.toString();
      }
    }
    visitStarted(visit2) {
      this.location = visit2.location;
      this.redirectedToLocation = null;
      visit2.loadCachedSnapshot();
      visit2.issueRequest();
    }
    visitRequestStarted(visit2) {
      this.progressBar.setValue(0);
      if (visit2.hasCachedSnapshot() || visit2.action != "restore") {
        this.showVisitProgressBarAfterDelay();
      } else {
        this.showProgressBar();
      }
    }
    visitRequestCompleted(visit2) {
      visit2.loadResponse();
      if (visit2.response.redirected) {
        this.redirectedToLocation = visit2.redirectedToLocation;
      }
    }
    visitRequestFailedWithStatusCode(visit2, statusCode) {
      switch (statusCode) {
        case SystemStatusCode.networkFailure:
        case SystemStatusCode.timeoutFailure:
        case SystemStatusCode.contentTypeMismatch:
          return this.reload({
            reason: "request_failed",
            context: {
              statusCode
            }
          });
        default:
          return visit2.loadResponse();
      }
    }
    visitRequestFinished(_visit) {
    }
    visitCompleted(_visit) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    pageInvalidated(reason) {
      this.reload(reason);
    }
    visitFailed(_visit) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    visitRendered(_visit) {
    }
    // Link prefetching
    linkPrefetchingIsEnabledForLocation(location2) {
      return true;
    }
    // Form Submission Delegate
    formSubmissionStarted(_formSubmission) {
      this.progressBar.setValue(0);
      this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(_formSubmission) {
      this.progressBar.setValue(1);
      this.hideFormProgressBar();
    }
    // Private
    showVisitProgressBarAfterDelay() {
      this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
      this.progressBar.hide();
      if (this.visitProgressBarTimeout != null) {
        window.clearTimeout(this.visitProgressBarTimeout);
        delete this.visitProgressBarTimeout;
      }
    }
    showFormProgressBarAfterDelay() {
      if (this.formProgressBarTimeout == null) {
        this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
      }
    }
    hideFormProgressBar() {
      this.progressBar.hide();
      if (this.formProgressBarTimeout != null) {
        window.clearTimeout(this.formProgressBarTimeout);
        delete this.formProgressBarTimeout;
      }
    }
    showProgressBar = () => {
      this.progressBar.show();
    };
    reload(reason) {
      dispatch("turbo:reload", { detail: reason });
      window.location.href = (this.redirectedToLocation || this.location)?.toString() || window.location.href;
    }
    get navigator() {
      return this.session.navigator;
    }
  };
  var CacheObserver = class {
    selector = "[data-turbo-temporary]";
    started = false;
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-cache", this.removeTemporaryElements, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-cache", this.removeTemporaryElements, false);
      }
    }
    removeTemporaryElements = (_event) => {
      for (const element of this.temporaryElements) {
        element.remove();
      }
    };
    get temporaryElements() {
      return [...document.querySelectorAll(this.selector)];
    }
  };
  var FrameRedirector = class {
    constructor(session2, element) {
      this.session = session2;
      this.element = element;
      this.linkInterceptor = new LinkInterceptor(this, element);
      this.formSubmitObserver = new FormSubmitObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
      this.formSubmitObserver.start();
    }
    stop() {
      this.linkInterceptor.stop();
      this.formSubmitObserver.stop();
    }
    // Link interceptor delegate
    shouldInterceptLinkClick(element, _location, _event) {
      return this.#shouldRedirect(element);
    }
    linkClickIntercepted(element, url, event) {
      const frame = this.#findFrameElement(element);
      if (frame) {
        frame.delegate.linkClickIntercepted(element, url, event);
      }
    }
    // Form submit observer delegate
    willSubmitForm(element, submitter2) {
      return element.closest("turbo-frame") == null && this.#shouldSubmit(element, submitter2) && this.#shouldRedirect(element, submitter2);
    }
    formSubmitted(element, submitter2) {
      const frame = this.#findFrameElement(element, submitter2);
      if (frame) {
        frame.delegate.formSubmitted(element, submitter2);
      }
    }
    #shouldSubmit(form, submitter2) {
      const action = getAction$1(form, submitter2);
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const rootLocation = expandURL(meta?.content ?? "/");
      return this.#shouldRedirect(form, submitter2) && locationIsVisitable(action, rootLocation);
    }
    #shouldRedirect(element, submitter2) {
      const isNavigatable = element instanceof HTMLFormElement ? this.session.submissionIsNavigatable(element, submitter2) : this.session.elementIsNavigatable(element);
      if (isNavigatable) {
        const frame = this.#findFrameElement(element, submitter2);
        return frame ? frame != element.closest("turbo-frame") : false;
      } else {
        return false;
      }
    }
    #findFrameElement(element, submitter2) {
      const id = submitter2?.getAttribute("data-turbo-frame") || element.getAttribute("data-turbo-frame");
      if (id && id != "_top") {
        const frame = this.element.querySelector(`#${id}:not([disabled])`);
        if (frame instanceof FrameElement) {
          return frame;
        }
      }
    }
  };
  var History = class {
    location;
    restorationIdentifier = uuid();
    restorationData = {};
    started = false;
    currentIndex = 0;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("popstate", this.onPopState, false);
        this.currentIndex = history.state?.turbo?.restorationIndex || 0;
        this.started = true;
        this.replace(new URL(window.location.href));
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("popstate", this.onPopState, false);
        this.started = false;
      }
    }
    push(location2, restorationIdentifier) {
      this.update(history.pushState, location2, restorationIdentifier);
    }
    replace(location2, restorationIdentifier) {
      this.update(history.replaceState, location2, restorationIdentifier);
    }
    update(method, location2, restorationIdentifier = uuid()) {
      if (method === history.pushState) ++this.currentIndex;
      const state = { turbo: { restorationIdentifier, restorationIndex: this.currentIndex } };
      method.call(history, state, "", location2.href);
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier;
    }
    // Restoration data
    getRestorationDataForIdentifier(restorationIdentifier) {
      return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
      const { restorationIdentifier } = this;
      const restorationData = this.restorationData[restorationIdentifier];
      this.restorationData[restorationIdentifier] = {
        ...restorationData,
        ...additionalData
      };
    }
    // Scroll restoration
    assumeControlOfScrollRestoration() {
      if (!this.previousScrollRestoration) {
        this.previousScrollRestoration = history.scrollRestoration ?? "auto";
        history.scrollRestoration = "manual";
      }
    }
    relinquishControlOfScrollRestoration() {
      if (this.previousScrollRestoration) {
        history.scrollRestoration = this.previousScrollRestoration;
        delete this.previousScrollRestoration;
      }
    }
    // Event handlers
    onPopState = (event) => {
      const { turbo } = event.state || {};
      this.location = new URL(window.location.href);
      if (turbo) {
        const { restorationIdentifier, restorationIndex } = turbo;
        this.restorationIdentifier = restorationIdentifier;
        const direction = restorationIndex > this.currentIndex ? "forward" : "back";
        this.delegate.historyPoppedToLocationWithRestorationIdentifierAndDirection(this.location, restorationIdentifier, direction);
        this.currentIndex = restorationIndex;
      } else {
        this.currentIndex++;
        this.delegate.historyPoppedWithEmptyState(this.location);
      }
    };
  };
  var LinkPrefetchObserver = class {
    started = false;
    #prefetchedLink = null;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (this.started) return;
      if (this.eventTarget.readyState === "loading") {
        this.eventTarget.addEventListener("DOMContentLoaded", this.#enable, { once: true });
      } else {
        this.#enable();
      }
    }
    stop() {
      if (!this.started) return;
      this.eventTarget.removeEventListener("mouseenter", this.#tryToPrefetchRequest, {
        capture: true,
        passive: true
      });
      this.eventTarget.removeEventListener("mouseleave", this.#cancelRequestIfObsolete, {
        capture: true,
        passive: true
      });
      this.eventTarget.removeEventListener("turbo:before-fetch-request", this.#tryToUsePrefetchedRequest, true);
      this.started = false;
    }
    #enable = () => {
      this.eventTarget.addEventListener("mouseenter", this.#tryToPrefetchRequest, {
        capture: true,
        passive: true
      });
      this.eventTarget.addEventListener("mouseleave", this.#cancelRequestIfObsolete, {
        capture: true,
        passive: true
      });
      this.eventTarget.addEventListener("turbo:before-fetch-request", this.#tryToUsePrefetchedRequest, true);
      this.started = true;
    };
    #tryToPrefetchRequest = (event) => {
      if (getMetaContent("turbo-prefetch") === "false") return;
      const target = event.target;
      const isLink = target.matches && target.matches("a[href]:not([target^=_]):not([download])");
      if (isLink && this.#isPrefetchable(target)) {
        const link = target;
        const location2 = getLocationForLink(link);
        if (this.delegate.canPrefetchRequestToLocation(link, location2)) {
          this.#prefetchedLink = link;
          const fetchRequest = new FetchRequest(
            this,
            FetchMethod.get,
            location2,
            new URLSearchParams(),
            target
          );
          fetchRequest.fetchOptions.priority = "low";
          prefetchCache.putLater(location2, fetchRequest, this.#cacheTtl);
        }
      }
    };
    #cancelRequestIfObsolete = (event) => {
      if (event.target === this.#prefetchedLink) this.#cancelPrefetchRequest();
    };
    #cancelPrefetchRequest = () => {
      prefetchCache.clear();
      this.#prefetchedLink = null;
    };
    #tryToUsePrefetchedRequest = (event) => {
      if (event.target.tagName !== "FORM" && event.detail.fetchOptions.method === "GET") {
        const cached = prefetchCache.get(event.detail.url);
        if (cached) {
          event.detail.fetchRequest = cached;
        }
        prefetchCache.clear();
      }
    };
    prepareRequest(request) {
      const link = request.target;
      request.headers["X-Sec-Purpose"] = "prefetch";
      const turboFrame = link.closest("turbo-frame");
      const turboFrameTarget = link.getAttribute("data-turbo-frame") || turboFrame?.getAttribute("target") || turboFrame?.id;
      if (turboFrameTarget && turboFrameTarget !== "_top") {
        request.headers["Turbo-Frame"] = turboFrameTarget;
      }
    }
    // Fetch request interface
    requestSucceededWithResponse() {
    }
    requestStarted(fetchRequest) {
    }
    requestErrored(fetchRequest) {
    }
    requestFinished(fetchRequest) {
    }
    requestPreventedHandlingResponse(fetchRequest, fetchResponse) {
    }
    requestFailedWithResponse(fetchRequest, fetchResponse) {
    }
    get #cacheTtl() {
      return Number(getMetaContent("turbo-prefetch-cache-time")) || cacheTtl;
    }
    #isPrefetchable(link) {
      const href = link.getAttribute("href");
      if (!href) return false;
      if (unfetchableLink(link)) return false;
      if (linkToTheSamePage(link)) return false;
      if (linkOptsOut(link)) return false;
      if (nonSafeLink(link)) return false;
      if (eventPrevented(link)) return false;
      return true;
    }
  };
  var unfetchableLink = (link) => {
    return link.origin !== document.location.origin || !["http:", "https:"].includes(link.protocol) || link.hasAttribute("target");
  };
  var linkToTheSamePage = (link) => {
    return link.pathname + link.search === document.location.pathname + document.location.search || link.href.startsWith("#");
  };
  var linkOptsOut = (link) => {
    if (link.getAttribute("data-turbo-prefetch") === "false") return true;
    if (link.getAttribute("data-turbo") === "false") return true;
    const turboPrefetchParent = findClosestRecursively(link, "[data-turbo-prefetch]");
    if (turboPrefetchParent && turboPrefetchParent.getAttribute("data-turbo-prefetch") === "false") return true;
    return false;
  };
  var nonSafeLink = (link) => {
    const turboMethod = link.getAttribute("data-turbo-method");
    if (turboMethod && turboMethod.toLowerCase() !== "get") return true;
    if (isUJS(link)) return true;
    if (link.hasAttribute("data-turbo-confirm")) return true;
    if (link.hasAttribute("data-turbo-stream")) return true;
    return false;
  };
  var isUJS = (link) => {
    return link.hasAttribute("data-remote") || link.hasAttribute("data-behavior") || link.hasAttribute("data-confirm") || link.hasAttribute("data-method");
  };
  var eventPrevented = (link) => {
    const event = dispatch("turbo:before-prefetch", { target: link, cancelable: true });
    return event.defaultPrevented;
  };
  var Navigator = class {
    constructor(delegate) {
      this.delegate = delegate;
    }
    proposeVisit(location2, options = {}) {
      if (this.delegate.allowsVisitingLocationWithAction(location2, options.action)) {
        this.delegate.visitProposedToLocation(location2, options);
      }
    }
    startVisit(locatable, restorationIdentifier, options = {}) {
      this.stop();
      this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, {
        referrer: this.location,
        ...options
      });
      this.currentVisit.start();
    }
    submitForm(form, submitter2) {
      this.stop();
      this.formSubmission = new FormSubmission(this, form, submitter2, true);
      this.formSubmission.start();
    }
    stop() {
      if (this.formSubmission) {
        this.formSubmission.stop();
        delete this.formSubmission;
      }
      if (this.currentVisit) {
        this.currentVisit.cancel();
        delete this.currentVisit;
      }
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get rootLocation() {
      return this.view.snapshot.rootLocation;
    }
    get history() {
      return this.delegate.history;
    }
    // Form submission delegate
    formSubmissionStarted(formSubmission) {
      if (typeof this.adapter.formSubmissionStarted === "function") {
        this.adapter.formSubmissionStarted(formSubmission);
      }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
      if (formSubmission == this.formSubmission) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
          const shouldCacheSnapshot = formSubmission.isSafe;
          if (!shouldCacheSnapshot) {
            this.view.clearSnapshotCache();
          }
          const { statusCode, redirected } = fetchResponse;
          const action = this.#getActionForFormSubmission(formSubmission, fetchResponse);
          const visitOptions = {
            action,
            shouldCacheSnapshot,
            response: { statusCode, responseHTML, redirected }
          };
          this.proposeVisit(fetchResponse.location, visitOptions);
        }
      }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      const responseHTML = await fetchResponse.responseHTML;
      if (responseHTML) {
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        if (fetchResponse.serverError) {
          await this.view.renderError(snapshot, this.currentVisit);
        } else {
          await this.view.renderPage(snapshot, false, true, this.currentVisit);
        }
        if (snapshot.refreshScroll !== "preserve") {
          this.view.scrollToTop();
        }
        this.view.clearSnapshotCache();
      }
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished(formSubmission) {
      if (typeof this.adapter.formSubmissionFinished === "function") {
        this.adapter.formSubmissionFinished(formSubmission);
      }
    }
    // Link prefetching
    linkPrefetchingIsEnabledForLocation(location2) {
      if (typeof this.adapter.linkPrefetchingIsEnabledForLocation === "function") {
        return this.adapter.linkPrefetchingIsEnabledForLocation(location2);
      }
      return true;
    }
    // Visit delegate
    visitStarted(visit2) {
      this.delegate.visitStarted(visit2);
    }
    visitCompleted(visit2) {
      this.delegate.visitCompleted(visit2);
      delete this.currentVisit;
    }
    // Same-page links are no longer handled with a Visit.
    // This method is still needed for Turbo Native adapters.
    locationWithActionIsSamePage(location2, action) {
      return false;
    }
    // Visits
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    #getActionForFormSubmission(formSubmission, fetchResponse) {
      const { submitter: submitter2, formElement } = formSubmission;
      return getVisitAction(submitter2, formElement) || this.#getDefaultAction(fetchResponse);
    }
    #getDefaultAction(fetchResponse) {
      const sameLocationRedirect = fetchResponse.redirected && fetchResponse.location.href === this.location?.href;
      return sameLocationRedirect ? "replace" : "advance";
    }
  };
  var PageStage = {
    initial: 0,
    loading: 1,
    interactive: 2,
    complete: 3
  };
  var PageObserver = class {
    stage = PageStage.initial;
    started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        if (this.stage == PageStage.initial) {
          this.stage = PageStage.loading;
        }
        document.addEventListener("readystatechange", this.interpretReadyState, false);
        addEventListener("pagehide", this.pageWillUnload, false);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        document.removeEventListener("readystatechange", this.interpretReadyState, false);
        removeEventListener("pagehide", this.pageWillUnload, false);
        this.started = false;
      }
    }
    interpretReadyState = () => {
      const { readyState } = this;
      if (readyState == "interactive") {
        this.pageIsInteractive();
      } else if (readyState == "complete") {
        this.pageIsComplete();
      }
    };
    pageIsInteractive() {
      if (this.stage == PageStage.loading) {
        this.stage = PageStage.interactive;
        this.delegate.pageBecameInteractive();
      }
    }
    pageIsComplete() {
      this.pageIsInteractive();
      if (this.stage == PageStage.interactive) {
        this.stage = PageStage.complete;
        this.delegate.pageLoaded();
      }
    }
    pageWillUnload = () => {
      this.delegate.pageWillUnload();
    };
    get readyState() {
      return document.readyState;
    }
  };
  var ScrollObserver = class {
    started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("scroll", this.onScroll, false);
        this.onScroll();
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("scroll", this.onScroll, false);
        this.started = false;
      }
    }
    onScroll = () => {
      this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
    };
    // Private
    updatePosition(position) {
      this.delegate.scrollPositionChanged(position);
    }
  };
  var StreamMessageRenderer = class {
    render({ fragment }) {
      Bardo.preservingPermanentElements(this, getPermanentElementMapForFragment(fragment), () => {
        withAutofocusFromFragment(fragment, () => {
          withPreservedFocus(() => {
            document.documentElement.appendChild(fragment);
          });
        });
      });
    }
    // Bardo delegate
    enteringBardo(currentPermanentElement, newPermanentElement) {
      newPermanentElement.replaceWith(currentPermanentElement.cloneNode(true));
    }
    leavingBardo() {
    }
  };
  function getPermanentElementMapForFragment(fragment) {
    const permanentElementsInDocument = queryPermanentElementsAll(document.documentElement);
    const permanentElementMap = {};
    for (const permanentElementInDocument of permanentElementsInDocument) {
      const { id } = permanentElementInDocument;
      for (const streamElement of fragment.querySelectorAll("turbo-stream")) {
        const elementInStream = getPermanentElementById(streamElement.templateElement.content, id);
        if (elementInStream) {
          permanentElementMap[id] = [permanentElementInDocument, elementInStream];
        }
      }
    }
    return permanentElementMap;
  }
  async function withAutofocusFromFragment(fragment, callback) {
    const generatedID = `turbo-stream-autofocus-${uuid()}`;
    const turboStreams = fragment.querySelectorAll("turbo-stream");
    const elementWithAutofocus = firstAutofocusableElementInStreams(turboStreams);
    let willAutofocusId = null;
    if (elementWithAutofocus) {
      if (elementWithAutofocus.id) {
        willAutofocusId = elementWithAutofocus.id;
      } else {
        willAutofocusId = generatedID;
      }
      elementWithAutofocus.id = willAutofocusId;
    }
    callback();
    await nextRepaint();
    const hasNoActiveElement = document.activeElement == null || document.activeElement == document.body;
    if (hasNoActiveElement && willAutofocusId) {
      const elementToAutofocus = document.getElementById(willAutofocusId);
      if (elementIsFocusable(elementToAutofocus)) {
        elementToAutofocus.focus();
      }
      if (elementToAutofocus && elementToAutofocus.id == generatedID) {
        elementToAutofocus.removeAttribute("id");
      }
    }
  }
  async function withPreservedFocus(callback) {
    const [activeElementBeforeRender, activeElementAfterRender] = await around(callback, () => document.activeElement);
    const restoreFocusTo = activeElementBeforeRender && activeElementBeforeRender.id;
    if (restoreFocusTo) {
      const elementToFocus = document.getElementById(restoreFocusTo);
      if (elementIsFocusable(elementToFocus) && elementToFocus != activeElementAfterRender) {
        elementToFocus.focus();
      }
    }
  }
  function firstAutofocusableElementInStreams(nodeListOfStreamElements) {
    for (const streamElement of nodeListOfStreamElements) {
      const elementWithAutofocus = queryAutofocusableElement(streamElement.templateElement.content);
      if (elementWithAutofocus) return elementWithAutofocus;
    }
    return null;
  }
  var StreamObserver = class {
    sources = /* @__PURE__ */ new Set();
    #started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.#started) {
        this.#started = true;
        addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    stop() {
      if (this.#started) {
        this.#started = false;
        removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    connectStreamSource(source) {
      if (!this.streamSourceIsConnected(source)) {
        this.sources.add(source);
        source.addEventListener("message", this.receiveMessageEvent, false);
      }
    }
    disconnectStreamSource(source) {
      if (this.streamSourceIsConnected(source)) {
        this.sources.delete(source);
        source.removeEventListener("message", this.receiveMessageEvent, false);
      }
    }
    streamSourceIsConnected(source) {
      return this.sources.has(source);
    }
    inspectFetchResponse = (event) => {
      const response = fetchResponseFromEvent(event);
      if (response && fetchResponseIsStream(response)) {
        event.preventDefault();
        this.receiveMessageResponse(response);
      }
    };
    receiveMessageEvent = (event) => {
      if (this.#started && typeof event.data == "string") {
        this.receiveMessageHTML(event.data);
      }
    };
    async receiveMessageResponse(response) {
      const html = await response.responseHTML;
      if (html) {
        this.receiveMessageHTML(html);
      }
    }
    receiveMessageHTML(html) {
      this.delegate.receivedMessageFromStream(StreamMessage.wrap(html));
    }
  };
  function fetchResponseFromEvent(event) {
    const fetchResponse = event.detail?.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
      return fetchResponse;
    }
  }
  function fetchResponseIsStream(response) {
    const contentType = response.contentType ?? "";
    return contentType.startsWith(StreamMessage.contentType);
  }
  var ErrorRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      const { documentElement, body } = document;
      documentElement.replaceChild(newElement, body);
    }
    async render() {
      this.replaceHeadAndBody();
      this.activateScriptElements();
    }
    replaceHeadAndBody() {
      const { documentElement, head } = document;
      documentElement.replaceChild(this.newHead, head);
      this.renderElement(this.currentElement, this.newElement);
    }
    activateScriptElements() {
      for (const replaceableElement of this.scriptElements) {
        const parentNode = replaceableElement.parentNode;
        if (parentNode) {
          const element = activateScriptElement(replaceableElement);
          parentNode.replaceChild(element, replaceableElement);
        }
      }
    }
    get newHead() {
      return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
      return document.documentElement.querySelectorAll("script");
    }
  };
  var PageRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      if (document.body && newElement instanceof HTMLBodyElement) {
        document.body.replaceWith(newElement);
      } else {
        document.documentElement.appendChild(newElement);
      }
    }
    get shouldRender() {
      return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    get reloadReason() {
      if (!this.newSnapshot.isVisitable) {
        return {
          reason: "turbo_visit_control_is_reload"
        };
      }
      if (!this.trackedElementsAreIdentical) {
        return {
          reason: "tracked_element_mismatch"
        };
      }
    }
    async prepareToRender() {
      this.#setLanguage();
      await this.mergeHead();
    }
    async render() {
      if (this.willRender) {
        await this.replaceBody();
      }
    }
    finishRendering() {
      super.finishRendering();
      if (!this.isPreview) {
        this.focusFirstAutofocusableElement();
      }
    }
    get currentHeadSnapshot() {
      return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
      return this.newSnapshot.headSnapshot;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    #setLanguage() {
      const { documentElement } = this.currentSnapshot;
      const { dir, lang } = this.newSnapshot;
      if (lang) {
        documentElement.setAttribute("lang", lang);
      } else {
        documentElement.removeAttribute("lang");
      }
      if (dir) {
        documentElement.setAttribute("dir", dir);
      } else {
        documentElement.removeAttribute("dir");
      }
    }
    async mergeHead() {
      const mergedHeadElements = this.mergeProvisionalElements();
      const newStylesheetElements = this.copyNewHeadStylesheetElements();
      this.copyNewHeadScriptElements();
      await mergedHeadElements;
      await newStylesheetElements;
      if (this.willRender) {
        this.removeUnusedDynamicStylesheetElements();
      }
    }
    async replaceBody() {
      await this.preservingPermanentElements(async () => {
        this.activateNewBody();
        await this.assignNewBody();
      });
    }
    get trackedElementsAreIdentical() {
      return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    async copyNewHeadStylesheetElements() {
      const loadingElements = [];
      for (const element of this.newHeadStylesheetElements) {
        loadingElements.push(waitForLoad(element));
        document.head.appendChild(element);
      }
      await Promise.all(loadingElements);
    }
    copyNewHeadScriptElements() {
      for (const element of this.newHeadScriptElements) {
        document.head.appendChild(activateScriptElement(element));
      }
    }
    removeUnusedDynamicStylesheetElements() {
      for (const element of this.unusedDynamicStylesheetElements) {
        document.head.removeChild(element);
      }
    }
    async mergeProvisionalElements() {
      const newHeadElements = [...this.newHeadProvisionalElements];
      for (const element of this.currentHeadProvisionalElements) {
        if (!this.isCurrentElementInElementList(element, newHeadElements)) {
          document.head.removeChild(element);
        }
      }
      for (const element of newHeadElements) {
        document.head.appendChild(element);
      }
    }
    isCurrentElementInElementList(element, elementList) {
      for (const [index, newElement] of elementList.entries()) {
        if (element.tagName == "TITLE") {
          if (newElement.tagName != "TITLE") {
            continue;
          }
          if (element.innerHTML == newElement.innerHTML) {
            elementList.splice(index, 1);
            return true;
          }
        }
        if (newElement.isEqualNode(element)) {
          elementList.splice(index, 1);
          return true;
        }
      }
      return false;
    }
    removeCurrentHeadProvisionalElements() {
      for (const element of this.currentHeadProvisionalElements) {
        document.head.removeChild(element);
      }
    }
    copyNewHeadProvisionalElements() {
      for (const element of this.newHeadProvisionalElements) {
        document.head.appendChild(element);
      }
    }
    activateNewBody() {
      document.adoptNode(this.newElement);
      this.removeNoscriptElements();
      this.activateNewBodyScriptElements();
    }
    removeNoscriptElements() {
      for (const noscriptElement of this.newElement.querySelectorAll("noscript")) {
        noscriptElement.remove();
      }
    }
    activateNewBodyScriptElements() {
      for (const inertScriptElement of this.newBodyScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    async assignNewBody() {
      await this.renderElement(this.currentElement, this.newElement);
    }
    get unusedDynamicStylesheetElements() {
      return this.oldHeadStylesheetElements.filter((element) => {
        return element.getAttribute("data-turbo-track") === "dynamic";
      });
    }
    get oldHeadStylesheetElements() {
      return this.currentHeadSnapshot.getStylesheetElementsNotInSnapshot(this.newHeadSnapshot);
    }
    get newHeadStylesheetElements() {
      return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
      return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
      return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
      return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
      return this.newElement.querySelectorAll("script");
    }
  };
  var MorphingPageRenderer = class extends PageRenderer {
    static renderElement(currentElement, newElement) {
      morphElements(currentElement, newElement, {
        callbacks: {
          beforeNodeMorphed: (node, newNode) => {
            if (shouldRefreshFrameWithMorphing(node, newNode) && !closestFrameReloadableWithMorphing(node)) {
              node.reload();
              return false;
            }
            return true;
          }
        }
      });
      dispatch("turbo:morph", { detail: { currentElement, newElement } });
    }
    async preservingPermanentElements(callback) {
      return await callback();
    }
    get renderMethod() {
      return "morph";
    }
    get shouldAutofocus() {
      return false;
    }
  };
  var SnapshotCache = class extends LRUCache {
    constructor(size) {
      super(size, toCacheKey);
    }
    get snapshots() {
      return this.entries;
    }
  };
  var PageView = class extends View {
    snapshotCache = new SnapshotCache(10);
    lastRenderedLocation = new URL(location.href);
    forceReloaded = false;
    shouldTransitionTo(newSnapshot) {
      return this.snapshot.prefersViewTransitions && newSnapshot.prefersViewTransitions;
    }
    renderPage(snapshot, isPreview = false, willRender = true, visit2) {
      const shouldMorphPage = this.isPageRefresh(visit2) && (visit2?.refresh?.method || this.snapshot.refreshMethod) === "morph";
      const rendererClass = shouldMorphPage ? MorphingPageRenderer : PageRenderer;
      const renderer = new rendererClass(this.snapshot, snapshot, isPreview, willRender);
      if (!renderer.shouldRender) {
        this.forceReloaded = true;
      } else {
        visit2?.changeHistory();
      }
      return this.render(renderer);
    }
    renderError(snapshot, visit2) {
      visit2?.changeHistory();
      const renderer = new ErrorRenderer(this.snapshot, snapshot, false);
      return this.render(renderer);
    }
    clearSnapshotCache() {
      this.snapshotCache.clear();
    }
    async cacheSnapshot(snapshot = this.snapshot) {
      if (snapshot.isCacheable) {
        this.delegate.viewWillCacheSnapshot();
        const { lastRenderedLocation: location2 } = this;
        await nextEventLoopTick();
        const cachedSnapshot = snapshot.clone();
        this.snapshotCache.put(location2, cachedSnapshot);
        return cachedSnapshot;
      }
    }
    getCachedSnapshotForLocation(location2) {
      return this.snapshotCache.get(location2);
    }
    isPageRefresh(visit2) {
      return !visit2 || this.lastRenderedLocation.pathname === visit2.location.pathname && visit2.action === "replace";
    }
    shouldPreserveScrollPosition(visit2) {
      return this.isPageRefresh(visit2) && (visit2?.refresh?.scroll || this.snapshot.refreshScroll) === "preserve";
    }
    get snapshot() {
      return PageSnapshot.fromElement(this.element);
    }
  };
  var Preloader = class {
    selector = "a[data-turbo-preload]";
    constructor(delegate, snapshotCache) {
      this.delegate = delegate;
      this.snapshotCache = snapshotCache;
    }
    start() {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", this.#preloadAll);
      } else {
        this.preloadOnLoadLinksForView(document.body);
      }
    }
    stop() {
      document.removeEventListener("DOMContentLoaded", this.#preloadAll);
    }
    preloadOnLoadLinksForView(element) {
      for (const link of element.querySelectorAll(this.selector)) {
        if (this.delegate.shouldPreloadLink(link)) {
          this.preloadURL(link);
        }
      }
    }
    async preloadURL(link) {
      const location2 = new URL(link.href);
      if (this.snapshotCache.has(location2)) {
        return;
      }
      const fetchRequest = new FetchRequest(this, FetchMethod.get, location2, new URLSearchParams(), link);
      await fetchRequest.perform();
    }
    // Fetch request delegate
    prepareRequest(fetchRequest) {
      fetchRequest.headers["X-Sec-Purpose"] = "prefetch";
    }
    async requestSucceededWithResponse(fetchRequest, fetchResponse) {
      try {
        const responseHTML = await fetchResponse.responseHTML;
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        this.snapshotCache.put(fetchRequest.url, snapshot);
      } catch (_) {
      }
    }
    requestStarted(fetchRequest) {
    }
    requestErrored(fetchRequest) {
    }
    requestFinished(fetchRequest) {
    }
    requestPreventedHandlingResponse(fetchRequest, fetchResponse) {
    }
    requestFailedWithResponse(fetchRequest, fetchResponse) {
    }
    #preloadAll = () => {
      this.preloadOnLoadLinksForView(document.body);
    };
  };
  var Cache = class {
    constructor(session2) {
      this.session = session2;
    }
    clear() {
      this.session.clearCache();
    }
    resetCacheControl() {
      this.#setCacheControl("");
    }
    exemptPageFromCache() {
      this.#setCacheControl("no-cache");
    }
    exemptPageFromPreview() {
      this.#setCacheControl("no-preview");
    }
    #setCacheControl(value) {
      setMetaContent("turbo-cache-control", value);
    }
  };
  var Session = class {
    navigator = new Navigator(this);
    history = new History(this);
    view = new PageView(this, document.documentElement);
    adapter = new BrowserAdapter(this);
    pageObserver = new PageObserver(this);
    cacheObserver = new CacheObserver();
    linkPrefetchObserver = new LinkPrefetchObserver(this, document);
    linkClickObserver = new LinkClickObserver(this, window);
    formSubmitObserver = new FormSubmitObserver(this, document);
    scrollObserver = new ScrollObserver(this);
    streamObserver = new StreamObserver(this);
    formLinkClickObserver = new FormLinkClickObserver(this, document.documentElement);
    frameRedirector = new FrameRedirector(this, document.documentElement);
    streamMessageRenderer = new StreamMessageRenderer();
    cache = new Cache(this);
    enabled = true;
    started = false;
    #pageRefreshDebouncePeriod = 150;
    constructor(recentRequests2) {
      this.recentRequests = recentRequests2;
      this.preloader = new Preloader(this, this.view.snapshotCache);
      this.debouncedRefresh = this.refresh;
      this.pageRefreshDebouncePeriod = this.pageRefreshDebouncePeriod;
    }
    start() {
      if (!this.started) {
        this.pageObserver.start();
        this.cacheObserver.start();
        this.linkPrefetchObserver.start();
        this.formLinkClickObserver.start();
        this.linkClickObserver.start();
        this.formSubmitObserver.start();
        this.scrollObserver.start();
        this.streamObserver.start();
        this.frameRedirector.start();
        this.history.start();
        this.preloader.start();
        this.started = true;
        this.enabled = true;
      }
    }
    disable() {
      this.enabled = false;
    }
    stop() {
      if (this.started) {
        this.pageObserver.stop();
        this.cacheObserver.stop();
        this.linkPrefetchObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkClickObserver.stop();
        this.formSubmitObserver.stop();
        this.scrollObserver.stop();
        this.streamObserver.stop();
        this.frameRedirector.stop();
        this.history.stop();
        this.preloader.stop();
        this.started = false;
      }
    }
    registerAdapter(adapter) {
      this.adapter = adapter;
    }
    visit(location2, options = {}) {
      const frameElement = options.frame ? document.getElementById(options.frame) : null;
      if (frameElement instanceof FrameElement) {
        const action = options.action || getVisitAction(frameElement);
        frameElement.delegate.proposeVisitIfNavigatedWithAction(frameElement, action);
        frameElement.src = location2.toString();
      } else {
        this.navigator.proposeVisit(expandURL(location2), options);
      }
    }
    refresh(url, options = {}) {
      options = typeof options === "string" ? { requestId: options } : options;
      const { method, requestId, scroll } = options;
      const isRecentRequest = requestId && this.recentRequests.has(requestId);
      const isCurrentUrl = url === document.baseURI;
      if (!isRecentRequest && !this.navigator.currentVisit && isCurrentUrl) {
        this.visit(url, { action: "replace", shouldCacheSnapshot: false, refresh: { method, scroll } });
      }
    }
    connectStreamSource(source) {
      this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
      this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
      this.streamMessageRenderer.render(StreamMessage.wrap(message));
    }
    clearCache() {
      this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
      console.warn(
        "Please replace `session.setProgressBarDelay(delay)` with `session.progressBarDelay = delay`. The function is deprecated and will be removed in a future version of Turbo.`"
      );
      this.progressBarDelay = delay;
    }
    set progressBarDelay(delay) {
      config.drive.progressBarDelay = delay;
    }
    get progressBarDelay() {
      return config.drive.progressBarDelay;
    }
    set drive(value) {
      config.drive.enabled = value;
    }
    get drive() {
      return config.drive.enabled;
    }
    set formMode(value) {
      config.forms.mode = value;
    }
    get formMode() {
      return config.forms.mode;
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    get pageRefreshDebouncePeriod() {
      return this.#pageRefreshDebouncePeriod;
    }
    set pageRefreshDebouncePeriod(value) {
      this.refresh = debounce(this.debouncedRefresh.bind(this), value);
      this.#pageRefreshDebouncePeriod = value;
    }
    // Preloader delegate
    shouldPreloadLink(element) {
      const isUnsafe = element.hasAttribute("data-turbo-method");
      const isStream = element.hasAttribute("data-turbo-stream");
      const frameTarget = element.getAttribute("data-turbo-frame");
      const frame = frameTarget == "_top" ? null : document.getElementById(frameTarget) || findClosestRecursively(element, "turbo-frame:not([disabled])");
      if (isUnsafe || isStream || frame instanceof FrameElement) {
        return false;
      } else {
        const location2 = new URL(element.href);
        return this.elementIsNavigatable(element) && locationIsVisitable(location2, this.snapshot.rootLocation);
      }
    }
    // History delegate
    historyPoppedToLocationWithRestorationIdentifierAndDirection(location2, restorationIdentifier, direction) {
      if (this.enabled) {
        this.navigator.startVisit(location2, restorationIdentifier, {
          action: "restore",
          historyChanged: true,
          direction
        });
      } else {
        this.adapter.pageInvalidated({
          reason: "turbo_disabled"
        });
      }
    }
    historyPoppedWithEmptyState(location2) {
      this.history.replace(location2);
      this.view.lastRenderedLocation = location2;
      this.view.cacheSnapshot();
    }
    // Scroll observer delegate
    scrollPositionChanged(position) {
      this.history.updateRestorationData({ scrollPosition: position });
    }
    // Form click observer delegate
    willSubmitFormLinkToLocation(link, location2) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation);
    }
    submittedFormLinkToLocation() {
    }
    // Link hover observer delegate
    canPrefetchRequestToLocation(link, location2) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation) && this.navigator.linkPrefetchingIsEnabledForLocation(location2);
    }
    // Link click observer delegate
    willFollowLinkToLocation(link, location2, event) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation) && this.applicationAllowsFollowingLinkToLocation(link, location2, event);
    }
    followedLinkToLocation(link, location2) {
      const action = this.getActionForLink(link);
      const acceptsStreamResponse = link.hasAttribute("data-turbo-stream");
      this.visit(location2.href, { action, acceptsStreamResponse });
    }
    // Navigator delegate
    allowsVisitingLocationWithAction(location2, action) {
      return this.applicationAllowsVisitingLocation(location2);
    }
    visitProposedToLocation(location2, options) {
      extendURLWithDeprecatedProperties(location2);
      this.adapter.visitProposedToLocation(location2, options);
    }
    // Visit delegate
    visitStarted(visit2) {
      if (!visit2.acceptsStreamResponse) {
        markAsBusy(document.documentElement);
        this.view.markVisitDirection(visit2.direction);
      }
      extendURLWithDeprecatedProperties(visit2.location);
      this.notifyApplicationAfterVisitingLocation(visit2.location, visit2.action);
    }
    visitCompleted(visit2) {
      this.view.unmarkVisitDirection();
      clearBusyState(document.documentElement);
      this.notifyApplicationAfterPageLoad(visit2.getTimingMetrics());
    }
    // Form submit observer delegate
    willSubmitForm(form, submitter2) {
      const action = getAction$1(form, submitter2);
      return this.submissionIsNavigatable(form, submitter2) && locationIsVisitable(expandURL(action), this.snapshot.rootLocation);
    }
    formSubmitted(form, submitter2) {
      this.navigator.submitForm(form, submitter2);
    }
    // Page observer delegate
    pageBecameInteractive() {
      this.view.lastRenderedLocation = this.location;
      this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
      this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
      this.history.relinquishControlOfScrollRestoration();
    }
    // Stream observer delegate
    receivedMessageFromStream(message) {
      this.renderStreamMessage(message);
    }
    // Page view delegate
    viewWillCacheSnapshot() {
      this.notifyApplicationBeforeCachingSnapshot();
    }
    allowsImmediateRender({ element }, options) {
      const event = this.notifyApplicationBeforeRender(element, options);
      const {
        defaultPrevented,
        detail: { render }
      } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview, renderMethod) {
      this.view.lastRenderedLocation = this.history.location;
      this.notifyApplicationAfterRender(renderMethod);
    }
    preloadOnLoadLinksForView(element) {
      this.preloader.preloadOnLoadLinksForView(element);
    }
    viewInvalidated(reason) {
      this.adapter.pageInvalidated(reason);
    }
    // Frame element
    frameLoaded(frame) {
      this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
      this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    // Application events
    applicationAllowsFollowingLinkToLocation(link, location2, ev) {
      const event = this.notifyApplicationAfterClickingLinkToLocation(link, location2, ev);
      return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location2) {
      const event = this.notifyApplicationBeforeVisitingLocation(location2);
      return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location2, event) {
      return dispatch("turbo:click", {
        target: link,
        detail: { url: location2.href, originalEvent: event },
        cancelable: true
      });
    }
    notifyApplicationBeforeVisitingLocation(location2) {
      return dispatch("turbo:before-visit", {
        detail: { url: location2.href },
        cancelable: true
      });
    }
    notifyApplicationAfterVisitingLocation(location2, action) {
      return dispatch("turbo:visit", { detail: { url: location2.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
      return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, options) {
      return dispatch("turbo:before-render", {
        detail: { newBody, ...options },
        cancelable: true
      });
    }
    notifyApplicationAfterRender(renderMethod) {
      return dispatch("turbo:render", { detail: { renderMethod } });
    }
    notifyApplicationAfterPageLoad(timing = {}) {
      return dispatch("turbo:load", {
        detail: { url: this.location.href, timing }
      });
    }
    notifyApplicationAfterFrameLoad(frame) {
      return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
      return dispatch("turbo:frame-render", {
        detail: { fetchResponse },
        target: frame,
        cancelable: true
      });
    }
    // Helpers
    submissionIsNavigatable(form, submitter2) {
      if (config.forms.mode == "off") {
        return false;
      } else {
        const submitterIsNavigatable = submitter2 ? this.elementIsNavigatable(submitter2) : true;
        if (config.forms.mode == "optin") {
          return submitterIsNavigatable && form.closest('[data-turbo="true"]') != null;
        } else {
          return submitterIsNavigatable && this.elementIsNavigatable(form);
        }
      }
    }
    elementIsNavigatable(element) {
      const container = findClosestRecursively(element, "[data-turbo]");
      const withinFrame = findClosestRecursively(element, "turbo-frame");
      if (config.drive.enabled || withinFrame) {
        if (container) {
          return container.getAttribute("data-turbo") != "false";
        } else {
          return true;
        }
      } else {
        if (container) {
          return container.getAttribute("data-turbo") == "true";
        } else {
          return false;
        }
      }
    }
    // Private
    getActionForLink(link) {
      return getVisitAction(link) || "advance";
    }
    get snapshot() {
      return this.view.snapshot;
    }
  };
  function extendURLWithDeprecatedProperties(url) {
    Object.defineProperties(url, deprecatedLocationPropertyDescriptors);
  }
  var deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
      get() {
        return this.toString();
      }
    }
  };
  var session = new Session(recentRequests);
  var { cache, navigator: sessionNavigator } = session;
  function start() {
    session.start();
  }
  function registerAdapter(adapter) {
    session.registerAdapter(adapter);
  }
  function visit(location2, options) {
    session.visit(location2, options);
  }
  function connectStreamSource(source) {
    session.connectStreamSource(source);
  }
  function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
  }
  function renderStreamMessage(message) {
    session.renderStreamMessage(message);
  }
  function setProgressBarDelay(delay) {
    console.warn(
      "Please replace `Turbo.setProgressBarDelay(delay)` with `Turbo.config.drive.progressBarDelay = delay`. The top-level function is deprecated and will be removed in a future version of Turbo.`"
    );
    config.drive.progressBarDelay = delay;
  }
  function setConfirmMethod(confirmMethod) {
    console.warn(
      "Please replace `Turbo.setConfirmMethod(confirmMethod)` with `Turbo.config.forms.confirm = confirmMethod`. The top-level function is deprecated and will be removed in a future version of Turbo.`"
    );
    config.forms.confirm = confirmMethod;
  }
  function setFormMode(mode) {
    console.warn(
      "Please replace `Turbo.setFormMode(mode)` with `Turbo.config.forms.mode = mode`. The top-level function is deprecated and will be removed in a future version of Turbo.`"
    );
    config.forms.mode = mode;
  }
  function morphBodyElements(currentBody, newBody) {
    MorphingPageRenderer.renderElement(currentBody, newBody);
  }
  function morphTurboFrameElements(currentFrame, newFrame) {
    MorphingFrameRenderer.renderElement(currentFrame, newFrame);
  }
  var Turbo = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    PageRenderer,
    PageSnapshot,
    FrameRenderer,
    fetch: fetchWithTurboHeaders,
    config,
    session,
    cache,
    navigator: sessionNavigator,
    start,
    registerAdapter,
    visit,
    connectStreamSource,
    disconnectStreamSource,
    renderStreamMessage,
    setProgressBarDelay,
    setConfirmMethod,
    setFormMode,
    morphBodyElements,
    morphTurboFrameElements,
    morphChildren,
    morphElements
  });
  var TurboFrameMissingError = class extends Error {
  };
  var FrameController = class {
    fetchResponseLoaded = (_fetchResponse) => Promise.resolve();
    #currentFetchRequest = null;
    #resolveVisitPromise = () => {
    };
    #connected = false;
    #hasBeenLoaded = false;
    #ignoredAttributes = /* @__PURE__ */ new Set();
    #shouldMorphFrame = false;
    action = null;
    constructor(element) {
      this.element = element;
      this.view = new FrameView(this, this.element);
      this.appearanceObserver = new AppearanceObserver(this, this.element);
      this.formLinkClickObserver = new FormLinkClickObserver(this, this.element);
      this.linkInterceptor = new LinkInterceptor(this, this.element);
      this.restorationIdentifier = uuid();
      this.formSubmitObserver = new FormSubmitObserver(this, this.element);
    }
    // Frame delegate
    connect() {
      if (!this.#connected) {
        this.#connected = true;
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
          this.appearanceObserver.start();
        } else {
          this.#loadSourceURL();
        }
        this.formLinkClickObserver.start();
        this.linkInterceptor.start();
        this.formSubmitObserver.start();
      }
    }
    disconnect() {
      if (this.#connected) {
        this.#connected = false;
        this.appearanceObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkInterceptor.stop();
        this.formSubmitObserver.stop();
        if (!this.element.hasAttribute("recurse")) {
          this.#currentFetchRequest?.cancel();
        }
      }
    }
    disabledChanged() {
      if (this.disabled) {
        this.#currentFetchRequest?.cancel();
      } else if (this.loadingStyle == FrameLoadingStyle.eager) {
        this.#loadSourceURL();
      }
    }
    sourceURLChanged() {
      if (this.#isIgnoringChangesTo("src")) return;
      if (!this.sourceURL) {
        this.#currentFetchRequest?.cancel();
      }
      if (this.element.isConnected) {
        this.complete = false;
      }
      if (this.loadingStyle == FrameLoadingStyle.eager || this.#hasBeenLoaded) {
        this.#loadSourceURL();
      }
    }
    sourceURLReloaded() {
      const { refresh, src } = this.element;
      this.#shouldMorphFrame = src && refresh === "morph";
      this.element.removeAttribute("complete");
      this.element.src = null;
      this.element.src = src;
      return this.element.loaded;
    }
    loadingStyleChanged() {
      if (this.loadingStyle == FrameLoadingStyle.lazy) {
        this.appearanceObserver.start();
      } else {
        this.appearanceObserver.stop();
        this.#loadSourceURL();
      }
    }
    async #loadSourceURL() {
      if (this.enabled && this.isActive && !this.complete && this.sourceURL) {
        this.element.loaded = this.#visit(expandURL(this.sourceURL));
        this.appearanceObserver.stop();
        await this.element.loaded;
        this.#hasBeenLoaded = true;
      }
    }
    async loadResponse(fetchResponse) {
      if (fetchResponse.redirected || fetchResponse.succeeded && fetchResponse.isHTML) {
        this.sourceURL = fetchResponse.response.url;
      }
      try {
        const html = await fetchResponse.responseHTML;
        if (html) {
          const document2 = parseHTMLDocument(html);
          const pageSnapshot = PageSnapshot.fromDocument(document2);
          if (pageSnapshot.isVisitable) {
            await this.#loadFrameResponse(fetchResponse, document2);
          } else {
            await this.#handleUnvisitableFrameResponse(fetchResponse);
          }
        }
      } finally {
        this.#shouldMorphFrame = false;
        this.fetchResponseLoaded = () => Promise.resolve();
      }
    }
    // Appearance observer delegate
    elementAppearedInViewport(element) {
      this.proposeVisitIfNavigatedWithAction(element, getVisitAction(element));
      this.#loadSourceURL();
    }
    // Form link click observer delegate
    willSubmitFormLinkToLocation(link) {
      return this.#shouldInterceptNavigation(link);
    }
    submittedFormLinkToLocation(link, _location, form) {
      const frame = this.#findFrameElement(link);
      if (frame) form.setAttribute("data-turbo-frame", frame.id);
    }
    // Link interceptor delegate
    shouldInterceptLinkClick(element, _location, _event) {
      return this.#shouldInterceptNavigation(element);
    }
    linkClickIntercepted(element, location2) {
      this.#navigateFrame(element, location2);
    }
    // Form submit observer delegate
    willSubmitForm(element, submitter2) {
      return element.closest("turbo-frame") == this.element && this.#shouldInterceptNavigation(element, submitter2);
    }
    formSubmitted(element, submitter2) {
      if (this.formSubmission) {
        this.formSubmission.stop();
      }
      this.formSubmission = new FormSubmission(this, element, submitter2);
      const { fetchRequest } = this.formSubmission;
      const frame = this.#findFrameElement(element, submitter2);
      this.prepareRequest(fetchRequest, frame);
      this.formSubmission.start();
    }
    // Fetch request delegate
    prepareRequest(request, frame = this) {
      request.headers["Turbo-Frame"] = frame.id;
      if (this.currentNavigationElement?.hasAttribute("data-turbo-stream")) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      markAsBusy(this.element);
    }
    requestPreventedHandlingResponse(_request, _response) {
      this.#resolveVisitPromise();
    }
    async requestSucceededWithResponse(request, response) {
      await this.loadResponse(response);
      this.#resolveVisitPromise();
    }
    async requestFailedWithResponse(request, response) {
      await this.loadResponse(response);
      this.#resolveVisitPromise();
    }
    requestErrored(request, error2) {
      console.error(error2);
      this.#resolveVisitPromise();
    }
    requestFinished(_request) {
      clearBusyState(this.element);
    }
    // Form submission delegate
    formSubmissionStarted({ formElement }) {
      markAsBusy(formElement, this.#findFrameElement(formElement));
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
      const frame = this.#findFrameElement(formSubmission.formElement, formSubmission.submitter);
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, getVisitAction(formSubmission.submitter, formSubmission.formElement, frame));
      frame.delegate.loadResponse(response);
      if (!formSubmission.isSafe) {
        session.clearCache();
      }
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      this.element.delegate.loadResponse(fetchResponse);
      session.clearCache();
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished({ formElement }) {
      clearBusyState(formElement, this.#findFrameElement(formElement));
    }
    // View delegate
    allowsImmediateRender({ element: newFrame }, options) {
      const event = dispatch("turbo:before-frame-render", {
        target: this.element,
        detail: { newFrame, ...options },
        cancelable: true
      });
      const {
        defaultPrevented,
        detail: { render }
      } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview, _renderMethod) {
    }
    preloadOnLoadLinksForView(element) {
      session.preloadOnLoadLinksForView(element);
    }
    viewInvalidated() {
    }
    // Frame renderer delegate
    willRenderFrame(currentElement, _newElement) {
      this.previousFrameElement = currentElement.cloneNode(true);
    }
    visitCachedSnapshot = ({ element }) => {
      const frame = element.querySelector("#" + this.element.id);
      if (frame && this.previousFrameElement) {
        frame.replaceChildren(...this.previousFrameElement.children);
      }
      delete this.previousFrameElement;
    };
    // Private
    async #loadFrameResponse(fetchResponse, document2) {
      const newFrameElement = await this.extractForeignFrameElement(document2.body);
      const rendererClass = this.#shouldMorphFrame ? MorphingFrameRenderer : FrameRenderer;
      if (newFrameElement) {
        const snapshot = new Snapshot(newFrameElement);
        const renderer = new rendererClass(this, this.view.snapshot, snapshot, false, false);
        if (this.view.renderPromise) await this.view.renderPromise;
        this.changeHistory();
        await this.view.render(renderer);
        this.complete = true;
        session.frameRendered(fetchResponse, this.element);
        session.frameLoaded(this.element);
        await this.fetchResponseLoaded(fetchResponse);
      } else if (this.#willHandleFrameMissingFromResponse(fetchResponse)) {
        this.#handleFrameMissingFromResponse(fetchResponse);
      }
    }
    async #visit(url) {
      const request = new FetchRequest(this, FetchMethod.get, url, new URLSearchParams(), this.element);
      this.#currentFetchRequest?.cancel();
      this.#currentFetchRequest = request;
      return new Promise((resolve) => {
        this.#resolveVisitPromise = () => {
          this.#resolveVisitPromise = () => {
          };
          this.#currentFetchRequest = null;
          resolve();
        };
        request.perform();
      });
    }
    #navigateFrame(element, url, submitter2) {
      const frame = this.#findFrameElement(element, submitter2);
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, getVisitAction(submitter2, element, frame));
      this.#withCurrentNavigationElement(element, () => {
        frame.src = url;
      });
    }
    proposeVisitIfNavigatedWithAction(frame, action = null) {
      this.action = action;
      if (this.action) {
        const pageSnapshot = PageSnapshot.fromElement(frame).clone();
        const { visitCachedSnapshot } = frame.delegate;
        frame.delegate.fetchResponseLoaded = async (fetchResponse) => {
          if (frame.src) {
            const { statusCode, redirected } = fetchResponse;
            const responseHTML = await fetchResponse.responseHTML;
            const response = { statusCode, redirected, responseHTML };
            const options = {
              response,
              visitCachedSnapshot,
              willRender: false,
              updateHistory: false,
              restorationIdentifier: this.restorationIdentifier,
              snapshot: pageSnapshot
            };
            if (this.action) options.action = this.action;
            session.visit(frame.src, options);
          }
        };
      }
    }
    changeHistory() {
      if (this.action) {
        const method = getHistoryMethodForAction(this.action);
        session.history.update(method, expandURL(this.element.src || ""), this.restorationIdentifier);
      }
    }
    async #handleUnvisitableFrameResponse(fetchResponse) {
      console.warn(
        `The response (${fetchResponse.statusCode}) from <turbo-frame id="${this.element.id}"> is performing a full page visit due to turbo-visit-control.`
      );
      await this.#visitResponse(fetchResponse.response);
    }
    #willHandleFrameMissingFromResponse(fetchResponse) {
      this.element.setAttribute("complete", "");
      const response = fetchResponse.response;
      const visit2 = async (url, options) => {
        if (url instanceof Response) {
          this.#visitResponse(url);
        } else {
          session.visit(url, options);
        }
      };
      const event = dispatch("turbo:frame-missing", {
        target: this.element,
        detail: { response, visit: visit2 },
        cancelable: true
      });
      return !event.defaultPrevented;
    }
    #handleFrameMissingFromResponse(fetchResponse) {
      this.view.missing();
      this.#throwFrameMissingError(fetchResponse);
    }
    #throwFrameMissingError(fetchResponse) {
      const message = `The response (${fetchResponse.statusCode}) did not contain the expected <turbo-frame id="${this.element.id}"> and will be ignored. To perform a full page visit instead, set turbo-visit-control to reload.`;
      throw new TurboFrameMissingError(message);
    }
    async #visitResponse(response) {
      const wrapped = new FetchResponse(response);
      const responseHTML = await wrapped.responseHTML;
      const { location: location2, redirected, statusCode } = wrapped;
      return session.visit(location2, { response: { redirected, statusCode, responseHTML } });
    }
    #findFrameElement(element, submitter2) {
      const id = getAttribute("data-turbo-frame", submitter2, element) || this.element.getAttribute("target");
      const target = this.#getFrameElementById(id);
      return target instanceof FrameElement ? target : this.element;
    }
    async extractForeignFrameElement(container) {
      let element;
      const id = CSS.escape(this.id);
      try {
        element = activateElement(container.querySelector(`turbo-frame#${id}`), this.sourceURL);
        if (element) {
          return element;
        }
        element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id}]`), this.sourceURL);
        if (element) {
          await element.loaded;
          return await this.extractForeignFrameElement(element);
        }
      } catch (error2) {
        console.error(error2);
        return new FrameElement();
      }
      return null;
    }
    #formActionIsVisitable(form, submitter2) {
      const action = getAction$1(form, submitter2);
      return locationIsVisitable(expandURL(action), this.rootLocation);
    }
    #shouldInterceptNavigation(element, submitter2) {
      const id = getAttribute("data-turbo-frame", submitter2, element) || this.element.getAttribute("target");
      if (element instanceof HTMLFormElement && !this.#formActionIsVisitable(element, submitter2)) {
        return false;
      }
      if (!this.enabled || id == "_top") {
        return false;
      }
      if (id) {
        const frameElement = this.#getFrameElementById(id);
        if (frameElement) {
          return !frameElement.disabled;
        } else if (id == "_parent") {
          return false;
        }
      }
      if (!session.elementIsNavigatable(element)) {
        return false;
      }
      if (submitter2 && !session.elementIsNavigatable(submitter2)) {
        return false;
      }
      return true;
    }
    // Computed properties
    get id() {
      return this.element.id;
    }
    get disabled() {
      return this.element.disabled;
    }
    get enabled() {
      return !this.disabled;
    }
    get sourceURL() {
      if (this.element.src) {
        return this.element.src;
      }
    }
    set sourceURL(sourceURL) {
      this.#ignoringChangesToAttribute("src", () => {
        this.element.src = sourceURL ?? null;
      });
    }
    get loadingStyle() {
      return this.element.loading;
    }
    get isLoading() {
      return this.formSubmission !== void 0 || this.#resolveVisitPromise() !== void 0;
    }
    get complete() {
      return this.element.hasAttribute("complete");
    }
    set complete(value) {
      if (value) {
        this.element.setAttribute("complete", "");
      } else {
        this.element.removeAttribute("complete");
      }
    }
    get isActive() {
      return this.element.isActive && this.#connected;
    }
    get rootLocation() {
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const root = meta?.content ?? "/";
      return expandURL(root);
    }
    #isIgnoringChangesTo(attributeName) {
      return this.#ignoredAttributes.has(attributeName);
    }
    #ignoringChangesToAttribute(attributeName, callback) {
      this.#ignoredAttributes.add(attributeName);
      callback();
      this.#ignoredAttributes.delete(attributeName);
    }
    #withCurrentNavigationElement(element, callback) {
      this.currentNavigationElement = element;
      callback();
      delete this.currentNavigationElement;
    }
    #getFrameElementById(id) {
      if (id != null) {
        const element = id === "_parent" ? this.element.parentElement.closest("turbo-frame") : document.getElementById(id);
        if (element instanceof FrameElement) {
          return element;
        }
      }
    }
  };
  function activateElement(element, currentURL) {
    if (element) {
      const src = element.getAttribute("src");
      if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
        throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
      }
      if (element.ownerDocument !== document) {
        element = document.importNode(element, true);
      }
      if (element instanceof FrameElement) {
        element.connectedCallback();
        element.disconnectedCallback();
        return element;
      }
    }
  }
  var StreamActions = {
    after() {
      this.removeDuplicateTargetSiblings();
      this.targetElements.forEach((e) => e.parentElement?.insertBefore(this.templateContent, e.nextSibling));
    },
    append() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.append(this.templateContent));
    },
    before() {
      this.removeDuplicateTargetSiblings();
      this.targetElements.forEach((e) => e.parentElement?.insertBefore(this.templateContent, e));
    },
    prepend() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.prepend(this.templateContent));
    },
    remove() {
      this.targetElements.forEach((e) => e.remove());
    },
    replace() {
      const method = this.getAttribute("method");
      this.targetElements.forEach((targetElement) => {
        if (method === "morph") {
          morphElements(targetElement, this.templateContent);
        } else {
          targetElement.replaceWith(this.templateContent);
        }
      });
    },
    update() {
      const method = this.getAttribute("method");
      this.targetElements.forEach((targetElement) => {
        if (method === "morph") {
          morphChildren(targetElement, this.templateContent);
        } else {
          targetElement.innerHTML = "";
          targetElement.append(this.templateContent);
        }
      });
    },
    refresh() {
      const method = this.getAttribute("method");
      const requestId = this.requestId;
      const scroll = this.getAttribute("scroll");
      session.refresh(this.baseURI, { method, requestId, scroll });
    }
  };
  var StreamElement = class _StreamElement extends HTMLElement {
    static async renderElement(newElement) {
      await newElement.performAction();
    }
    async connectedCallback() {
      try {
        await this.render();
      } catch (error2) {
        console.error(error2);
      } finally {
        this.disconnect();
      }
    }
    async render() {
      return this.renderPromise ??= (async () => {
        const event = this.beforeRenderEvent;
        if (this.dispatchEvent(event)) {
          await nextRepaint();
          await event.detail.render(this);
        }
      })();
    }
    disconnect() {
      try {
        this.remove();
      } catch {
      }
    }
    /**
     * Removes duplicate children (by ID)
     */
    removeDuplicateTargetChildren() {
      this.duplicateChildren.forEach((c) => c.remove());
    }
    /**
     * Gets the list of duplicate children (i.e. those with the same ID)
     */
    get duplicateChildren() {
      const existingChildren = this.targetElements.flatMap((e) => [...e.children]).filter((c) => !!c.getAttribute("id"));
      const newChildrenIds = [...this.templateContent?.children || []].filter((c) => !!c.getAttribute("id")).map((c) => c.getAttribute("id"));
      return existingChildren.filter((c) => newChildrenIds.includes(c.getAttribute("id")));
    }
    /**
    * Removes duplicate siblings (by ID)
    */
    removeDuplicateTargetSiblings() {
      this.duplicateSiblings.forEach((c) => c.remove());
    }
    /**
    * Gets the list of duplicate siblings (i.e. those with the same ID)
    */
    get duplicateSiblings() {
      const existingChildren = this.targetElements.flatMap((e) => [...e.parentElement.children]).filter((c) => !!c.id);
      const newChildrenIds = [...this.templateContent?.children || []].filter((c) => !!c.id).map((c) => c.id);
      return existingChildren.filter((c) => newChildrenIds.includes(c.id));
    }
    /**
     * Gets the action function to be performed.
     */
    get performAction() {
      if (this.action) {
        const actionFunction = StreamActions[this.action];
        if (actionFunction) {
          return actionFunction;
        }
        this.#raise("unknown action");
      }
      this.#raise("action attribute is missing");
    }
    /**
     * Gets the target elements which the template will be rendered to.
     */
    get targetElements() {
      if (this.target) {
        return this.targetElementsById;
      } else if (this.targets) {
        return this.targetElementsByQuery;
      } else {
        this.#raise("target or targets attribute is missing");
      }
    }
    /**
     * Gets the contents of the main `<template>`.
     */
    get templateContent() {
      return this.templateElement.content.cloneNode(true);
    }
    /**
     * Gets the main `<template>` used for rendering
     */
    get templateElement() {
      if (this.firstElementChild === null) {
        const template = this.ownerDocument.createElement("template");
        this.appendChild(template);
        return template;
      } else if (this.firstElementChild instanceof HTMLTemplateElement) {
        return this.firstElementChild;
      }
      this.#raise("first child element must be a <template> element");
    }
    /**
     * Gets the current action.
     */
    get action() {
      return this.getAttribute("action");
    }
    /**
     * Gets the current target (an element ID) to which the result will
     * be rendered.
     */
    get target() {
      return this.getAttribute("target");
    }
    /**
     * Gets the current "targets" selector (a CSS selector)
     */
    get targets() {
      return this.getAttribute("targets");
    }
    /**
     * Reads the request-id attribute
     */
    get requestId() {
      return this.getAttribute("request-id");
    }
    #raise(message) {
      throw new Error(`${this.description}: ${message}`);
    }
    get description() {
      return (this.outerHTML.match(/<[^>]+>/) ?? [])[0] ?? "<turbo-stream>";
    }
    get beforeRenderEvent() {
      return new CustomEvent("turbo:before-stream-render", {
        bubbles: true,
        cancelable: true,
        detail: { newStream: this, render: _StreamElement.renderElement }
      });
    }
    get targetElementsById() {
      const element = this.ownerDocument?.getElementById(this.target);
      if (element !== null) {
        return [element];
      } else {
        return [];
      }
    }
    get targetElementsByQuery() {
      const elements = this.ownerDocument?.querySelectorAll(this.targets);
      if (elements.length !== 0) {
        return Array.prototype.slice.call(elements);
      } else {
        return [];
      }
    }
  };
  var StreamSourceElement = class extends HTMLElement {
    streamSource = null;
    connectedCallback() {
      this.streamSource = this.src.match(/^ws{1,2}:/) ? new WebSocket(this.src) : new EventSource(this.src);
      connectStreamSource(this.streamSource);
    }
    disconnectedCallback() {
      if (this.streamSource) {
        this.streamSource.close();
        disconnectStreamSource(this.streamSource);
      }
    }
    get src() {
      return this.getAttribute("src") || "";
    }
  };
  FrameElement.delegateConstructor = FrameController;
  if (customElements.get("turbo-frame") === void 0) {
    customElements.define("turbo-frame", FrameElement);
  }
  if (customElements.get("turbo-stream") === void 0) {
    customElements.define("turbo-stream", StreamElement);
  }
  if (customElements.get("turbo-stream-source") === void 0) {
    customElements.define("turbo-stream-source", StreamSourceElement);
  }
  (() => {
    const scriptElement = document.currentScript;
    if (!scriptElement) return;
    if (scriptElement.hasAttribute("data-turbo-suppress-warning")) return;
    let element = scriptElement.parentElement;
    while (element) {
      if (element == document.body) {
        return console.warn(
          unindent`
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `,
          scriptElement.outerHTML
        );
      }
      element = element.parentElement;
    }
  })();
  window.Turbo = { ...Turbo, StreamActions };
  start();

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable.js
  var consumer;
  async function getConsumer() {
    return consumer || setConsumer(createConsumer2().then(setConsumer));
  }
  function setConsumer(newConsumer) {
    return consumer = newConsumer;
  }
  async function createConsumer2() {
    const { createConsumer: createConsumer3 } = await Promise.resolve().then(() => (init_src(), src_exports));
    return createConsumer3();
  }
  async function subscribeTo(channel, mixin) {
    const { subscriptions } = await getConsumer();
    return subscriptions.create(channel, mixin);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/snakeize.js
  function walk(obj) {
    if (!obj || typeof obj !== "object") return obj;
    if (obj instanceof Date || obj instanceof RegExp) return obj;
    if (Array.isArray(obj)) return obj.map(walk);
    return Object.keys(obj).reduce(function(acc, key) {
      var camel = key[0].toLowerCase() + key.slice(1).replace(/([A-Z]+)/g, function(m, x) {
        return "_" + x.toLowerCase();
      });
      acc[camel] = walk(obj[key]);
      return acc;
    }, {});
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable_stream_source_element.js
  var TurboCableStreamSourceElement = class extends HTMLElement {
    static observedAttributes = ["channel", "signed-stream-name"];
    async connectedCallback() {
      connectStreamSource(this);
      this.subscription = await subscribeTo(this.channel, {
        received: this.dispatchMessageEvent.bind(this),
        connected: this.subscriptionConnected.bind(this),
        disconnected: this.subscriptionDisconnected.bind(this)
      });
    }
    disconnectedCallback() {
      disconnectStreamSource(this);
      if (this.subscription) this.subscription.unsubscribe();
      this.subscriptionDisconnected();
    }
    attributeChangedCallback() {
      if (this.subscription) {
        this.disconnectedCallback();
        this.connectedCallback();
      }
    }
    dispatchMessageEvent(data) {
      const event = new MessageEvent("message", { data });
      return this.dispatchEvent(event);
    }
    subscriptionConnected() {
      this.setAttribute("connected", "");
    }
    subscriptionDisconnected() {
      this.removeAttribute("connected");
    }
    get channel() {
      const channel = this.getAttribute("channel");
      const signed_stream_name = this.getAttribute("signed-stream-name");
      return { channel, signed_stream_name, ...walk({ ...this.dataset }) };
    }
  };
  if (customElements.get("turbo-cable-stream-source") === void 0) {
    customElements.define("turbo-cable-stream-source", TurboCableStreamSourceElement);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/fetch_requests.js
  function encodeMethodIntoRequestBody(event) {
    if (event.target instanceof HTMLFormElement) {
      const { target: form, detail: { fetchOptions } } = event;
      form.addEventListener("turbo:submit-start", ({ detail: { formSubmission: { submitter: submitter2 } } }) => {
        const body = isBodyInit(fetchOptions.body) ? fetchOptions.body : new URLSearchParams();
        const method = determineFetchMethod(submitter2, body, form);
        if (!/get/i.test(method)) {
          if (/post/i.test(method)) {
            body.delete("_method");
          } else {
            body.set("_method", method);
          }
          fetchOptions.method = "post";
        }
      }, { once: true });
    }
  }
  function determineFetchMethod(submitter2, body, form) {
    const formMethod = determineFormMethod(submitter2);
    const overrideMethod = body.get("_method");
    const method = form.getAttribute("method") || "get";
    if (typeof formMethod == "string") {
      return formMethod;
    } else if (typeof overrideMethod == "string") {
      return overrideMethod;
    } else {
      return method;
    }
  }
  function determineFormMethod(submitter2) {
    if (submitter2 instanceof HTMLButtonElement || submitter2 instanceof HTMLInputElement) {
      if (submitter2.name === "_method") {
        return submitter2.value;
      } else if (submitter2.hasAttribute("formmethod")) {
        return submitter2.formMethod;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  function isBodyInit(body) {
    return body instanceof FormData || body instanceof URLSearchParams;
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/index.js
  window.Turbo = turbo_es2017_esm_exports;
  addEventListener("turbo:before-fetch-request", encodeMethodIntoRequestBody);

  // node_modules/@hotwired/stimulus/dist/stimulus.js
  var EventListener = class {
    constructor(eventTarget, eventName, eventOptions) {
      this.eventTarget = eventTarget;
      this.eventName = eventName;
      this.eventOptions = eventOptions;
      this.unorderedBindings = /* @__PURE__ */ new Set();
    }
    connect() {
      this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
    disconnect() {
      this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }
    bindingConnected(binding) {
      this.unorderedBindings.add(binding);
    }
    bindingDisconnected(binding) {
      this.unorderedBindings.delete(binding);
    }
    handleEvent(event) {
      const extendedEvent = extendEvent(event);
      for (const binding of this.bindings) {
        if (extendedEvent.immediatePropagationStopped) {
          break;
        } else {
          binding.handleEvent(extendedEvent);
        }
      }
    }
    hasBindings() {
      return this.unorderedBindings.size > 0;
    }
    get bindings() {
      return Array.from(this.unorderedBindings).sort((left, right) => {
        const leftIndex = left.index, rightIndex = right.index;
        return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
      });
    }
  };
  function extendEvent(event) {
    if ("immediatePropagationStopped" in event) {
      return event;
    } else {
      const { stopImmediatePropagation } = event;
      return Object.assign(event, {
        immediatePropagationStopped: false,
        stopImmediatePropagation() {
          this.immediatePropagationStopped = true;
          stopImmediatePropagation.call(this);
        }
      });
    }
  }
  var Dispatcher = class {
    constructor(application2) {
      this.application = application2;
      this.eventListenerMaps = /* @__PURE__ */ new Map();
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.eventListeners.forEach((eventListener) => eventListener.connect());
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.eventListeners.forEach((eventListener) => eventListener.disconnect());
      }
    }
    get eventListeners() {
      return Array.from(this.eventListenerMaps.values()).reduce((listeners, map) => listeners.concat(Array.from(map.values())), []);
    }
    bindingConnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
    bindingDisconnected(binding, clearEventListeners = false) {
      this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
      if (clearEventListeners)
        this.clearEventListenersForBinding(binding);
    }
    handleError(error2, message, detail = {}) {
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    clearEventListenersForBinding(binding) {
      const eventListener = this.fetchEventListenerForBinding(binding);
      if (!eventListener.hasBindings()) {
        eventListener.disconnect();
        this.removeMappedEventListenerFor(binding);
      }
    }
    removeMappedEventListenerFor(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      eventListenerMap.delete(cacheKey);
      if (eventListenerMap.size == 0)
        this.eventListenerMaps.delete(eventTarget);
    }
    fetchEventListenerForBinding(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
    fetchEventListener(eventTarget, eventName, eventOptions) {
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      let eventListener = eventListenerMap.get(cacheKey);
      if (!eventListener) {
        eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
        eventListenerMap.set(cacheKey, eventListener);
      }
      return eventListener;
    }
    createEventListener(eventTarget, eventName, eventOptions) {
      const eventListener = new EventListener(eventTarget, eventName, eventOptions);
      if (this.started) {
        eventListener.connect();
      }
      return eventListener;
    }
    fetchEventListenerMapForEventTarget(eventTarget) {
      let eventListenerMap = this.eventListenerMaps.get(eventTarget);
      if (!eventListenerMap) {
        eventListenerMap = /* @__PURE__ */ new Map();
        this.eventListenerMaps.set(eventTarget, eventListenerMap);
      }
      return eventListenerMap;
    }
    cacheKey(eventName, eventOptions) {
      const parts = [eventName];
      Object.keys(eventOptions).sort().forEach((key) => {
        parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
      });
      return parts.join(":");
    }
  };
  var defaultActionDescriptorFilters = {
    stop({ event, value }) {
      if (value)
        event.stopPropagation();
      return true;
    },
    prevent({ event, value }) {
      if (value)
        event.preventDefault();
      return true;
    },
    self({ event, value, element }) {
      if (value) {
        return element === event.target;
      } else {
        return true;
      }
    }
  };
  var descriptorPattern = /^(?:(?:([^.]+?)\+)?(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/;
  function parseActionDescriptorString(descriptorString) {
    const source = descriptorString.trim();
    const matches = source.match(descriptorPattern) || [];
    let eventName = matches[2];
    let keyFilter = matches[3];
    if (keyFilter && !["keydown", "keyup", "keypress"].includes(eventName)) {
      eventName += `.${keyFilter}`;
      keyFilter = "";
    }
    return {
      eventTarget: parseEventTarget(matches[4]),
      eventName,
      eventOptions: matches[7] ? parseEventOptions(matches[7]) : {},
      identifier: matches[5],
      methodName: matches[6],
      keyFilter: matches[1] || keyFilter
    };
  }
  function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
      return window;
    } else if (eventTargetName == "document") {
      return document;
    }
  }
  function parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
  }
  function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
      return "window";
    } else if (eventTarget == document) {
      return "document";
    }
  }
  function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
  }
  function namespaceCamelize(value) {
    return camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
  }
  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
  }
  function tokenize(value) {
    return value.match(/[^\s]+/g) || [];
  }
  function isSomething(object) {
    return object !== null && object !== void 0;
  }
  function hasProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }
  var allModifiers = ["meta", "ctrl", "alt", "shift"];
  var Action = class {
    constructor(element, index, descriptor, schema) {
      this.element = element;
      this.index = index;
      this.eventTarget = descriptor.eventTarget || element;
      this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
      this.eventOptions = descriptor.eventOptions || {};
      this.identifier = descriptor.identifier || error("missing identifier");
      this.methodName = descriptor.methodName || error("missing method name");
      this.keyFilter = descriptor.keyFilter || "";
      this.schema = schema;
    }
    static forToken(token, schema) {
      return new this(token.element, token.index, parseActionDescriptorString(token.content), schema);
    }
    toString() {
      const eventFilter = this.keyFilter ? `.${this.keyFilter}` : "";
      const eventTarget = this.eventTargetName ? `@${this.eventTargetName}` : "";
      return `${this.eventName}${eventFilter}${eventTarget}->${this.identifier}#${this.methodName}`;
    }
    shouldIgnoreKeyboardEvent(event) {
      if (!this.keyFilter) {
        return false;
      }
      const filters = this.keyFilter.split("+");
      if (this.keyFilterDissatisfied(event, filters)) {
        return true;
      }
      const standardFilter = filters.filter((key) => !allModifiers.includes(key))[0];
      if (!standardFilter) {
        return false;
      }
      if (!hasProperty(this.keyMappings, standardFilter)) {
        error(`contains unknown key filter: ${this.keyFilter}`);
      }
      return this.keyMappings[standardFilter].toLowerCase() !== event.key.toLowerCase();
    }
    shouldIgnoreMouseEvent(event) {
      if (!this.keyFilter) {
        return false;
      }
      const filters = [this.keyFilter];
      if (this.keyFilterDissatisfied(event, filters)) {
        return true;
      }
      return false;
    }
    get params() {
      const params = {};
      const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`, "i");
      for (const { name, value } of Array.from(this.element.attributes)) {
        const match = name.match(pattern);
        const key = match && match[1];
        if (key) {
          params[camelize(key)] = typecast(value);
        }
      }
      return params;
    }
    get eventTargetName() {
      return stringifyEventTarget(this.eventTarget);
    }
    get keyMappings() {
      return this.schema.keyMappings;
    }
    keyFilterDissatisfied(event, filters) {
      const [meta, ctrl, alt, shift] = allModifiers.map((modifier) => filters.includes(modifier));
      return event.metaKey !== meta || event.ctrlKey !== ctrl || event.altKey !== alt || event.shiftKey !== shift;
    }
  };
  var defaultEventNames = {
    a: () => "click",
    button: () => "click",
    form: () => "submit",
    details: () => "toggle",
    input: (e) => e.getAttribute("type") == "submit" ? "click" : "input",
    select: () => "change",
    textarea: () => "input"
  };
  function getDefaultEventNameForElement(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName in defaultEventNames) {
      return defaultEventNames[tagName](element);
    }
  }
  function error(message) {
    throw new Error(message);
  }
  function typecast(value) {
    try {
      return JSON.parse(value);
    } catch (o_O) {
      return value;
    }
  }
  var Binding = class {
    constructor(context, action) {
      this.context = context;
      this.action = action;
    }
    get index() {
      return this.action.index;
    }
    get eventTarget() {
      return this.action.eventTarget;
    }
    get eventOptions() {
      return this.action.eventOptions;
    }
    get identifier() {
      return this.context.identifier;
    }
    handleEvent(event) {
      const actionEvent = this.prepareActionEvent(event);
      if (this.willBeInvokedByEvent(event) && this.applyEventModifiers(actionEvent)) {
        this.invokeWithEvent(actionEvent);
      }
    }
    get eventName() {
      return this.action.eventName;
    }
    get method() {
      const method = this.controller[this.methodName];
      if (typeof method == "function") {
        return method;
      }
      throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
    }
    applyEventModifiers(event) {
      const { element } = this.action;
      const { actionDescriptorFilters } = this.context.application;
      const { controller } = this.context;
      let passes = true;
      for (const [name, value] of Object.entries(this.eventOptions)) {
        if (name in actionDescriptorFilters) {
          const filter = actionDescriptorFilters[name];
          passes = passes && filter({ name, value, event, element, controller });
        } else {
          continue;
        }
      }
      return passes;
    }
    prepareActionEvent(event) {
      return Object.assign(event, { params: this.action.params });
    }
    invokeWithEvent(event) {
      const { target, currentTarget } = event;
      try {
        this.method.call(this.controller, event);
        this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
      } catch (error2) {
        const { identifier, controller, element, index } = this;
        const detail = { identifier, controller, element, index, event };
        this.context.handleError(error2, `invoking action "${this.action}"`, detail);
      }
    }
    willBeInvokedByEvent(event) {
      const eventTarget = event.target;
      if (event instanceof KeyboardEvent && this.action.shouldIgnoreKeyboardEvent(event)) {
        return false;
      }
      if (event instanceof MouseEvent && this.action.shouldIgnoreMouseEvent(event)) {
        return false;
      }
      if (this.element === eventTarget) {
        return true;
      } else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
        return this.scope.containsElement(eventTarget);
      } else {
        return this.scope.containsElement(this.action.element);
      }
    }
    get controller() {
      return this.context.controller;
    }
    get methodName() {
      return this.action.methodName;
    }
    get element() {
      return this.scope.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var ElementObserver = class {
    constructor(element, delegate) {
      this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
      this.element = element;
      this.started = false;
      this.delegate = delegate;
      this.elements = /* @__PURE__ */ new Set();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.refresh();
      }
    }
    pause(callback) {
      if (this.started) {
        this.mutationObserver.disconnect();
        this.started = false;
      }
      callback();
      if (!this.started) {
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        const matches = new Set(this.matchElementsInTree());
        for (const element of Array.from(this.elements)) {
          if (!matches.has(element)) {
            this.removeElement(element);
          }
        }
        for (const element of Array.from(matches)) {
          this.addElement(element);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      if (mutation.type == "attributes") {
        this.processAttributeChange(mutation.target, mutation.attributeName);
      } else if (mutation.type == "childList") {
        this.processRemovedNodes(mutation.removedNodes);
        this.processAddedNodes(mutation.addedNodes);
      }
    }
    processAttributeChange(element, attributeName) {
      if (this.elements.has(element)) {
        if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
          this.delegate.elementAttributeChanged(element, attributeName);
        } else {
          this.removeElement(element);
        }
      } else if (this.matchElement(element)) {
        this.addElement(element);
      }
    }
    processRemovedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element) {
          this.processTree(element, this.removeElement);
        }
      }
    }
    processAddedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element && this.elementIsActive(element)) {
          this.processTree(element, this.addElement);
        }
      }
    }
    matchElement(element) {
      return this.delegate.matchElement(element);
    }
    matchElementsInTree(tree = this.element) {
      return this.delegate.matchElementsInTree(tree);
    }
    processTree(tree, processor) {
      for (const element of this.matchElementsInTree(tree)) {
        processor.call(this, element);
      }
    }
    elementFromNode(node) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        return node;
      }
    }
    elementIsActive(element) {
      if (element.isConnected != this.element.isConnected) {
        return false;
      } else {
        return this.element.contains(element);
      }
    }
    addElement(element) {
      if (!this.elements.has(element)) {
        if (this.elementIsActive(element)) {
          this.elements.add(element);
          if (this.delegate.elementMatched) {
            this.delegate.elementMatched(element);
          }
        }
      }
    }
    removeElement(element) {
      if (this.elements.has(element)) {
        this.elements.delete(element);
        if (this.delegate.elementUnmatched) {
          this.delegate.elementUnmatched(element);
        }
      }
    }
  };
  var AttributeObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeName = attributeName;
      this.delegate = delegate;
      this.elementObserver = new ElementObserver(element, this);
    }
    get element() {
      return this.elementObserver.element;
    }
    get selector() {
      return `[${this.attributeName}]`;
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get started() {
      return this.elementObserver.started;
    }
    matchElement(element) {
      return element.hasAttribute(this.attributeName);
    }
    matchElementsInTree(tree) {
      const match = this.matchElement(tree) ? [tree] : [];
      const matches = Array.from(tree.querySelectorAll(this.selector));
      return match.concat(matches);
    }
    elementMatched(element) {
      if (this.delegate.elementMatchedAttribute) {
        this.delegate.elementMatchedAttribute(element, this.attributeName);
      }
    }
    elementUnmatched(element) {
      if (this.delegate.elementUnmatchedAttribute) {
        this.delegate.elementUnmatchedAttribute(element, this.attributeName);
      }
    }
    elementAttributeChanged(element, attributeName) {
      if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
        this.delegate.elementAttributeValueChanged(element, attributeName);
      }
    }
  };
  function add(map, key, value) {
    fetch(map, key).add(value);
  }
  function del(map, key, value) {
    fetch(map, key).delete(value);
    prune(map, key);
  }
  function fetch(map, key) {
    let values = map.get(key);
    if (!values) {
      values = /* @__PURE__ */ new Set();
      map.set(key, values);
    }
    return values;
  }
  function prune(map, key) {
    const values = map.get(key);
    if (values != null && values.size == 0) {
      map.delete(key);
    }
  }
  var Multimap = class {
    constructor() {
      this.valuesByKey = /* @__PURE__ */ new Map();
    }
    get keys() {
      return Array.from(this.valuesByKey.keys());
    }
    get values() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((values, set) => values.concat(Array.from(set)), []);
    }
    get size() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((size, set) => size + set.size, 0);
    }
    add(key, value) {
      add(this.valuesByKey, key, value);
    }
    delete(key, value) {
      del(this.valuesByKey, key, value);
    }
    has(key, value) {
      const values = this.valuesByKey.get(key);
      return values != null && values.has(value);
    }
    hasKey(key) {
      return this.valuesByKey.has(key);
    }
    hasValue(value) {
      const sets = Array.from(this.valuesByKey.values());
      return sets.some((set) => set.has(value));
    }
    getValuesForKey(key) {
      const values = this.valuesByKey.get(key);
      return values ? Array.from(values) : [];
    }
    getKeysForValue(value) {
      return Array.from(this.valuesByKey).filter(([_key, values]) => values.has(value)).map(([key, _values]) => key);
    }
  };
  var SelectorObserver = class {
    constructor(element, selector, delegate, details) {
      this._selector = selector;
      this.details = details;
      this.elementObserver = new ElementObserver(element, this);
      this.delegate = delegate;
      this.matchesByElement = new Multimap();
    }
    get started() {
      return this.elementObserver.started;
    }
    get selector() {
      return this._selector;
    }
    set selector(selector) {
      this._selector = selector;
      this.refresh();
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get element() {
      return this.elementObserver.element;
    }
    matchElement(element) {
      const { selector } = this;
      if (selector) {
        const matches = element.matches(selector);
        if (this.delegate.selectorMatchElement) {
          return matches && this.delegate.selectorMatchElement(element, this.details);
        }
        return matches;
      } else {
        return false;
      }
    }
    matchElementsInTree(tree) {
      const { selector } = this;
      if (selector) {
        const match = this.matchElement(tree) ? [tree] : [];
        const matches = Array.from(tree.querySelectorAll(selector)).filter((match2) => this.matchElement(match2));
        return match.concat(matches);
      } else {
        return [];
      }
    }
    elementMatched(element) {
      const { selector } = this;
      if (selector) {
        this.selectorMatched(element, selector);
      }
    }
    elementUnmatched(element) {
      const selectors = this.matchesByElement.getKeysForValue(element);
      for (const selector of selectors) {
        this.selectorUnmatched(element, selector);
      }
    }
    elementAttributeChanged(element, _attributeName) {
      const { selector } = this;
      if (selector) {
        const matches = this.matchElement(element);
        const matchedBefore = this.matchesByElement.has(selector, element);
        if (matches && !matchedBefore) {
          this.selectorMatched(element, selector);
        } else if (!matches && matchedBefore) {
          this.selectorUnmatched(element, selector);
        }
      }
    }
    selectorMatched(element, selector) {
      this.delegate.selectorMatched(element, selector, this.details);
      this.matchesByElement.add(selector, element);
    }
    selectorUnmatched(element, selector) {
      this.delegate.selectorUnmatched(element, selector, this.details);
      this.matchesByElement.delete(selector, element);
    }
  };
  var StringMapObserver = class {
    constructor(element, delegate) {
      this.element = element;
      this.delegate = delegate;
      this.started = false;
      this.stringMap = /* @__PURE__ */ new Map();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
        this.refresh();
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        for (const attributeName of this.knownAttributeNames) {
          this.refreshAttribute(attributeName, null);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      const attributeName = mutation.attributeName;
      if (attributeName) {
        this.refreshAttribute(attributeName, mutation.oldValue);
      }
    }
    refreshAttribute(attributeName, oldValue) {
      const key = this.delegate.getStringMapKeyForAttribute(attributeName);
      if (key != null) {
        if (!this.stringMap.has(attributeName)) {
          this.stringMapKeyAdded(key, attributeName);
        }
        const value = this.element.getAttribute(attributeName);
        if (this.stringMap.get(attributeName) != value) {
          this.stringMapValueChanged(value, key, oldValue);
        }
        if (value == null) {
          const oldValue2 = this.stringMap.get(attributeName);
          this.stringMap.delete(attributeName);
          if (oldValue2)
            this.stringMapKeyRemoved(key, attributeName, oldValue2);
        } else {
          this.stringMap.set(attributeName, value);
        }
      }
    }
    stringMapKeyAdded(key, attributeName) {
      if (this.delegate.stringMapKeyAdded) {
        this.delegate.stringMapKeyAdded(key, attributeName);
      }
    }
    stringMapValueChanged(value, key, oldValue) {
      if (this.delegate.stringMapValueChanged) {
        this.delegate.stringMapValueChanged(value, key, oldValue);
      }
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      if (this.delegate.stringMapKeyRemoved) {
        this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
      }
    }
    get knownAttributeNames() {
      return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
    }
    get currentAttributeNames() {
      return Array.from(this.element.attributes).map((attribute) => attribute.name);
    }
    get recordedAttributeNames() {
      return Array.from(this.stringMap.keys());
    }
  };
  var TokenListObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeObserver = new AttributeObserver(element, attributeName, this);
      this.delegate = delegate;
      this.tokensByElement = new Multimap();
    }
    get started() {
      return this.attributeObserver.started;
    }
    start() {
      this.attributeObserver.start();
    }
    pause(callback) {
      this.attributeObserver.pause(callback);
    }
    stop() {
      this.attributeObserver.stop();
    }
    refresh() {
      this.attributeObserver.refresh();
    }
    get element() {
      return this.attributeObserver.element;
    }
    get attributeName() {
      return this.attributeObserver.attributeName;
    }
    elementMatchedAttribute(element) {
      this.tokensMatched(this.readTokensForElement(element));
    }
    elementAttributeValueChanged(element) {
      const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
      this.tokensUnmatched(unmatchedTokens);
      this.tokensMatched(matchedTokens);
    }
    elementUnmatchedAttribute(element) {
      this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
    tokensMatched(tokens) {
      tokens.forEach((token) => this.tokenMatched(token));
    }
    tokensUnmatched(tokens) {
      tokens.forEach((token) => this.tokenUnmatched(token));
    }
    tokenMatched(token) {
      this.delegate.tokenMatched(token);
      this.tokensByElement.add(token.element, token);
    }
    tokenUnmatched(token) {
      this.delegate.tokenUnmatched(token);
      this.tokensByElement.delete(token.element, token);
    }
    refreshTokensForElement(element) {
      const previousTokens = this.tokensByElement.getValuesForKey(element);
      const currentTokens = this.readTokensForElement(element);
      const firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
      if (firstDifferingIndex == -1) {
        return [[], []];
      } else {
        return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
      }
    }
    readTokensForElement(element) {
      const attributeName = this.attributeName;
      const tokenString = element.getAttribute(attributeName) || "";
      return parseTokenString(tokenString, element, attributeName);
    }
  };
  function parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter((content) => content.length).map((content, index) => ({ element, attributeName, content, index }));
  }
  function zip(left, right) {
    const length = Math.max(left.length, right.length);
    return Array.from({ length }, (_, index) => [left[index], right[index]]);
  }
  function tokensAreEqual(left, right) {
    return left && right && left.index == right.index && left.content == right.content;
  }
  var ValueListObserver = class {
    constructor(element, attributeName, delegate) {
      this.tokenListObserver = new TokenListObserver(element, attributeName, this);
      this.delegate = delegate;
      this.parseResultsByToken = /* @__PURE__ */ new WeakMap();
      this.valuesByTokenByElement = /* @__PURE__ */ new WeakMap();
    }
    get started() {
      return this.tokenListObserver.started;
    }
    start() {
      this.tokenListObserver.start();
    }
    stop() {
      this.tokenListObserver.stop();
    }
    refresh() {
      this.tokenListObserver.refresh();
    }
    get element() {
      return this.tokenListObserver.element;
    }
    get attributeName() {
      return this.tokenListObserver.attributeName;
    }
    tokenMatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).set(token, value);
        this.delegate.elementMatchedValue(element, value);
      }
    }
    tokenUnmatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).delete(token);
        this.delegate.elementUnmatchedValue(element, value);
      }
    }
    fetchParseResultForToken(token) {
      let parseResult = this.parseResultsByToken.get(token);
      if (!parseResult) {
        parseResult = this.parseToken(token);
        this.parseResultsByToken.set(token, parseResult);
      }
      return parseResult;
    }
    fetchValuesByTokenForElement(element) {
      let valuesByToken = this.valuesByTokenByElement.get(element);
      if (!valuesByToken) {
        valuesByToken = /* @__PURE__ */ new Map();
        this.valuesByTokenByElement.set(element, valuesByToken);
      }
      return valuesByToken;
    }
    parseToken(token) {
      try {
        const value = this.delegate.parseValueForToken(token);
        return { value };
      } catch (error2) {
        return { error: error2 };
      }
    }
  };
  var BindingObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.bindingsByAction = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.valueListObserver) {
        this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
        this.valueListObserver.start();
      }
    }
    stop() {
      if (this.valueListObserver) {
        this.valueListObserver.stop();
        delete this.valueListObserver;
        this.disconnectAllActions();
      }
    }
    get element() {
      return this.context.element;
    }
    get identifier() {
      return this.context.identifier;
    }
    get actionAttribute() {
      return this.schema.actionAttribute;
    }
    get schema() {
      return this.context.schema;
    }
    get bindings() {
      return Array.from(this.bindingsByAction.values());
    }
    connectAction(action) {
      const binding = new Binding(this.context, action);
      this.bindingsByAction.set(action, binding);
      this.delegate.bindingConnected(binding);
    }
    disconnectAction(action) {
      const binding = this.bindingsByAction.get(action);
      if (binding) {
        this.bindingsByAction.delete(action);
        this.delegate.bindingDisconnected(binding);
      }
    }
    disconnectAllActions() {
      this.bindings.forEach((binding) => this.delegate.bindingDisconnected(binding, true));
      this.bindingsByAction.clear();
    }
    parseValueForToken(token) {
      const action = Action.forToken(token, this.schema);
      if (action.identifier == this.identifier) {
        return action;
      }
    }
    elementMatchedValue(element, action) {
      this.connectAction(action);
    }
    elementUnmatchedValue(element, action) {
      this.disconnectAction(action);
    }
  };
  var ValueObserver = class {
    constructor(context, receiver) {
      this.context = context;
      this.receiver = receiver;
      this.stringMapObserver = new StringMapObserver(this.element, this);
      this.valueDescriptorMap = this.controller.valueDescriptorMap;
    }
    start() {
      this.stringMapObserver.start();
      this.invokeChangedCallbacksForDefaultValues();
    }
    stop() {
      this.stringMapObserver.stop();
    }
    get element() {
      return this.context.element;
    }
    get controller() {
      return this.context.controller;
    }
    getStringMapKeyForAttribute(attributeName) {
      if (attributeName in this.valueDescriptorMap) {
        return this.valueDescriptorMap[attributeName].name;
      }
    }
    stringMapKeyAdded(key, attributeName) {
      const descriptor = this.valueDescriptorMap[attributeName];
      if (!this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
      }
    }
    stringMapValueChanged(value, name, oldValue) {
      const descriptor = this.valueDescriptorNameMap[name];
      if (value === null)
        return;
      if (oldValue === null) {
        oldValue = descriptor.writer(descriptor.defaultValue);
      }
      this.invokeChangedCallback(name, value, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      const descriptor = this.valueDescriptorNameMap[key];
      if (this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
      } else {
        this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
      }
    }
    invokeChangedCallbacksForDefaultValues() {
      for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
        if (defaultValue != void 0 && !this.controller.data.has(key)) {
          this.invokeChangedCallback(name, writer(defaultValue), void 0);
        }
      }
    }
    invokeChangedCallback(name, rawValue, rawOldValue) {
      const changedMethodName = `${name}Changed`;
      const changedMethod = this.receiver[changedMethodName];
      if (typeof changedMethod == "function") {
        const descriptor = this.valueDescriptorNameMap[name];
        try {
          const value = descriptor.reader(rawValue);
          let oldValue = rawOldValue;
          if (rawOldValue) {
            oldValue = descriptor.reader(rawOldValue);
          }
          changedMethod.call(this.receiver, value, oldValue);
        } catch (error2) {
          if (error2 instanceof TypeError) {
            error2.message = `Stimulus Value "${this.context.identifier}.${descriptor.name}" - ${error2.message}`;
          }
          throw error2;
        }
      }
    }
    get valueDescriptors() {
      const { valueDescriptorMap } = this;
      return Object.keys(valueDescriptorMap).map((key) => valueDescriptorMap[key]);
    }
    get valueDescriptorNameMap() {
      const descriptors = {};
      Object.keys(this.valueDescriptorMap).forEach((key) => {
        const descriptor = this.valueDescriptorMap[key];
        descriptors[descriptor.name] = descriptor;
      });
      return descriptors;
    }
    hasValue(attributeName) {
      const descriptor = this.valueDescriptorNameMap[attributeName];
      const hasMethodName = `has${capitalize(descriptor.name)}`;
      return this.receiver[hasMethodName];
    }
  };
  var TargetObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.targetsByName = new Multimap();
    }
    start() {
      if (!this.tokenListObserver) {
        this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
        this.tokenListObserver.start();
      }
    }
    stop() {
      if (this.tokenListObserver) {
        this.disconnectAllTargets();
        this.tokenListObserver.stop();
        delete this.tokenListObserver;
      }
    }
    tokenMatched({ element, content: name }) {
      if (this.scope.containsElement(element)) {
        this.connectTarget(element, name);
      }
    }
    tokenUnmatched({ element, content: name }) {
      this.disconnectTarget(element, name);
    }
    connectTarget(element, name) {
      var _a;
      if (!this.targetsByName.has(name, element)) {
        this.targetsByName.add(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
      }
    }
    disconnectTarget(element, name) {
      var _a;
      if (this.targetsByName.has(name, element)) {
        this.targetsByName.delete(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
      }
    }
    disconnectAllTargets() {
      for (const name of this.targetsByName.keys) {
        for (const element of this.targetsByName.getValuesForKey(name)) {
          this.disconnectTarget(element, name);
        }
      }
    }
    get attributeName() {
      return `data-${this.context.identifier}-target`;
    }
    get element() {
      return this.context.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor2) => {
      getOwnStaticArrayValues(constructor2, propertyName).forEach((name) => values.add(name));
      return values;
    }, /* @__PURE__ */ new Set()));
  }
  function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor2) => {
      pairs.push(...getOwnStaticObjectPairs(constructor2, propertyName));
      return pairs;
    }, []);
  }
  function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
      ancestors.push(constructor);
      constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
  }
  function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
  }
  function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
  }
  var OutletObserver = class {
    constructor(context, delegate) {
      this.started = false;
      this.context = context;
      this.delegate = delegate;
      this.outletsByName = new Multimap();
      this.outletElementsByName = new Multimap();
      this.selectorObserverMap = /* @__PURE__ */ new Map();
      this.attributeObserverMap = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.started) {
        this.outletDefinitions.forEach((outletName) => {
          this.setupSelectorObserverForOutlet(outletName);
          this.setupAttributeObserverForOutlet(outletName);
        });
        this.started = true;
        this.dependentContexts.forEach((context) => context.refresh());
      }
    }
    refresh() {
      this.selectorObserverMap.forEach((observer) => observer.refresh());
      this.attributeObserverMap.forEach((observer) => observer.refresh());
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.disconnectAllOutlets();
        this.stopSelectorObservers();
        this.stopAttributeObservers();
      }
    }
    stopSelectorObservers() {
      if (this.selectorObserverMap.size > 0) {
        this.selectorObserverMap.forEach((observer) => observer.stop());
        this.selectorObserverMap.clear();
      }
    }
    stopAttributeObservers() {
      if (this.attributeObserverMap.size > 0) {
        this.attributeObserverMap.forEach((observer) => observer.stop());
        this.attributeObserverMap.clear();
      }
    }
    selectorMatched(element, _selector, { outletName }) {
      const outlet = this.getOutlet(element, outletName);
      if (outlet) {
        this.connectOutlet(outlet, element, outletName);
      }
    }
    selectorUnmatched(element, _selector, { outletName }) {
      const outlet = this.getOutletFromMap(element, outletName);
      if (outlet) {
        this.disconnectOutlet(outlet, element, outletName);
      }
    }
    selectorMatchElement(element, { outletName }) {
      const selector = this.selector(outletName);
      const hasOutlet = this.hasOutlet(element, outletName);
      const hasOutletController = element.matches(`[${this.schema.controllerAttribute}~=${outletName}]`);
      if (selector) {
        return hasOutlet && hasOutletController && element.matches(selector);
      } else {
        return false;
      }
    }
    elementMatchedAttribute(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    elementAttributeValueChanged(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    elementUnmatchedAttribute(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    connectOutlet(outlet, element, outletName) {
      var _a;
      if (!this.outletElementsByName.has(outletName, element)) {
        this.outletsByName.add(outletName, outlet);
        this.outletElementsByName.add(outletName, element);
        (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletConnected(outlet, element, outletName));
      }
    }
    disconnectOutlet(outlet, element, outletName) {
      var _a;
      if (this.outletElementsByName.has(outletName, element)) {
        this.outletsByName.delete(outletName, outlet);
        this.outletElementsByName.delete(outletName, element);
        (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletDisconnected(outlet, element, outletName));
      }
    }
    disconnectAllOutlets() {
      for (const outletName of this.outletElementsByName.keys) {
        for (const element of this.outletElementsByName.getValuesForKey(outletName)) {
          for (const outlet of this.outletsByName.getValuesForKey(outletName)) {
            this.disconnectOutlet(outlet, element, outletName);
          }
        }
      }
    }
    updateSelectorObserverForOutlet(outletName) {
      const observer = this.selectorObserverMap.get(outletName);
      if (observer) {
        observer.selector = this.selector(outletName);
      }
    }
    setupSelectorObserverForOutlet(outletName) {
      const selector = this.selector(outletName);
      const selectorObserver = new SelectorObserver(document.body, selector, this, { outletName });
      this.selectorObserverMap.set(outletName, selectorObserver);
      selectorObserver.start();
    }
    setupAttributeObserverForOutlet(outletName) {
      const attributeName = this.attributeNameForOutletName(outletName);
      const attributeObserver = new AttributeObserver(this.scope.element, attributeName, this);
      this.attributeObserverMap.set(outletName, attributeObserver);
      attributeObserver.start();
    }
    selector(outletName) {
      return this.scope.outlets.getSelectorForOutletName(outletName);
    }
    attributeNameForOutletName(outletName) {
      return this.scope.schema.outletAttributeForScope(this.identifier, outletName);
    }
    getOutletNameFromOutletAttributeName(attributeName) {
      return this.outletDefinitions.find((outletName) => this.attributeNameForOutletName(outletName) === attributeName);
    }
    get outletDependencies() {
      const dependencies = new Multimap();
      this.router.modules.forEach((module) => {
        const constructor = module.definition.controllerConstructor;
        const outlets = readInheritableStaticArrayValues(constructor, "outlets");
        outlets.forEach((outlet) => dependencies.add(outlet, module.identifier));
      });
      return dependencies;
    }
    get outletDefinitions() {
      return this.outletDependencies.getKeysForValue(this.identifier);
    }
    get dependentControllerIdentifiers() {
      return this.outletDependencies.getValuesForKey(this.identifier);
    }
    get dependentContexts() {
      const identifiers = this.dependentControllerIdentifiers;
      return this.router.contexts.filter((context) => identifiers.includes(context.identifier));
    }
    hasOutlet(element, outletName) {
      return !!this.getOutlet(element, outletName) || !!this.getOutletFromMap(element, outletName);
    }
    getOutlet(element, outletName) {
      return this.application.getControllerForElementAndIdentifier(element, outletName);
    }
    getOutletFromMap(element, outletName) {
      return this.outletsByName.getValuesForKey(outletName).find((outlet) => outlet.element === element);
    }
    get scope() {
      return this.context.scope;
    }
    get schema() {
      return this.context.schema;
    }
    get identifier() {
      return this.context.identifier;
    }
    get application() {
      return this.context.application;
    }
    get router() {
      return this.application.router;
    }
  };
  var Context = class {
    constructor(module, scope) {
      this.logDebugActivity = (functionName, detail = {}) => {
        const { identifier, controller, element } = this;
        detail = Object.assign({ identifier, controller, element }, detail);
        this.application.logDebugActivity(this.identifier, functionName, detail);
      };
      this.module = module;
      this.scope = scope;
      this.controller = new module.controllerConstructor(this);
      this.bindingObserver = new BindingObserver(this, this.dispatcher);
      this.valueObserver = new ValueObserver(this, this.controller);
      this.targetObserver = new TargetObserver(this, this);
      this.outletObserver = new OutletObserver(this, this);
      try {
        this.controller.initialize();
        this.logDebugActivity("initialize");
      } catch (error2) {
        this.handleError(error2, "initializing controller");
      }
    }
    connect() {
      this.bindingObserver.start();
      this.valueObserver.start();
      this.targetObserver.start();
      this.outletObserver.start();
      try {
        this.controller.connect();
        this.logDebugActivity("connect");
      } catch (error2) {
        this.handleError(error2, "connecting controller");
      }
    }
    refresh() {
      this.outletObserver.refresh();
    }
    disconnect() {
      try {
        this.controller.disconnect();
        this.logDebugActivity("disconnect");
      } catch (error2) {
        this.handleError(error2, "disconnecting controller");
      }
      this.outletObserver.stop();
      this.targetObserver.stop();
      this.valueObserver.stop();
      this.bindingObserver.stop();
    }
    get application() {
      return this.module.application;
    }
    get identifier() {
      return this.module.identifier;
    }
    get schema() {
      return this.application.schema;
    }
    get dispatcher() {
      return this.application.dispatcher;
    }
    get element() {
      return this.scope.element;
    }
    get parentElement() {
      return this.element.parentElement;
    }
    handleError(error2, message, detail = {}) {
      const { identifier, controller, element } = this;
      detail = Object.assign({ identifier, controller, element }, detail);
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    targetConnected(element, name) {
      this.invokeControllerMethod(`${name}TargetConnected`, element);
    }
    targetDisconnected(element, name) {
      this.invokeControllerMethod(`${name}TargetDisconnected`, element);
    }
    outletConnected(outlet, element, name) {
      this.invokeControllerMethod(`${namespaceCamelize(name)}OutletConnected`, outlet, element);
    }
    outletDisconnected(outlet, element, name) {
      this.invokeControllerMethod(`${namespaceCamelize(name)}OutletDisconnected`, outlet, element);
    }
    invokeControllerMethod(methodName, ...args) {
      const controller = this.controller;
      if (typeof controller[methodName] == "function") {
        controller[methodName](...args);
      }
    }
  };
  function bless(constructor) {
    return shadow(constructor, getBlessedProperties(constructor));
  }
  function shadow(constructor, properties) {
    const shadowConstructor = extend2(constructor);
    const shadowProperties = getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
  }
  function getBlessedProperties(constructor) {
    const blessings = readInheritableStaticArrayValues(constructor, "blessings");
    return blessings.reduce((blessedProperties, blessing) => {
      const properties = blessing(constructor);
      for (const key in properties) {
        const descriptor = blessedProperties[key] || {};
        blessedProperties[key] = Object.assign(descriptor, properties[key]);
      }
      return blessedProperties;
    }, {});
  }
  function getShadowProperties(prototype, properties) {
    return getOwnKeys(properties).reduce((shadowProperties, key) => {
      const descriptor = getShadowedDescriptor(prototype, properties, key);
      if (descriptor) {
        Object.assign(shadowProperties, { [key]: descriptor });
      }
      return shadowProperties;
    }, {});
  }
  function getShadowedDescriptor(prototype, properties, key) {
    const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
    const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
      const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
      if (shadowingDescriptor) {
        descriptor.get = shadowingDescriptor.get || descriptor.get;
        descriptor.set = shadowingDescriptor.set || descriptor.set;
      }
      return descriptor;
    }
  }
  var getOwnKeys = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
      return (object) => [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)];
    } else {
      return Object.getOwnPropertyNames;
    }
  })();
  var extend2 = (() => {
    function extendWithReflect(constructor) {
      function extended() {
        return Reflect.construct(constructor, arguments, new.target);
      }
      extended.prototype = Object.create(constructor.prototype, {
        constructor: { value: extended }
      });
      Reflect.setPrototypeOf(extended, constructor);
      return extended;
    }
    function testReflectExtension() {
      const a = function() {
        this.a.call(this);
      };
      const b = extendWithReflect(a);
      b.prototype.a = function() {
      };
      return new b();
    }
    try {
      testReflectExtension();
      return extendWithReflect;
    } catch (error2) {
      return (constructor) => class extended extends constructor {
      };
    }
  })();
  function blessDefinition(definition) {
    return {
      identifier: definition.identifier,
      controllerConstructor: bless(definition.controllerConstructor)
    };
  }
  var Module = class {
    constructor(application2, definition) {
      this.application = application2;
      this.definition = blessDefinition(definition);
      this.contextsByScope = /* @__PURE__ */ new WeakMap();
      this.connectedContexts = /* @__PURE__ */ new Set();
    }
    get identifier() {
      return this.definition.identifier;
    }
    get controllerConstructor() {
      return this.definition.controllerConstructor;
    }
    get contexts() {
      return Array.from(this.connectedContexts);
    }
    connectContextForScope(scope) {
      const context = this.fetchContextForScope(scope);
      this.connectedContexts.add(context);
      context.connect();
    }
    disconnectContextForScope(scope) {
      const context = this.contextsByScope.get(scope);
      if (context) {
        this.connectedContexts.delete(context);
        context.disconnect();
      }
    }
    fetchContextForScope(scope) {
      let context = this.contextsByScope.get(scope);
      if (!context) {
        context = new Context(this, scope);
        this.contextsByScope.set(scope, context);
      }
      return context;
    }
  };
  var ClassMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    has(name) {
      return this.data.has(this.getDataKey(name));
    }
    get(name) {
      return this.getAll(name)[0];
    }
    getAll(name) {
      const tokenString = this.data.get(this.getDataKey(name)) || "";
      return tokenize(tokenString);
    }
    getAttributeName(name) {
      return this.data.getAttributeNameForKey(this.getDataKey(name));
    }
    getDataKey(name) {
      return `${name}-class`;
    }
    get data() {
      return this.scope.data;
    }
  };
  var DataMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.getAttribute(name);
    }
    set(key, value) {
      const name = this.getAttributeNameForKey(key);
      this.element.setAttribute(name, value);
      return this.get(key);
    }
    has(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.hasAttribute(name);
    }
    delete(key) {
      if (this.has(key)) {
        const name = this.getAttributeNameForKey(key);
        this.element.removeAttribute(name);
        return true;
      } else {
        return false;
      }
    }
    getAttributeNameForKey(key) {
      return `data-${this.identifier}-${dasherize(key)}`;
    }
  };
  var Guide = class {
    constructor(logger) {
      this.warnedKeysByObject = /* @__PURE__ */ new WeakMap();
      this.logger = logger;
    }
    warn(object, key, message) {
      let warnedKeys = this.warnedKeysByObject.get(object);
      if (!warnedKeys) {
        warnedKeys = /* @__PURE__ */ new Set();
        this.warnedKeysByObject.set(object, warnedKeys);
      }
      if (!warnedKeys.has(key)) {
        warnedKeys.add(key);
        this.logger.warn(message, object);
      }
    }
  };
  function attributeValueContainsToken(attributeName, token) {
    return `[${attributeName}~="${token}"]`;
  }
  var TargetSet = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(targetName) {
      return this.find(targetName) != null;
    }
    find(...targetNames) {
      return targetNames.reduce((target, targetName) => target || this.findTarget(targetName) || this.findLegacyTarget(targetName), void 0);
    }
    findAll(...targetNames) {
      return targetNames.reduce((targets, targetName) => [
        ...targets,
        ...this.findAllTargets(targetName),
        ...this.findAllLegacyTargets(targetName)
      ], []);
    }
    findTarget(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findElement(selector);
    }
    findAllTargets(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findAllElements(selector);
    }
    getSelectorForTargetName(targetName) {
      const attributeName = this.schema.targetAttributeForScope(this.identifier);
      return attributeValueContainsToken(attributeName, targetName);
    }
    findLegacyTarget(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.deprecate(this.scope.findElement(selector), targetName);
    }
    findAllLegacyTargets(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.scope.findAllElements(selector).map((element) => this.deprecate(element, targetName));
    }
    getLegacySelectorForTargetName(targetName) {
      const targetDescriptor = `${this.identifier}.${targetName}`;
      return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
    }
    deprecate(element, targetName) {
      if (element) {
        const { identifier } = this;
        const attributeName = this.schema.targetAttribute;
        const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
        this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
      }
      return element;
    }
    get guide() {
      return this.scope.guide;
    }
  };
  var OutletSet = class {
    constructor(scope, controllerElement) {
      this.scope = scope;
      this.controllerElement = controllerElement;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(outletName) {
      return this.find(outletName) != null;
    }
    find(...outletNames) {
      return outletNames.reduce((outlet, outletName) => outlet || this.findOutlet(outletName), void 0);
    }
    findAll(...outletNames) {
      return outletNames.reduce((outlets, outletName) => [...outlets, ...this.findAllOutlets(outletName)], []);
    }
    getSelectorForOutletName(outletName) {
      const attributeName = this.schema.outletAttributeForScope(this.identifier, outletName);
      return this.controllerElement.getAttribute(attributeName);
    }
    findOutlet(outletName) {
      const selector = this.getSelectorForOutletName(outletName);
      if (selector)
        return this.findElement(selector, outletName);
    }
    findAllOutlets(outletName) {
      const selector = this.getSelectorForOutletName(outletName);
      return selector ? this.findAllElements(selector, outletName) : [];
    }
    findElement(selector, outletName) {
      const elements = this.scope.queryElements(selector);
      return elements.filter((element) => this.matchesElement(element, selector, outletName))[0];
    }
    findAllElements(selector, outletName) {
      const elements = this.scope.queryElements(selector);
      return elements.filter((element) => this.matchesElement(element, selector, outletName));
    }
    matchesElement(element, selector, outletName) {
      const controllerAttribute = element.getAttribute(this.scope.schema.controllerAttribute) || "";
      return element.matches(selector) && controllerAttribute.split(" ").includes(outletName);
    }
  };
  var Scope = class _Scope {
    constructor(schema, element, identifier, logger) {
      this.targets = new TargetSet(this);
      this.classes = new ClassMap(this);
      this.data = new DataMap(this);
      this.containsElement = (element2) => {
        return element2.closest(this.controllerSelector) === this.element;
      };
      this.schema = schema;
      this.element = element;
      this.identifier = identifier;
      this.guide = new Guide(logger);
      this.outlets = new OutletSet(this.documentScope, element);
    }
    findElement(selector) {
      return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
    }
    findAllElements(selector) {
      return [
        ...this.element.matches(selector) ? [this.element] : [],
        ...this.queryElements(selector).filter(this.containsElement)
      ];
    }
    queryElements(selector) {
      return Array.from(this.element.querySelectorAll(selector));
    }
    get controllerSelector() {
      return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
    }
    get isDocumentScope() {
      return this.element === document.documentElement;
    }
    get documentScope() {
      return this.isDocumentScope ? this : new _Scope(this.schema, document.documentElement, this.identifier, this.guide.logger);
    }
  };
  var ScopeObserver = class {
    constructor(element, schema, delegate) {
      this.element = element;
      this.schema = schema;
      this.delegate = delegate;
      this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
      this.scopesByIdentifierByElement = /* @__PURE__ */ new WeakMap();
      this.scopeReferenceCounts = /* @__PURE__ */ new WeakMap();
    }
    start() {
      this.valueListObserver.start();
    }
    stop() {
      this.valueListObserver.stop();
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    parseValueForToken(token) {
      const { element, content: identifier } = token;
      return this.parseValueForElementAndIdentifier(element, identifier);
    }
    parseValueForElementAndIdentifier(element, identifier) {
      const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
      let scope = scopesByIdentifier.get(identifier);
      if (!scope) {
        scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
        scopesByIdentifier.set(identifier, scope);
      }
      return scope;
    }
    elementMatchedValue(element, value) {
      const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
      this.scopeReferenceCounts.set(value, referenceCount);
      if (referenceCount == 1) {
        this.delegate.scopeConnected(value);
      }
    }
    elementUnmatchedValue(element, value) {
      const referenceCount = this.scopeReferenceCounts.get(value);
      if (referenceCount) {
        this.scopeReferenceCounts.set(value, referenceCount - 1);
        if (referenceCount == 1) {
          this.delegate.scopeDisconnected(value);
        }
      }
    }
    fetchScopesByIdentifierForElement(element) {
      let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
      if (!scopesByIdentifier) {
        scopesByIdentifier = /* @__PURE__ */ new Map();
        this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
      }
      return scopesByIdentifier;
    }
  };
  var Router = class {
    constructor(application2) {
      this.application = application2;
      this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
      this.scopesByIdentifier = new Multimap();
      this.modulesByIdentifier = /* @__PURE__ */ new Map();
    }
    get element() {
      return this.application.element;
    }
    get schema() {
      return this.application.schema;
    }
    get logger() {
      return this.application.logger;
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    get modules() {
      return Array.from(this.modulesByIdentifier.values());
    }
    get contexts() {
      return this.modules.reduce((contexts, module) => contexts.concat(module.contexts), []);
    }
    start() {
      this.scopeObserver.start();
    }
    stop() {
      this.scopeObserver.stop();
    }
    loadDefinition(definition) {
      this.unloadIdentifier(definition.identifier);
      const module = new Module(this.application, definition);
      this.connectModule(module);
      const afterLoad = definition.controllerConstructor.afterLoad;
      if (afterLoad) {
        afterLoad.call(definition.controllerConstructor, definition.identifier, this.application);
      }
    }
    unloadIdentifier(identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        this.disconnectModule(module);
      }
    }
    getContextForElementAndIdentifier(element, identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        return module.contexts.find((context) => context.element == element);
      }
    }
    proposeToConnectScopeForElementAndIdentifier(element, identifier) {
      const scope = this.scopeObserver.parseValueForElementAndIdentifier(element, identifier);
      if (scope) {
        this.scopeObserver.elementMatchedValue(scope.element, scope);
      } else {
        console.error(`Couldn't find or create scope for identifier: "${identifier}" and element:`, element);
      }
    }
    handleError(error2, message, detail) {
      this.application.handleError(error2, message, detail);
    }
    createScopeForElementAndIdentifier(element, identifier) {
      return new Scope(this.schema, element, identifier, this.logger);
    }
    scopeConnected(scope) {
      this.scopesByIdentifier.add(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.connectContextForScope(scope);
      }
    }
    scopeDisconnected(scope) {
      this.scopesByIdentifier.delete(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.disconnectContextForScope(scope);
      }
    }
    connectModule(module) {
      this.modulesByIdentifier.set(module.identifier, module);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.connectContextForScope(scope));
    }
    disconnectModule(module) {
      this.modulesByIdentifier.delete(module.identifier);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.disconnectContextForScope(scope));
    }
  };
  var defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: (identifier) => `data-${identifier}-target`,
    outletAttributeForScope: (identifier, outlet) => `data-${identifier}-${outlet}-outlet`,
    keyMappings: Object.assign(Object.assign({ enter: "Enter", tab: "Tab", esc: "Escape", space: " ", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", home: "Home", end: "End", page_up: "PageUp", page_down: "PageDown" }, objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c) => [c, c]))), objectFromEntries("0123456789".split("").map((n) => [n, n])))
  };
  function objectFromEntries(array) {
    return array.reduce((memo, [k, v]) => Object.assign(Object.assign({}, memo), { [k]: v }), {});
  }
  var Application = class {
    constructor(element = document.documentElement, schema = defaultSchema) {
      this.logger = console;
      this.debug = false;
      this.logDebugActivity = (identifier, functionName, detail = {}) => {
        if (this.debug) {
          this.logFormattedMessage(identifier, functionName, detail);
        }
      };
      this.element = element;
      this.schema = schema;
      this.dispatcher = new Dispatcher(this);
      this.router = new Router(this);
      this.actionDescriptorFilters = Object.assign({}, defaultActionDescriptorFilters);
    }
    static start(element, schema) {
      const application2 = new this(element, schema);
      application2.start();
      return application2;
    }
    async start() {
      await domReady();
      this.logDebugActivity("application", "starting");
      this.dispatcher.start();
      this.router.start();
      this.logDebugActivity("application", "start");
    }
    stop() {
      this.logDebugActivity("application", "stopping");
      this.dispatcher.stop();
      this.router.stop();
      this.logDebugActivity("application", "stop");
    }
    register(identifier, controllerConstructor) {
      this.load({ identifier, controllerConstructor });
    }
    registerActionOption(name, filter) {
      this.actionDescriptorFilters[name] = filter;
    }
    load(head, ...rest) {
      const definitions = Array.isArray(head) ? head : [head, ...rest];
      definitions.forEach((definition) => {
        if (definition.controllerConstructor.shouldLoad) {
          this.router.loadDefinition(definition);
        }
      });
    }
    unload(head, ...rest) {
      const identifiers = Array.isArray(head) ? head : [head, ...rest];
      identifiers.forEach((identifier) => this.router.unloadIdentifier(identifier));
    }
    get controllers() {
      return this.router.contexts.map((context) => context.controller);
    }
    getControllerForElementAndIdentifier(element, identifier) {
      const context = this.router.getContextForElementAndIdentifier(element, identifier);
      return context ? context.controller : null;
    }
    handleError(error2, message, detail) {
      var _a;
      this.logger.error(`%s

%o

%o`, message, error2, detail);
      (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error2);
    }
    logFormattedMessage(identifier, functionName, detail = {}) {
      detail = Object.assign({ application: this }, detail);
      this.logger.groupCollapsed(`${identifier} #${functionName}`);
      this.logger.log("details:", Object.assign({}, detail));
      this.logger.groupEnd();
    }
  };
  function domReady() {
    return new Promise((resolve) => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve());
      } else {
        resolve();
      }
    });
  }
  function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
      return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
  }
  function propertiesForClassDefinition(key) {
    return {
      [`${key}Class`]: {
        get() {
          const { classes } = this;
          if (classes.has(key)) {
            return classes.get(key);
          } else {
            const attribute = classes.getAttributeName(key);
            throw new Error(`Missing attribute "${attribute}"`);
          }
        }
      },
      [`${key}Classes`]: {
        get() {
          return this.classes.getAll(key);
        }
      },
      [`has${capitalize(key)}Class`]: {
        get() {
          return this.classes.has(key);
        }
      }
    };
  }
  function OutletPropertiesBlessing(constructor) {
    const outlets = readInheritableStaticArrayValues(constructor, "outlets");
    return outlets.reduce((properties, outletDefinition) => {
      return Object.assign(properties, propertiesForOutletDefinition(outletDefinition));
    }, {});
  }
  function getOutletController(controller, element, identifier) {
    return controller.application.getControllerForElementAndIdentifier(element, identifier);
  }
  function getControllerAndEnsureConnectedScope(controller, element, outletName) {
    let outletController = getOutletController(controller, element, outletName);
    if (outletController)
      return outletController;
    controller.application.router.proposeToConnectScopeForElementAndIdentifier(element, outletName);
    outletController = getOutletController(controller, element, outletName);
    if (outletController)
      return outletController;
  }
  function propertiesForOutletDefinition(name) {
    const camelizedName = namespaceCamelize(name);
    return {
      [`${camelizedName}Outlet`]: {
        get() {
          const outletElement = this.outlets.find(name);
          const selector = this.outlets.getSelectorForOutletName(name);
          if (outletElement) {
            const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
            if (outletController)
              return outletController;
            throw new Error(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`);
          }
          throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
        }
      },
      [`${camelizedName}Outlets`]: {
        get() {
          const outlets = this.outlets.findAll(name);
          if (outlets.length > 0) {
            return outlets.map((outletElement) => {
              const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
              if (outletController)
                return outletController;
              console.warn(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`, outletElement);
            }).filter((controller) => controller);
          }
          return [];
        }
      },
      [`${camelizedName}OutletElement`]: {
        get() {
          const outletElement = this.outlets.find(name);
          const selector = this.outlets.getSelectorForOutletName(name);
          if (outletElement) {
            return outletElement;
          } else {
            throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
          }
        }
      },
      [`${camelizedName}OutletElements`]: {
        get() {
          return this.outlets.findAll(name);
        }
      },
      [`has${capitalize(camelizedName)}Outlet`]: {
        get() {
          return this.outlets.has(name);
        }
      }
    };
  }
  function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
      return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
  }
  function propertiesForTargetDefinition(name) {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name);
          if (target) {
            return target;
          } else {
            throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name);
        }
      },
      [`has${capitalize(name)}Target`]: {
        get() {
          return this.targets.has(name);
        }
      }
    };
  }
  function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
      valueDescriptorMap: {
        get() {
          return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
            const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
            const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
            return Object.assign(result, { [attributeName]: valueDescriptor });
          }, {});
        }
      }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
      return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
  }
  function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
    const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
    const { key, name, reader: read, writer: write } = definition;
    return {
      [name]: {
        get() {
          const value = this.data.get(key);
          if (value !== null) {
            return read(value);
          } else {
            return definition.defaultValue;
          }
        },
        set(value) {
          if (value === void 0) {
            this.data.delete(key);
          } else {
            this.data.set(key, write(value));
          }
        }
      },
      [`has${capitalize(name)}`]: {
        get() {
          return this.data.has(key) || definition.hasCustomDefaultValue;
        }
      }
    };
  }
  function parseValueDefinitionPair([token, typeDefinition], controller) {
    return valueDescriptorForTokenAndTypeDefinition({
      controller,
      token,
      typeDefinition
    });
  }
  function parseValueTypeConstant(constant) {
    switch (constant) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(defaultValue))
      return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
      return "object";
  }
  function parseValueTypeObject(payload) {
    const { controller, token, typeObject } = payload;
    const hasType = isSomething(typeObject.type);
    const hasDefault = isSomething(typeObject.default);
    const fullObject = hasType && hasDefault;
    const onlyType = hasType && !hasDefault;
    const onlyDefault = !hasType && hasDefault;
    const typeFromObject = parseValueTypeConstant(typeObject.type);
    const typeFromDefaultValue = parseValueTypeDefault(payload.typeObject.default);
    if (onlyType)
      return typeFromObject;
    if (onlyDefault)
      return typeFromDefaultValue;
    if (typeFromObject !== typeFromDefaultValue) {
      const propertyPath = controller ? `${controller}.${token}` : token;
      throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${typeObject.default}" is of type "${typeFromDefaultValue}".`);
    }
    if (fullObject)
      return typeFromObject;
  }
  function parseValueTypeDefinition(payload) {
    const { controller, token, typeDefinition } = payload;
    const typeObject = { controller, token, typeObject: typeDefinition };
    const typeFromObject = parseValueTypeObject(typeObject);
    const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
    const typeFromConstant = parseValueTypeConstant(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
      return type;
    const propertyPath = controller ? `${controller}.${typeDefinition}` : token;
    throw new Error(`Unknown value type "${propertyPath}" for "${token}" value`);
  }
  function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
      return defaultValuesByType[constant];
    const hasDefault = hasProperty(typeDefinition, "default");
    const hasType = hasProperty(typeDefinition, "type");
    const typeObject = typeDefinition;
    if (hasDefault)
      return typeObject.default;
    if (hasType) {
      const { type } = typeObject;
      const constantFromType = parseValueTypeConstant(type);
      if (constantFromType)
        return defaultValuesByType[constantFromType];
    }
    return typeDefinition;
  }
  function valueDescriptorForTokenAndTypeDefinition(payload) {
    const { token, typeDefinition } = payload;
    const key = `${dasherize(token)}-value`;
    const type = parseValueTypeDefinition(payload);
    return {
      type,
      key,
      name: camelize(key),
      get defaultValue() {
        return defaultValueForDefinition(typeDefinition);
      },
      get hasCustomDefaultValue() {
        return parseValueTypeDefault(typeDefinition) !== void 0;
      },
      reader: readers[type],
      writer: writers[type] || writers.default
    };
  }
  var defaultValuesByType = {
    get array() {
      return [];
    },
    boolean: false,
    number: 0,
    get object() {
      return {};
    },
    string: ""
  };
  var readers = {
    array(value) {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) {
        throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
      }
      return array;
    },
    boolean(value) {
      return !(value == "0" || String(value).toLowerCase() == "false");
    },
    number(value) {
      return Number(value.replace(/_/g, ""));
    },
    object(value) {
      const object = JSON.parse(value);
      if (object === null || typeof object != "object" || Array.isArray(object)) {
        throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
      }
      return object;
    },
    string(value) {
      return value;
    }
  };
  var writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
  };
  function writeJSON(value) {
    return JSON.stringify(value);
  }
  function writeString(value) {
    return `${value}`;
  }
  var Controller = class {
    constructor(context) {
      this.context = context;
    }
    static get shouldLoad() {
      return true;
    }
    static afterLoad(_identifier, _application) {
      return;
    }
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get outlets() {
      return this.scope.outlets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
      const type = prefix ? `${prefix}:${eventName}` : eventName;
      const event = new CustomEvent(type, { detail, bubbles, cancelable });
      target.dispatchEvent(event);
      return event;
    }
  };
  Controller.blessings = [
    ClassPropertiesBlessing,
    TargetPropertiesBlessing,
    ValuePropertiesBlessing,
    OutletPropertiesBlessing
  ];
  Controller.targets = [];
  Controller.outlets = [];
  Controller.values = {};

  // app/javascript/controllers/application.js
  var application = Application.start();
  application.debug = false;
  window.Stimulus = application;

  // app/javascript/controllers/shadcn/accordion_controller.js
  var accordion_controller_default = class extends Controller {
    static targets = ["item", "trigger", "content"];
    static values = {
      type: { type: String, default: "single" },
      collapsible: { type: Boolean, default: false }
    };
    connect() {
      this.itemTargets.forEach((item) => {
        const content = item.querySelector('[data-slot="accordion-content"]');
        if (content && item.dataset.state !== "open") {
          content.hidden = true;
          content.dataset.state = "closed";
        } else if (content && item.dataset.state === "open") {
          content.hidden = false;
          content.dataset.state = "open";
        }
      });
    }
    toggle(event) {
      const trigger = event.currentTarget;
      const item = trigger.closest('[data-slot="accordion-item"]');
      if (!item) return;
      const isOpen = item.dataset.state === "open";
      if (this.typeValue === "single") {
        this.itemTargets.forEach((otherItem) => {
          if (otherItem !== item && otherItem.dataset.state === "open") {
            this._closeItem(otherItem);
          }
        });
      }
      if (isOpen && (this.collapsibleValue || this.typeValue === "multiple")) {
        this._closeItem(item);
      } else if (!isOpen) {
        this._openItem(item);
      }
    }
    keydown(event) {
      const triggers = this.triggerTargets;
      const index = triggers.indexOf(event.currentTarget);
      let nextIndex;
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          nextIndex = (index + 1) % triggers.length;
          triggers[nextIndex].focus();
          break;
        case "ArrowUp":
          event.preventDefault();
          nextIndex = (index - 1 + triggers.length) % triggers.length;
          triggers[nextIndex].focus();
          break;
        case "Home":
          event.preventDefault();
          triggers[0].focus();
          break;
        case "End":
          event.preventDefault();
          triggers[triggers.length - 1].focus();
          break;
      }
    }
    _openItem(item) {
      const content = item.querySelector('[data-slot="accordion-content"]');
      const trigger = item.querySelector('[data-slot="accordion-trigger"]');
      if (!content) return;
      item.dataset.state = "open";
      if (trigger) {
        trigger.dataset.state = "open";
        trigger.setAttribute("aria-expanded", "true");
      }
      content.dataset.state = "open";
      content.hidden = false;
      const height = content.scrollHeight;
      content.style.height = "0px";
      content.style.overflow = "hidden";
      requestAnimationFrame(() => {
        content.style.transition = "height 200ms ease-out";
        content.style.height = `${height}px`;
        const onEnd = () => {
          content.style.height = "";
          content.style.overflow = "";
          content.style.transition = "";
          content.removeEventListener("transitionend", onEnd);
        };
        content.addEventListener("transitionend", onEnd);
      });
    }
    _closeItem(item) {
      const content = item.querySelector('[data-slot="accordion-content"]');
      const trigger = item.querySelector('[data-slot="accordion-trigger"]');
      if (!content) return;
      const height = content.scrollHeight;
      content.style.height = `${height}px`;
      content.style.overflow = "hidden";
      requestAnimationFrame(() => {
        content.style.transition = "height 200ms ease-out";
        content.style.height = "0px";
        const onEnd = () => {
          content.hidden = true;
          content.style.height = "";
          content.style.overflow = "";
          content.style.transition = "";
          item.dataset.state = "closed";
          if (trigger) {
            trigger.dataset.state = "closed";
            trigger.setAttribute("aria-expanded", "false");
          }
          content.dataset.state = "closed";
          content.removeEventListener("transitionend", onEnd);
        };
        content.addEventListener("transitionend", onEnd);
      });
    }
  };

  // app/javascript/controllers/shadcn/dark_mode_controller.js
  var dark_mode_controller_default = class extends Controller {
    static values = {
      mode: { type: String, default: "system" }
    };
    connect() {
      const stored = localStorage.getItem("theme");
      if (stored && ["light", "dark", "system"].includes(stored)) {
        this.modeValue = stored;
      }
      this._mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      this._onMediaChange = this._handleMediaChange.bind(this);
      this._mediaQuery.addEventListener("change", this._onMediaChange);
      this._apply();
    }
    disconnect() {
      if (this._mediaQuery) {
        this._mediaQuery.removeEventListener("change", this._onMediaChange);
      }
    }
    modeValueChanged() {
      this._apply();
    }
    // ── Actions ──────────────────────────────────────────────
    toggle() {
      const cycle = { light: "dark", dark: "system", system: "light" };
      this.modeValue = cycle[this.modeValue] || "system";
    }
    setLight() {
      this.modeValue = "light";
    }
    setDark() {
      this.modeValue = "dark";
    }
    setSystem() {
      this.modeValue = "system";
    }
    // ── Private ──────────────────────────────────────────────
    _apply() {
      const isDark = this._shouldBeDark();
      document.documentElement.classList.toggle("dark", isDark);
      localStorage.setItem("theme", this.modeValue);
      document.dispatchEvent(
        new CustomEvent("theme:change", {
          detail: { mode: this.modeValue, dark: isDark }
        })
      );
    }
    _shouldBeDark() {
      if (this.modeValue === "dark") return true;
      if (this.modeValue === "light") return false;
      return this._mediaQuery?.matches ?? false;
    }
    _handleMediaChange() {
      if (this.modeValue === "system") {
        this._apply();
      }
    }
  };

  // app/javascript/controllers/shadcn/checkbox_controller.js
  var checkbox_controller_default = class extends Controller {
    static targets = ["button", "indicator", "input"];
    static values = {
      checked: { type: String, default: "false" },
      // "true", "false", "indeterminate"
      disabled: { type: Boolean, default: false },
      name: String
    };
    connect() {
      this._syncState();
    }
    toggle() {
      if (this.disabledValue) return;
      if (this.checkedValue === "true") {
        this.checkedValue = "false";
      } else {
        this.checkedValue = "true";
      }
      this.dispatch("change", { detail: { checked: this.checkedValue === "true" } });
    }
    checkedValueChanged() {
      this._syncState();
    }
    _syncState() {
      const isChecked = this.checkedValue === "true";
      const isIndeterminate = this.checkedValue === "indeterminate";
      const state = isIndeterminate ? "indeterminate" : isChecked ? "checked" : "unchecked";
      this.buttonTargets.forEach((btn) => {
        btn.dataset.state = state;
        btn.setAttribute("aria-checked", isIndeterminate ? "mixed" : String(isChecked));
        btn.setAttribute("data-disabled", String(this.disabledValue));
      });
      this.indicatorTargets.forEach((ind) => {
        ind.hidden = !isChecked && !isIndeterminate;
      });
      this.inputTargets.forEach((input) => {
        input.value = isChecked ? "1" : "0";
        input.checked = isChecked;
      });
    }
  };

  // app/javascript/controllers/shadcn/collapsible_controller.js
  var collapsible_controller_default = class extends Controller {
    static targets = ["trigger", "content"];
    static values = {
      open: { type: Boolean, default: false }
    };
    connect() {
      this._syncState();
    }
    toggle() {
      this.openValue = !this.openValue;
    }
    open() {
      this.openValue = true;
    }
    close() {
      this.openValue = false;
    }
    openValueChanged() {
      this._syncState();
    }
    _syncState() {
      const state = this.openValue ? "open" : "closed";
      this.element.dataset.state = state;
      this.triggerTargets.forEach((trigger) => {
        trigger.dataset.state = state;
        trigger.setAttribute("aria-expanded", String(this.openValue));
      });
      this.contentTargets.forEach((content) => {
        if (this.openValue) {
          this._animateOpen(content);
        } else {
          this._animateClose(content);
        }
      });
    }
    _animateOpen(content) {
      content.hidden = false;
      content.dataset.state = "open";
      const height = content.scrollHeight;
      content.style.height = "0px";
      content.style.overflow = "hidden";
      requestAnimationFrame(() => {
        content.style.transition = "height 200ms ease-out";
        content.style.height = `${height}px`;
        const onEnd = () => {
          content.style.height = "";
          content.style.overflow = "";
          content.style.transition = "";
          content.removeEventListener("transitionend", onEnd);
        };
        content.addEventListener("transitionend", onEnd);
      });
    }
    _animateClose(content) {
      const height = content.scrollHeight;
      content.dataset.state = "closed";
      content.style.height = `${height}px`;
      content.style.overflow = "hidden";
      requestAnimationFrame(() => {
        content.style.transition = "height 200ms ease-out";
        content.style.height = "0px";
        const onEnd = () => {
          content.hidden = true;
          content.style.height = "";
          content.style.overflow = "";
          content.style.transition = "";
          content.removeEventListener("transitionend", onEnd);
        };
        content.addEventListener("transitionend", onEnd);
      });
    }
  };

  // app/javascript/controllers/shadcn/combobox_controller.js
  var combobox_controller_default = class extends Controller {
    static targets = ["input", "content", "item", "empty", "hiddenInput", "value"];
    static values = {
      open: { type: Boolean, default: false },
      value: { type: String, default: "" },
      placeholder: { type: String, default: "Search..." },
      emptyText: { type: String, default: "No results found." }
    };
    connect() {
      this._onClickOutside = this._handleClickOutside.bind(this);
      this._hideTimeouts = [];
      this._allItems = this.itemTargets.map((el) => ({
        element: el,
        value: el.dataset.value || "",
        label: el.textContent.trim().toLowerCase()
      }));
      this._syncState();
    }
    disconnect() {
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
      document.removeEventListener("click", this._onClickOutside, true);
    }
    toggle() {
      this.openValue = !this.openValue;
    }
    show() {
      this.openValue = true;
    }
    hide() {
      this.openValue = false;
    }
    filter(event) {
      const query = event.currentTarget.value.toLowerCase();
      let visibleCount = 0;
      this._allItems.forEach(({ element, label }) => {
        const match = label.includes(query);
        element.hidden = !match;
        if (match) visibleCount++;
      });
      this.emptyTargets.forEach((el) => {
        el.hidden = visibleCount > 0;
      });
    }
    selectItem(event) {
      const item = event.currentTarget;
      if (item.dataset.disabled) return;
      const value = item.dataset.value;
      const label = item.textContent.trim();
      this.valueValue = value;
      this.valueTargets.forEach((el) => {
        el.textContent = label;
      });
      this.inputTargets.forEach((el) => {
        el.value = "";
      });
      this.dispatch("change", { detail: { value, label } });
      this.hide();
    }
    keydown(event) {
      if (!this.openValue && (event.key === "ArrowDown" || event.key === "Enter")) {
        event.preventDefault();
        this.show();
        return;
      }
      if (event.key === "Escape") {
        this.hide();
        return;
      }
      const items = this._getVisibleItems();
      const current = items.indexOf(document.activeElement);
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (current < items.length - 1) items[current + 1]?.focus();
          else if (current === -1 && items.length > 0) items[0].focus();
          break;
        case "ArrowUp":
          event.preventDefault();
          if (current > 0) items[current - 1]?.focus();
          else if (this.hasInputTarget) this.inputTarget.focus();
          break;
        case "Enter":
          if (document.activeElement?.matches('[data-slot*="item"]')) {
            event.preventDefault();
            document.activeElement.click();
          }
          break;
      }
    }
    openValueChanged() {
      this._syncOpenState();
    }
    valueValueChanged() {
      this._syncValueState();
    }
    _syncState() {
      this._syncOpenState();
      this._syncValueState();
    }
    _syncOpenState() {
      if (!this._hideTimeouts) return;
      this.contentTargets.forEach((el) => {
        el.dataset.state = this.openValue ? "open" : "closed";
        if (this.openValue) {
          el.hidden = false;
          this._position(el);
          requestAnimationFrame(() => {
            if (this.hasInputTarget) this.inputTarget.focus();
          });
        } else {
          this._hideTimeouts.push(setTimeout(() => {
            if (el.dataset.state === "closed") el.hidden = true;
          }, 200));
          this._allItems.forEach(({ element }) => {
            element.hidden = false;
          });
          this.emptyTargets.forEach((el2) => {
            el2.hidden = true;
          });
        }
      });
      if (this.openValue) {
        requestAnimationFrame(() => document.addEventListener("click", this._onClickOutside, true));
      } else {
        document.removeEventListener("click", this._onClickOutside, true);
      }
    }
    _syncValueState() {
      this.itemTargets.forEach((item) => {
        const isSelected = item.dataset.value === this.valueValue;
        item.dataset.state = isSelected ? "checked" : "unchecked";
        item.setAttribute("aria-selected", String(isSelected));
      });
      this.hiddenInputTargets.forEach((input) => {
        input.value = this.valueValue;
      });
    }
    _position(content) {
      const anchor = this.element;
      const rect = anchor.getBoundingClientRect();
      content.style.position = "fixed";
      content.style.zIndex = "50";
      content.style.width = `${rect.width}px`;
      content.style.top = `${rect.bottom + 4}px`;
      content.style.left = `${rect.left}px`;
    }
    _getVisibleItems() {
      return this.itemTargets.filter((el) => !el.hidden && !el.dataset.disabled);
    }
    _handleClickOutside(event) {
      if (!this.element.contains(event.target)) this.hide();
    }
  };

  // app/javascript/controllers/shadcn/command_controller.js
  var command_controller_default = class extends Controller {
    static targets = ["dialog", "overlay", "input", "list", "group", "item", "empty"];
    static values = {
      open: { type: Boolean, default: false },
      shortcut: { type: String, default: "k" }
    };
    connect() {
      this._onGlobalKeydown = this._handleGlobalKeydown.bind(this);
      this._onKeydown = this._handleKeydown.bind(this);
      this._allItems = this.itemTargets.map((el) => ({
        element: el,
        label: el.textContent.trim().toLowerCase(),
        value: el.dataset.value || "",
        group: el.closest('[data-slot="command-group"]')
      }));
      this._hideTimeouts = [];
      document.addEventListener("keydown", this._onGlobalKeydown);
      this._syncState();
    }
    disconnect() {
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
      document.removeEventListener("keydown", this._onGlobalKeydown);
      document.removeEventListener("keydown", this._onKeydown);
    }
    toggle() {
      this.openValue = !this.openValue;
    }
    show() {
      this.openValue = true;
    }
    hide() {
      this.openValue = false;
    }
    filter(event) {
      const query = event.currentTarget.value.toLowerCase();
      let totalVisible = 0;
      const groupCounts = /* @__PURE__ */ new Map();
      this._allItems.forEach(({ element, label, group }) => {
        const match = !query || label.includes(query);
        element.hidden = !match;
        if (match) {
          totalVisible++;
          if (group) {
            groupCounts.set(group, (groupCounts.get(group) || 0) + 1);
          }
        }
      });
      this.groupTargets.forEach((group) => {
        group.hidden = (groupCounts.get(group) || 0) === 0;
      });
      this.emptyTargets.forEach((el) => {
        el.hidden = totalVisible > 0;
      });
    }
    selectItem(event) {
      const item = event.currentTarget;
      if (item.dataset.disabled) return;
      this.dispatch("select", { detail: { value: item.dataset.value } });
      const callback = item.dataset.commandCallback;
      if (callback && window[callback]) {
        window[callback]();
      }
      this.hide();
    }
    clickOverlay(event) {
      if (event.target === event.currentTarget) this.hide();
    }
    openValueChanged() {
      this._syncState();
    }
    _syncState() {
      if (!this._hideTimeouts) return;
      if (this.openValue) {
        this._open();
      } else {
        this._close();
      }
    }
    _open() {
      this.dialogTargets.forEach((el) => {
        el.dataset.state = "open";
        el.hidden = false;
      });
      this.overlayTargets.forEach((el) => {
        el.dataset.state = "open";
        el.hidden = false;
      });
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", this._onKeydown);
      requestAnimationFrame(() => {
        if (this.hasInputTarget) {
          this.inputTarget.value = "";
          this.inputTarget.focus();
        }
        this._allItems.forEach(({ element }) => {
          element.hidden = false;
        });
        this.groupTargets.forEach((g) => {
          g.hidden = false;
        });
        this.emptyTargets.forEach((el) => {
          el.hidden = true;
        });
      });
    }
    _close() {
      this.dialogTargets.forEach((el) => {
        el.dataset.state = "closed";
        this._hideTimeouts.push(setTimeout(() => {
          if (el.dataset.state === "closed") el.hidden = true;
        }, 200));
      });
      this.overlayTargets.forEach((el) => {
        el.dataset.state = "closed";
        this._hideTimeouts.push(setTimeout(() => {
          if (el.dataset.state === "closed") el.hidden = true;
        }, 200));
      });
      document.body.style.overflow = "";
      document.removeEventListener("keydown", this._onKeydown);
    }
    _handleGlobalKeydown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key === this.shortcutValue) {
        event.preventDefault();
        this.toggle();
      }
    }
    _handleKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        this.hide();
        return;
      }
      const items = this._getVisibleItems();
      const current = items.indexOf(document.activeElement);
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (current < items.length - 1) items[current + 1].focus();
          else if (items.length > 0) items[0].focus();
          break;
        case "ArrowUp":
          event.preventDefault();
          if (current > 0) items[current - 1].focus();
          else if (this.hasInputTarget) this.inputTarget.focus();
          break;
        case "Enter":
          if (document.activeElement?.dataset.slot === "command-item") {
            event.preventDefault();
            document.activeElement.click();
          }
          break;
      }
    }
    _getVisibleItems() {
      return this.itemTargets.filter((el) => !el.hidden && !el.dataset.disabled);
    }
  };

  // app/javascript/controllers/shadcn/context_menu_controller.js
  var context_menu_controller_default = class extends Controller {
    static targets = ["trigger", "content", "item"];
    static values = {
      open: { type: Boolean, default: false }
    };
    connect() {
      this._onClickOutside = this._handleClickOutside.bind(this);
      this._onKeydown = this._handleKeydown.bind(this);
      this._onContextMenu = this._handleContextMenu.bind(this);
      this._hideTimeouts = [];
      this.triggerTargets.forEach((el) => {
        el.addEventListener("contextmenu", this._onContextMenu);
      });
      this._syncState();
    }
    disconnect() {
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
      this._removeListeners();
      this.triggerTargets.forEach((el) => {
        el.removeEventListener("contextmenu", this._onContextMenu);
      });
    }
    hide() {
      this.openValue = false;
    }
    openValueChanged() {
      this._syncState();
    }
    selectItem(event) {
      const item = event.currentTarget;
      if (item.dataset.disabled) return;
      this.dispatch("select", { detail: { value: item.dataset.value } });
      this.hide();
    }
    _handleContextMenu(event) {
      event.preventDefault();
      this._mouseX = event.clientX;
      this._mouseY = event.clientY;
      this.openValue = true;
    }
    _syncState() {
      if (!this._hideTimeouts) return;
      const state = this.openValue ? "open" : "closed";
      this.contentTargets.forEach((el) => {
        el.dataset.state = state;
        if (this.openValue) {
          el.hidden = false;
          this._positionAt(el, this._mouseX || 0, this._mouseY || 0);
          requestAnimationFrame(() => {
            const firstItem = el.querySelector('[data-slot*="menu-item"]:not([data-disabled])');
            firstItem?.focus();
          });
        } else {
          this._hideTimeouts.push(setTimeout(() => {
            if (el.dataset.state === "closed") el.hidden = true;
          }, 200));
        }
      });
      if (this.openValue) {
        document.addEventListener("click", this._onClickOutside, true);
        document.addEventListener("keydown", this._onKeydown);
      } else {
        this._removeListeners();
      }
    }
    _positionAt(content, x, y) {
      content.style.position = "fixed";
      content.style.zIndex = "50";
      content.style.top = `${y}px`;
      content.style.left = `${x}px`;
      requestAnimationFrame(() => {
        const rect = content.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          content.style.left = `${x - rect.width}px`;
        }
        if (rect.bottom > window.innerHeight) {
          content.style.top = `${y - rect.height}px`;
        }
      });
    }
    _handleClickOutside(event) {
      if (!this.contentTargets.some((el) => el.contains(event.target))) {
        this.hide();
      }
    }
    _handleKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        this.hide();
        return;
      }
      const items = this._getItems();
      const current = items.indexOf(document.activeElement);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        items[(current + 1) % items.length]?.focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        items[(current - 1 + items.length) % items.length]?.focus();
      } else if (event.key === "Enter" || event.key === " ") {
        if (document.activeElement?.matches('[data-slot*="menu-item"]')) {
          event.preventDefault();
          document.activeElement.click();
        }
      }
    }
    _getItems() {
      if (!this.hasContentTarget) return [];
      return Array.from(this.contentTarget.querySelectorAll(
        '[data-slot*="menu-item"]:not([data-disabled])'
      )).filter((el) => !el.closest("[hidden]"));
    }
    _removeListeners() {
      document.removeEventListener("click", this._onClickOutside, true);
      document.removeEventListener("keydown", this._onKeydown);
    }
  };

  // app/javascript/controllers/shadcn/dialog_controller.js
  var dialog_controller_default = class extends Controller {
    static targets = ["trigger", "overlay", "content", "close", "title", "description"];
    static values = {
      open: { type: Boolean, default: false },
      modal: { type: Boolean, default: true },
      closeOnOverlay: { type: Boolean, default: true },
      closeOnEscape: { type: Boolean, default: true }
    };
    connect() {
      this._onKeydown = this._handleKeydown.bind(this);
      this._previouslyFocused = null;
      this._hideTimeouts = [];
      this._syncState();
    }
    disconnect() {
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
      this._removeListeners();
      this._unlockScroll();
    }
    toggle() {
      this.openValue = !this.openValue;
    }
    show() {
      this.openValue = true;
    }
    hide() {
      this.openValue = false;
    }
    openValueChanged() {
      this._syncState();
    }
    clickOverlay(event) {
      if (this.closeOnOverlayValue && event.target === event.currentTarget) {
        this.hide();
      }
    }
    _syncState() {
      if (!this._hideTimeouts) return;
      if (this.openValue) {
        this._open();
      } else {
        this._close();
      }
    }
    _open() {
      this._previouslyFocused = document.activeElement;
      this.element.dataset.state = "open";
      this.overlayTargets.forEach((el) => {
        el.dataset.state = "open";
        el.hidden = false;
      });
      this.contentTargets.forEach((el) => {
        el.dataset.state = "open";
        el.hidden = false;
        el.setAttribute("role", "dialog");
        el.setAttribute("aria-modal", String(this.modalValue));
        if (this.hasTitleTarget) {
          const titleId = this._ensureId(this.titleTarget, "dialog-title");
          el.setAttribute("aria-labelledby", titleId);
        }
        if (this.hasDescriptionTarget) {
          const descId = this._ensureId(this.descriptionTarget, "dialog-desc");
          el.setAttribute("aria-describedby", descId);
        }
      });
      if (this.modalValue) {
        this._lockScroll();
      }
      document.addEventListener("keydown", this._onKeydown);
      requestAnimationFrame(() => {
        if (this.hasContentTarget) {
          const focusable = this._getFocusableElements(this.contentTarget);
          if (focusable.length > 0) {
            focusable[0].focus();
          }
        }
      });
    }
    _close() {
      this.element.dataset.state = "closed";
      this.overlayTargets.forEach((el) => {
        el.dataset.state = "closed";
        this._hideAfterAnimation(el);
      });
      this.contentTargets.forEach((el) => {
        el.dataset.state = "closed";
        this._hideAfterAnimation(el);
      });
      this._removeListeners();
      this._unlockScroll();
      if (this._previouslyFocused && this._previouslyFocused.focus) {
        this._previouslyFocused.focus();
        this._previouslyFocused = null;
      }
    }
    _handleKeydown(event) {
      if (event.key === "Escape" && this.closeOnEscapeValue) {
        event.preventDefault();
        event.stopPropagation();
        this.hide();
        return;
      }
      if (event.key === "Tab" && this.modalValue && this.hasContentTarget) {
        const focusable = this._getFocusableElements(this.contentTarget);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    }
    _getFocusableElements(container) {
      const selector = [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
        "[contenteditable]"
      ].join(", ");
      return Array.from(container.querySelectorAll(selector)).filter(
        (el) => !el.closest("[hidden]") && el.offsetParent !== null
      );
    }
    _lockScroll() {
      this._scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${this._scrollbarWidth}px`;
    }
    _unlockScroll() {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    _removeListeners() {
      document.removeEventListener("keydown", this._onKeydown);
    }
    _hideAfterAnimation(el) {
      const onAnimEnd = () => {
        if (el.dataset.state === "closed") {
          el.hidden = true;
        }
        el.removeEventListener("animationend", onAnimEnd);
      };
      el.addEventListener("animationend", onAnimEnd);
      this._hideTimeouts.push(setTimeout(() => {
        if (el.dataset.state === "closed") {
          el.hidden = true;
        }
      }, 300));
    }
    _ensureId(el, prefix) {
      if (!el.id) {
        el.id = `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
      }
      return el.id;
    }
  };

  // app/javascript/controllers/shadcn/drawer_controller.js
  var drawer_controller_default = class extends Controller {
    static targets = ["trigger", "overlay", "content", "close", "handle"];
    static values = {
      open: { type: Boolean, default: false },
      direction: { type: String, default: "bottom" },
      closeOnOverlay: { type: Boolean, default: true },
      closeThreshold: { type: Number, default: 0.25 }
    };
    connect() {
      this._onKeydown = this._handleKeydown.bind(this);
      this._onPointerDown = this._handlePointerDown.bind(this);
      this._onPointerMove = this._handlePointerMove.bind(this);
      this._onPointerUp = this._handlePointerUp.bind(this);
      this._dragging = false;
      this._startY = 0;
      this._startX = 0;
      this._currentTranslate = 0;
      this._hideTimeouts = [];
      this._syncState();
    }
    disconnect() {
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
      document.removeEventListener("keydown", this._onKeydown);
      this._unlockScroll();
      this._removeDragListeners();
    }
    toggle() {
      this.openValue = !this.openValue;
    }
    show() {
      this.openValue = true;
    }
    hide() {
      this.openValue = false;
    }
    openValueChanged() {
      this._syncState();
    }
    clickOverlay(event) {
      if (this.closeOnOverlayValue && event.target === event.currentTarget) this.hide();
    }
    _syncState() {
      if (!this._hideTimeouts) return;
      const state = this.openValue ? "open" : "closed";
      this.element.dataset.state = state;
      this.overlayTargets.forEach((el) => {
        el.dataset.state = state;
        if (this.openValue) el.hidden = false;
        else this._hideAfterAnimation(el);
      });
      this.contentTargets.forEach((el) => {
        el.dataset.state = state;
        el.style.transform = "";
        if (this.openValue) {
          el.hidden = false;
          this._addDragListeners(el);
        } else {
          this._hideAfterAnimation(el);
          this._removeDragListeners();
        }
      });
      if (this.openValue) {
        this._lockScroll();
        document.addEventListener("keydown", this._onKeydown);
      } else {
        this._unlockScroll();
        document.removeEventListener("keydown", this._onKeydown);
      }
    }
    _addDragListeners(el) {
      el.addEventListener("pointerdown", this._onPointerDown);
    }
    _removeDragListeners() {
      document.removeEventListener("pointermove", this._onPointerMove);
      document.removeEventListener("pointerup", this._onPointerUp);
    }
    _handlePointerDown(event) {
      const handle = event.target.closest('[data-slot="drawer-handle"], [class*="bg-muted"]');
      if (!handle && this.directionValue === "bottom") return;
      this._dragging = true;
      this._startY = event.clientY;
      this._startX = event.clientX;
      this._currentTranslate = 0;
      document.addEventListener("pointermove", this._onPointerMove);
      document.addEventListener("pointerup", this._onPointerUp);
    }
    _handlePointerMove(event) {
      if (!this._dragging || !this.hasContentTarget) return;
      const content = this.contentTarget;
      const dir = this.directionValue;
      let delta;
      if (dir === "bottom") {
        delta = Math.max(0, event.clientY - this._startY);
        content.style.transform = `translateY(${delta}px)`;
      } else if (dir === "top") {
        delta = Math.max(0, this._startY - event.clientY);
        content.style.transform = `translateY(-${delta}px)`;
      } else if (dir === "right") {
        delta = Math.max(0, event.clientX - this._startX);
        content.style.transform = `translateX(${delta}px)`;
      } else if (dir === "left") {
        delta = Math.max(0, this._startX - event.clientX);
        content.style.transform = `translateX(-${delta}px)`;
      }
      this._currentTranslate = delta || 0;
    }
    _handlePointerUp() {
      this._dragging = false;
      this._removeDragListeners();
      if (!this.hasContentTarget) return;
      const content = this.contentTarget;
      const size = this.directionValue === "left" || this.directionValue === "right" ? content.offsetWidth : content.offsetHeight;
      if (this._currentTranslate / size > this.closeThresholdValue) {
        this.hide();
      } else {
        content.style.transition = "transform 300ms ease";
        content.style.transform = "";
        const onEnd = () => {
          content.style.transition = "";
          content.removeEventListener("transitionend", onEnd);
        };
        content.addEventListener("transitionend", onEnd);
      }
    }
    _handleKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        this.hide();
      }
    }
    _lockScroll() {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    }
    _unlockScroll() {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    _hideAfterAnimation(el) {
      this._hideTimeouts.push(setTimeout(() => {
        if (el.dataset.state === "closed") el.hidden = true;
      }, 500));
    }
  };

  // app/javascript/controllers/shadcn/dropdown_menu_controller.js
  var dropdown_menu_controller_default = class extends Controller {
    static targets = ["trigger", "content", "item", "sub", "subTrigger", "subContent"];
    static values = {
      open: { type: Boolean, default: false },
      closeOnSelect: { type: Boolean, default: true }
    };
    connect() {
      this._onClickOutside = this._handleClickOutside.bind(this);
      this._onKeydown = this._handleKeydown.bind(this);
      this._hideTimeouts = [];
      this._syncState();
    }
    disconnect() {
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
      this._removeListeners();
    }
    toggle(event) {
      event?.preventDefault();
      this.openValue = !this.openValue;
    }
    show() {
      this.openValue = true;
    }
    hide() {
      this.openValue = false;
    }
    openValueChanged() {
      this._syncState();
    }
    selectItem(event) {
      const item = event.currentTarget;
      if (item.dataset.disabled) return;
      this.dispatch("select", { detail: { value: item.dataset.value } });
      if (this.closeOnSelectValue) {
        this.hide();
      }
    }
    _syncState() {
      if (!this._hideTimeouts) return;
      const state = this.openValue ? "open" : "closed";
      this.element.dataset.state = state;
      this.triggerTargets.forEach((el) => {
        el.dataset.state = state;
        el.setAttribute("aria-expanded", String(this.openValue));
        el.setAttribute("aria-haspopup", "menu");
      });
      this.contentTargets.forEach((el) => {
        el.dataset.state = state;
        if (this.openValue) {
          el.hidden = false;
          this._positionContent(el);
          requestAnimationFrame(() => {
            const firstItem = el.querySelector('[data-slot*="menu-item"]:not([data-disabled])');
            if (firstItem) firstItem.focus();
          });
        } else {
          this._hideAfterAnimation(el);
        }
      });
      if (this.openValue) {
        document.addEventListener("click", this._onClickOutside, true);
        document.addEventListener("keydown", this._onKeydown);
      } else {
        this._removeListeners();
      }
    }
    _positionContent(content) {
      if (!this.hasTriggerTarget) return;
      const trigger = this.triggerTarget;
      const rect = trigger.getBoundingClientRect();
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      content.style.position = "fixed";
      content.style.zIndex = "50";
      let top = rect.bottom + 4;
      let left = rect.left;
      const contentRect = content.getBoundingClientRect();
      if (top + contentRect.height > viewport.height) {
        top = rect.top - contentRect.height - 4;
        content.dataset.side = "top";
      } else {
        content.dataset.side = "bottom";
      }
      if (left + contentRect.width > viewport.width) {
        left = viewport.width - contentRect.width - 8;
      }
      if (left < 8) left = 8;
      content.style.top = `${top}px`;
      content.style.left = `${left}px`;
    }
    _handleClickOutside(event) {
      if (!this.element.contains(event.target)) {
        this.hide();
      }
    }
    _handleKeydown(event) {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          this.hide();
          if (this.hasTriggerTarget) this.triggerTarget.focus();
          break;
        case "ArrowDown": {
          event.preventDefault();
          const items = this._getMenuItems();
          const current = items.indexOf(document.activeElement);
          const next = current < items.length - 1 ? current + 1 : 0;
          items[next]?.focus();
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          const items = this._getMenuItems();
          const current = items.indexOf(document.activeElement);
          const prev = current > 0 ? current - 1 : items.length - 1;
          items[prev]?.focus();
          break;
        }
        case "Home":
          event.preventDefault();
          this._getMenuItems()[0]?.focus();
          break;
        case "End": {
          event.preventDefault();
          const items = this._getMenuItems();
          items[items.length - 1]?.focus();
          break;
        }
        case "Enter":
        case " ":
          if (document.activeElement?.matches('[data-slot*="menu-item"]')) {
            event.preventDefault();
            document.activeElement.click();
          }
          break;
        case "ArrowRight": {
          const subTrigger = document.activeElement?.closest('[data-slot*="sub-trigger"]');
          if (subTrigger) {
            event.preventDefault();
            const sub = subTrigger.closest('[data-slot*="sub"]');
            const subContent = sub?.querySelector('[data-slot*="sub-content"]');
            if (subContent) {
              subContent.hidden = false;
              subContent.dataset.state = "open";
              const firstItem = subContent.querySelector('[data-slot*="menu-item"]:not([data-disabled])');
              firstItem?.focus();
            }
          }
          break;
        }
        case "ArrowLeft": {
          const subContent = document.activeElement?.closest('[data-slot*="sub-content"]');
          if (subContent) {
            event.preventDefault();
            subContent.dataset.state = "closed";
            subContent.hidden = true;
            const subTrigger = subContent.previousElementSibling || subContent.closest('[data-slot*="sub"]')?.querySelector('[data-slot*="sub-trigger"]');
            subTrigger?.focus();
          }
          break;
        }
      }
    }
    _getMenuItems() {
      if (!this.hasContentTarget) return [];
      return Array.from(this.contentTarget.querySelectorAll(
        '[data-slot*="menu-item"]:not([data-disabled]), [data-slot*="checkbox-item"]:not([data-disabled]), [data-slot*="radio-item"]:not([data-disabled]), [data-slot*="sub-trigger"]:not([data-disabled])'
      )).filter((el) => !el.closest("[hidden]"));
    }
    _removeListeners() {
      document.removeEventListener("click", this._onClickOutside, true);
      document.removeEventListener("keydown", this._onKeydown);
    }
    _hideAfterAnimation(el) {
      this._hideTimeouts.push(setTimeout(() => {
        if (el.dataset.state === "closed") el.hidden = true;
      }, 200));
    }
  };

  // app/javascript/controllers/shadcn/hover_card_controller.js
  var hover_card_controller_default = class extends Controller {
    static targets = ["trigger", "content"];
    static values = {
      open: { type: Boolean, default: false },
      openDelay: { type: Number, default: 700 },
      closeDelay: { type: Number, default: 300 }
    };
    connect() {
      this._showTimeout = null;
      this._hideTimeout = null;
      this._hideTimeouts = [];
      this._syncState();
    }
    disconnect() {
      clearTimeout(this._showTimeout);
      clearTimeout(this._hideTimeout);
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
    }
    triggerEnter() {
      clearTimeout(this._hideTimeout);
      this._showTimeout = setTimeout(() => {
        this.openValue = true;
      }, this.openDelayValue);
    }
    triggerLeave() {
      clearTimeout(this._showTimeout);
      this._hideTimeout = setTimeout(() => {
        this.openValue = false;
      }, this.closeDelayValue);
    }
    contentEnter() {
      clearTimeout(this._hideTimeout);
    }
    contentLeave() {
      this._hideTimeout = setTimeout(() => {
        this.openValue = false;
      }, this.closeDelayValue);
    }
    openValueChanged() {
      this._syncState();
    }
    _syncState() {
      if (!this._hideTimeouts) return;
      const state = this.openValue ? "open" : "closed";
      this.contentTargets.forEach((el) => {
        el.dataset.state = state;
        if (this.openValue) {
          el.hidden = false;
          this._position(el);
        } else {
          this._hideTimeouts.push(setTimeout(() => {
            if (el.dataset.state === "closed") el.hidden = true;
          }, 200));
        }
      });
    }
    _position(content) {
      if (!this.hasTriggerTarget) return;
      const rect = this.triggerTarget.getBoundingClientRect();
      content.style.position = "fixed";
      content.style.zIndex = "50";
      const contentRect = content.getBoundingClientRect();
      let top = rect.bottom + 4;
      let left = rect.left + (rect.width - contentRect.width) / 2;
      if (top + contentRect.height > window.innerHeight) {
        top = rect.top - contentRect.height - 4;
        content.dataset.side = "top";
      } else {
        content.dataset.side = "bottom";
      }
      left = Math.max(8, Math.min(left, window.innerWidth - contentRect.width - 8));
      content.style.top = `${top}px`;
      content.style.left = `${left}px`;
    }
  };

  // app/javascript/controllers/shadcn/menubar_controller.js
  var menubar_controller_default = class extends Controller {
    static targets = ["menu", "trigger", "content", "item"];
    static values = {
      activeMenu: { type: String, default: "" }
    };
    connect() {
      this._onClickOutside = this._handleClickOutside.bind(this);
      this._onKeydown = this._handleKeydown.bind(this);
      this._hideTimeouts = [];
    }
    disconnect() {
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
      this._removeListeners();
    }
    toggleMenu(event) {
      const trigger = event.currentTarget;
      const value = trigger.dataset.value;
      if (this.activeMenuValue === value) {
        this.activeMenuValue = "";
      } else {
        this.activeMenuValue = value;
      }
    }
    enterTrigger(event) {
      if (this.activeMenuValue) {
        const value = event.currentTarget.dataset.value;
        if (value !== this.activeMenuValue) {
          this.activeMenuValue = value;
        }
      }
    }
    selectItem(event) {
      const item = event.currentTarget;
      if (item.dataset.disabled) return;
      this.dispatch("select", { detail: { value: item.dataset.value } });
      this.activeMenuValue = "";
    }
    activeMenuValueChanged() {
      this._syncState();
      if (this.activeMenuValue) {
        document.addEventListener("click", this._onClickOutside, true);
        document.addEventListener("keydown", this._onKeydown);
      } else {
        this._removeListeners();
      }
    }
    _syncState() {
      if (!this._hideTimeouts) return;
      this.triggerTargets.forEach((trigger) => {
        const isActive = trigger.dataset.value === this.activeMenuValue;
        trigger.dataset.state = isActive ? "open" : "closed";
        trigger.setAttribute("aria-expanded", String(isActive));
      });
      this.contentTargets.forEach((content) => {
        const isActive = content.dataset.value === this.activeMenuValue;
        content.dataset.state = isActive ? "open" : "closed";
        if (isActive) {
          content.hidden = false;
          this._positionContent(content);
          requestAnimationFrame(() => {
            const firstItem = content.querySelector('[data-slot*="menubar-item"]:not([data-disabled])');
            firstItem?.focus();
          });
        } else {
          this._hideTimeouts.push(setTimeout(() => {
            if (content.dataset.state === "closed") content.hidden = true;
          }, 200));
        }
      });
    }
    _positionContent(content) {
      const trigger = this.triggerTargets.find((t) => t.dataset.value === this.activeMenuValue);
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      content.style.position = "fixed";
      content.style.zIndex = "50";
      content.style.top = `${rect.bottom + 4}px`;
      content.style.left = `${rect.left}px`;
      requestAnimationFrame(() => {
        const contentRect = content.getBoundingClientRect();
        if (contentRect.right > window.innerWidth) {
          content.style.left = `${window.innerWidth - contentRect.width - 8}px`;
        }
        if (contentRect.bottom > window.innerHeight) {
          content.style.top = `${rect.top - contentRect.height - 4}px`;
        }
      });
    }
    _handleClickOutside(event) {
      if (!this.element.contains(event.target)) {
        this.activeMenuValue = "";
      }
    }
    _handleKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        const trigger = this.triggerTargets.find((t) => t.dataset.value === this.activeMenuValue);
        this.activeMenuValue = "";
        trigger?.focus();
        return;
      }
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        const triggers = this.triggerTargets;
        const currentIdx = triggers.findIndex((t) => t.dataset.value === this.activeMenuValue);
        if (currentIdx === -1) return;
        const isInContent = document.activeElement?.closest('[data-slot*="menubar-content"]');
        if (isInContent) {
          event.preventDefault();
          const nextIdx = event.key === "ArrowRight" ? (currentIdx + 1) % triggers.length : (currentIdx - 1 + triggers.length) % triggers.length;
          this.activeMenuValue = triggers[nextIdx].dataset.value;
          return;
        }
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const items = this._getActiveItems();
        const current = items.indexOf(document.activeElement);
        event.preventDefault();
        const next = event.key === "ArrowDown" ? (current + 1) % items.length : (current - 1 + items.length) % items.length;
        items[next]?.focus();
      }
      if (event.key === "Enter" || event.key === " ") {
        if (document.activeElement?.matches('[data-slot*="menubar-item"]')) {
          event.preventDefault();
          document.activeElement.click();
        }
      }
    }
    _getActiveItems() {
      const content = this.contentTargets.find((c) => c.dataset.value === this.activeMenuValue);
      if (!content) return [];
      return Array.from(content.querySelectorAll(
        '[data-slot*="menubar-item"]:not([data-disabled]), [data-slot*="checkbox-item"]:not([data-disabled]), [data-slot*="radio-item"]:not([data-disabled])'
      )).filter((el) => !el.closest("[hidden]"));
    }
    _removeListeners() {
      document.removeEventListener("click", this._onClickOutside, true);
      document.removeEventListener("keydown", this._onKeydown);
    }
  };

  // app/javascript/controllers/shadcn/navigation_menu_controller.js
  var navigation_menu_controller_default = class extends Controller {
    static targets = ["item", "trigger", "content", "viewport", "link"];
    static values = {
      activeItem: { type: String, default: "" },
      delayDuration: { type: Number, default: 200 }
    };
    connect() {
      this._showTimeout = null;
      this._hideTimeout = null;
      this._onClickOutside = this._handleClickOutside.bind(this);
      document.addEventListener("click", this._onClickOutside, true);
    }
    disconnect() {
      clearTimeout(this._showTimeout);
      clearTimeout(this._hideTimeout);
      document.removeEventListener("click", this._onClickOutside, true);
    }
    enterTrigger(event) {
      clearTimeout(this._hideTimeout);
      const value = event.currentTarget.dataset.value;
      this._showTimeout = setTimeout(() => {
        this.activeItemValue = value;
      }, this.delayDurationValue);
    }
    leaveTrigger() {
      clearTimeout(this._showTimeout);
      this._hideTimeout = setTimeout(() => {
        this.activeItemValue = "";
      }, this.delayDurationValue);
    }
    clickTrigger(event) {
      const value = event.currentTarget.dataset.value;
      if (this.activeItemValue === value) {
        this.activeItemValue = "";
      } else {
        this.activeItemValue = value;
      }
    }
    enterContent() {
      clearTimeout(this._hideTimeout);
    }
    leaveContent() {
      this._hideTimeout = setTimeout(() => {
        this.activeItemValue = "";
      }, this.delayDurationValue);
    }
    keydown(event) {
      const triggers = this.triggerTargets;
      const current = triggers.indexOf(event.currentTarget);
      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          triggers[(current + 1) % triggers.length]?.focus();
          break;
        case "ArrowLeft":
          event.preventDefault();
          triggers[(current - 1 + triggers.length) % triggers.length]?.focus();
          break;
        case "ArrowDown":
          event.preventDefault();
          if (this.activeItemValue) {
            const content = this._getActiveContent();
            const firstLink = content?.querySelector('[data-slot="navigation-menu-link"]');
            firstLink?.focus();
          } else {
            this.activeItemValue = event.currentTarget.dataset.value;
          }
          break;
        case "Escape":
          event.preventDefault();
          this.activeItemValue = "";
          event.currentTarget.focus();
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          this.clickTrigger(event);
          break;
      }
    }
    contentKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        this.activeItemValue = "";
        const trigger = this.triggerTargets.find(
          (t) => t.dataset.value === this._lastActiveItem
        );
        trigger?.focus();
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const links = Array.from(
          this._getActiveContent()?.querySelectorAll('[data-slot="navigation-menu-link"]') || []
        );
        const current = links.indexOf(document.activeElement);
        const next = event.key === "ArrowDown" ? (current + 1) % links.length : (current - 1 + links.length) % links.length;
        links[next]?.focus();
      }
    }
    activeItemValueChanged() {
      this._lastActiveItem = this.activeItemValue || this._lastActiveItem;
      this._syncState();
    }
    _syncState() {
      this.triggerTargets.forEach((trigger) => {
        const isActive = trigger.dataset.value === this.activeItemValue;
        trigger.dataset.state = isActive ? "open" : "closed";
        trigger.setAttribute("aria-expanded", String(isActive));
      });
      this.contentTargets.forEach((content) => {
        const isActive = content.dataset.value === this.activeItemValue;
        content.dataset.state = isActive ? "open" : "closed";
        content.hidden = !isActive;
        if (isActive) {
          content.dataset.motion = "from-start";
        }
      });
      this.viewportTargets.forEach((viewport) => {
        const hasActive = this.activeItemValue !== "";
        viewport.dataset.state = hasActive ? "open" : "closed";
        viewport.hidden = !hasActive;
      });
    }
    _getActiveContent() {
      return this.contentTargets.find((c) => c.dataset.value === this.activeItemValue);
    }
    _handleClickOutside(event) {
      if (!this.element.contains(event.target)) {
        this.activeItemValue = "";
      }
    }
  };

  // app/javascript/controllers/shadcn/popover_controller.js
  var popover_controller_default = class extends Controller {
    static targets = ["trigger", "content", "anchor", "close"];
    static values = {
      open: { type: Boolean, default: false },
      side: { type: String, default: "bottom" },
      align: { type: String, default: "center" },
      sideOffset: { type: Number, default: 4 }
    };
    connect() {
      this._onClickOutside = this._handleClickOutside.bind(this);
      this._onKeydown = this._handleKeydown.bind(this);
      this._onResize = this._handleResize.bind(this);
      this._hideTimeouts = [];
      this._syncState();
    }
    disconnect() {
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
      this._removeListeners();
    }
    toggle() {
      this.openValue = !this.openValue;
    }
    show() {
      this.openValue = true;
    }
    hide() {
      this.openValue = false;
    }
    openValueChanged() {
      this._syncState();
    }
    _syncState() {
      if (!this._hideTimeouts) return;
      const state = this.openValue ? "open" : "closed";
      this.element.dataset.state = state;
      this.triggerTargets.forEach((el) => {
        el.dataset.state = state;
        el.setAttribute("aria-expanded", String(this.openValue));
      });
      this.contentTargets.forEach((el) => {
        el.dataset.state = state;
        if (this.openValue) {
          el.hidden = false;
          this._position(el);
        } else {
          this._hideAfterAnimation(el);
        }
      });
      if (this.openValue) {
        requestAnimationFrame(() => {
          document.addEventListener("click", this._onClickOutside, true);
        });
        document.addEventListener("keydown", this._onKeydown);
        window.addEventListener("resize", this._onResize);
      } else {
        this._removeListeners();
      }
    }
    _position(content) {
      const anchor = this.hasAnchorTarget ? this.anchorTarget : this.hasTriggerTarget ? this.triggerTarget : null;
      if (!anchor) return;
      const anchorRect = anchor.getBoundingClientRect();
      const offset = this.sideOffsetValue;
      content.style.position = "fixed";
      content.style.zIndex = "50";
      const contentRect = content.getBoundingClientRect();
      let top, left;
      switch (this.sideValue) {
        case "top":
          top = anchorRect.top - contentRect.height - offset;
          content.dataset.side = "top";
          break;
        case "bottom":
          top = anchorRect.bottom + offset;
          content.dataset.side = "bottom";
          break;
        case "left":
          top = anchorRect.top;
          left = anchorRect.left - contentRect.width - offset;
          content.dataset.side = "left";
          break;
        case "right":
          top = anchorRect.top;
          left = anchorRect.right + offset;
          content.dataset.side = "right";
          break;
        default:
          top = anchorRect.bottom + offset;
          content.dataset.side = "bottom";
      }
      if (this.sideValue === "top" || this.sideValue === "bottom") {
        switch (this.alignValue) {
          case "start":
            left = anchorRect.left;
            break;
          case "end":
            left = anchorRect.right - contentRect.width;
            break;
          default:
            left = anchorRect.left + (anchorRect.width - contentRect.width) / 2;
        }
      }
      if (top + contentRect.height > window.innerHeight && this.sideValue === "bottom") {
        top = anchorRect.top - contentRect.height - offset;
        content.dataset.side = "top";
      } else if (top < 0 && this.sideValue === "top") {
        top = anchorRect.bottom + offset;
        content.dataset.side = "bottom";
      }
      left = Math.max(8, Math.min(left, window.innerWidth - contentRect.width - 8));
      top = Math.max(8, Math.min(top, window.innerHeight - contentRect.height - 8));
      content.style.top = `${top}px`;
      content.style.left = `${left}px`;
    }
    _handleClickOutside(event) {
      if (!this.element.contains(event.target)) {
        this.hide();
      }
    }
    _handleKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        this.hide();
        this.triggerTargets[0]?.focus();
      }
    }
    _handleResize() {
      if (this.openValue && this.hasContentTarget) {
        this._position(this.contentTarget);
      }
    }
    _removeListeners() {
      document.removeEventListener("click", this._onClickOutside, true);
      document.removeEventListener("keydown", this._onKeydown);
      window.removeEventListener("resize", this._onResize);
    }
    _hideAfterAnimation(el) {
      this._hideTimeouts.push(setTimeout(() => {
        if (el.dataset.state === "closed") el.hidden = true;
      }, 200));
    }
  };

  // app/javascript/controllers/shadcn/radio_group_controller.js
  var radio_group_controller_default = class extends Controller {
    static targets = ["item", "input"];
    static values = {
      value: { type: String, default: "" },
      orientation: { type: String, default: "vertical" },
      disabled: { type: Boolean, default: false }
    };
    connect() {
      this._syncState();
    }
    select(event) {
      if (this.disabledValue) return;
      const item = event.currentTarget;
      const value = item.dataset.value;
      if (value && value !== this.valueValue) {
        this.valueValue = value;
        this.dispatch("change", { detail: { value } });
      }
    }
    keydown(event) {
      const items = this.itemTargets.filter((el) => !el.dataset.disabled);
      const current = items.indexOf(event.currentTarget);
      if (current === -1) return;
      const isVertical = this.orientationValue === "vertical";
      const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
      const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
      let nextIndex;
      switch (event.key) {
        case nextKey:
          event.preventDefault();
          nextIndex = (current + 1) % items.length;
          items[nextIndex].focus();
          this.valueValue = items[nextIndex].dataset.value;
          break;
        case prevKey:
          event.preventDefault();
          nextIndex = (current - 1 + items.length) % items.length;
          items[nextIndex].focus();
          this.valueValue = items[nextIndex].dataset.value;
          break;
        case " ":
          event.preventDefault();
          this.valueValue = event.currentTarget.dataset.value;
          break;
      }
    }
    valueValueChanged() {
      this._syncState();
    }
    _syncState() {
      this.itemTargets.forEach((item) => {
        const isChecked = item.dataset.value === this.valueValue;
        item.dataset.state = isChecked ? "checked" : "unchecked";
        item.setAttribute("aria-checked", String(isChecked));
        item.setAttribute("tabindex", isChecked ? "0" : "-1");
        const indicator = item.querySelector("span");
        if (indicator) {
          indicator.hidden = !isChecked;
        }
      });
      this.inputTargets.forEach((input) => {
        input.value = this.valueValue;
      });
    }
  };

  // app/javascript/controllers/shadcn/scroll_area_controller.js
  var scroll_area_controller_default = class extends Controller {
    static targets = ["viewport", "scrollbar", "thumb"];
    static values = {
      orientation: { type: String, default: "vertical" }
    };
    connect() {
      this._onScroll = this._handleScroll.bind(this);
      this._onPointerDown = this._handlePointerDown.bind(this);
      this._onPointerMove = this._handlePointerMove.bind(this);
      this._onPointerUp = this._handlePointerUp.bind(this);
      this._dragging = false;
      if (this.hasViewportTarget) {
        this.viewportTarget.addEventListener("scroll", this._onScroll, { passive: true });
      }
      this._updateThumb();
      this._observer = new ResizeObserver(() => this._updateThumb());
      if (this.hasViewportTarget) {
        this._observer.observe(this.viewportTarget);
      }
    }
    disconnect() {
      if (this.hasViewportTarget) {
        this.viewportTarget.removeEventListener("scroll", this._onScroll);
      }
      this._observer?.disconnect();
      document.removeEventListener("pointermove", this._onPointerMove);
      document.removeEventListener("pointerup", this._onPointerUp);
    }
    startDrag(event) {
      event.preventDefault();
      this._dragging = true;
      this._dragStart = this.orientationValue === "vertical" ? event.clientY : event.clientX;
      this._scrollStart = this.orientationValue === "vertical" ? this.viewportTarget.scrollTop : this.viewportTarget.scrollLeft;
      document.addEventListener("pointermove", this._onPointerMove);
      document.addEventListener("pointerup", this._onPointerUp);
    }
    _handleScroll() {
      this._updateThumb();
    }
    _handlePointerDown(event) {
      this.startDrag(event);
    }
    _handlePointerMove(event) {
      if (!this._dragging || !this.hasViewportTarget) return;
      const viewport = this.viewportTarget;
      const isVertical = this.orientationValue === "vertical";
      const delta = isVertical ? event.clientY - this._dragStart : event.clientX - this._dragStart;
      const viewportSize = isVertical ? viewport.clientHeight : viewport.clientWidth;
      const scrollSize = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
      const scrollRatio = scrollSize / viewportSize;
      if (isVertical) {
        viewport.scrollTop = this._scrollStart + delta * scrollRatio;
      } else {
        viewport.scrollLeft = this._scrollStart + delta * scrollRatio;
      }
    }
    _handlePointerUp() {
      this._dragging = false;
      document.removeEventListener("pointermove", this._onPointerMove);
      document.removeEventListener("pointerup", this._onPointerUp);
    }
    _updateThumb() {
      if (!this.hasViewportTarget || !this.hasThumbTarget) return;
      const viewport = this.viewportTarget;
      const isVertical = this.orientationValue === "vertical";
      const viewportSize = isVertical ? viewport.clientHeight : viewport.clientWidth;
      const scrollSize = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
      const scrollPos = isVertical ? viewport.scrollTop : viewport.scrollLeft;
      if (scrollSize <= viewportSize) {
        this.scrollbarTargets.forEach((el) => {
          el.style.display = "none";
        });
        return;
      }
      this.scrollbarTargets.forEach((el) => {
        el.style.display = "";
      });
      const thumbSize = Math.max(viewportSize / scrollSize * viewportSize, 20);
      const thumbPos = scrollPos / (scrollSize - viewportSize) * (viewportSize - thumbSize);
      this.thumbTargets.forEach((thumb) => {
        if (isVertical) {
          thumb.style.height = `${thumbSize}px`;
          thumb.style.transform = `translateY(${thumbPos}px)`;
        } else {
          thumb.style.width = `${thumbSize}px`;
          thumb.style.transform = `translateX(${thumbPos}px)`;
        }
      });
    }
  };

  // app/javascript/controllers/shadcn/select_controller.js
  var select_controller_default = class extends Controller {
    static targets = ["trigger", "content", "item", "value", "input"];
    static values = {
      open: { type: Boolean, default: false },
      value: { type: String, default: "" },
      placeholder: { type: String, default: "Select..." },
      disabled: { type: Boolean, default: false }
    };
    connect() {
      this._hideTimeouts = [];
      this._syncValueState();
      this.contentTargets.forEach((el) => {
        el.dataset.state = "closed";
        el.hidden = true;
      });
      this.triggerTargets.forEach((el) => {
        el.dataset.state = "closed";
        el.setAttribute("aria-expanded", "false");
      });
    }
    disconnect() {
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
    }
    // Wired as: data-action="click->shadcn--select#toggle"
    toggle() {
      if (this.disabledValue) return;
      this.openValue = !this.openValue;
    }
    // Wired as: data-action="click@window->shadcn--select#hide"
    // This fires on EVERY click on the page. The guard ensures it only
    // closes when the click is outside this element.
    hide(event) {
      if (!this.openValue) return;
      if (event && event.target && this.element.contains(event.target)) return;
      this.openValue = false;
    }
    // Wired as: data-action="keydown.esc@window->shadcn--select#hideOnEscape"
    hideOnEscape(event) {
      if (!this.openValue) return;
      this.openValue = false;
      this.triggerTargets[0]?.focus();
    }
    // Wired as: data-action="click->shadcn--select#selectItem"
    selectItem(event) {
      const item = event.currentTarget;
      if (item.dataset.disabled) return;
      const value = item.dataset.value;
      const label = item.textContent.trim();
      this.valueValue = value;
      this.valueTargets.forEach((el) => {
        el.textContent = label;
        el.removeAttribute("data-placeholder");
      });
      this.dispatch("change", { detail: { value, label } });
      this.openValue = false;
      this.triggerTargets[0]?.focus();
    }
    openValueChanged() {
      if (!this._hideTimeouts) return;
      this._render();
    }
    valueValueChanged() {
      if (!this._hideTimeouts) return;
      this._syncValueState();
    }
    // ── Private ─────────────────────────────────────────
    _render() {
      const open = this.openValue;
      const state = open ? "open" : "closed";
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
      this.triggerTargets.forEach((el) => {
        el.dataset.state = state;
        el.setAttribute("aria-expanded", String(open));
      });
      this.contentTargets.forEach((el) => {
        el.dataset.state = state;
        if (open) {
          el.hidden = false;
          this._position(el);
          requestAnimationFrame(() => {
            const selected = el.querySelector(`[data-value="${this.valueValue}"]`);
            const target = selected || el.querySelector('[data-slot="select-item"]:not([data-disabled])');
            target?.focus();
          });
        } else {
          this._hideTimeouts.push(setTimeout(() => {
            el.hidden = true;
          }, 150));
        }
      });
    }
    _syncValueState() {
      this.itemTargets.forEach((item) => {
        const isSelected = item.dataset.value === this.valueValue;
        item.dataset.state = isSelected ? "checked" : "unchecked";
        item.setAttribute("aria-selected", String(isSelected));
        const indicator = item.querySelector("span");
        if (indicator) indicator.style.visibility = isSelected ? "visible" : "hidden";
      });
      this.inputTargets.forEach((input) => {
        input.value = this.valueValue;
      });
      if (!this.valueValue) {
        this.valueTargets.forEach((el) => {
          el.textContent = this.placeholderValue;
          el.dataset.placeholder = "";
        });
      }
    }
    _position(content) {
      if (!this.hasTriggerTarget) return;
      const rect = this.triggerTarget.getBoundingClientRect();
      content.style.position = "fixed";
      content.style.zIndex = "50";
      content.style.width = `${rect.width}px`;
      content.style.minWidth = `${Math.max(rect.width, 128)}px`;
      let top = rect.bottom + 4;
      const contentHeight = content.scrollHeight;
      if (top + contentHeight > window.innerHeight) {
        top = rect.top - contentHeight - 4;
      }
      content.style.top = `${top}px`;
      content.style.left = `${rect.left}px`;
    }
    // Keyboard nav within the open dropdown
    navigate(event) {
      if (!this.openValue) return;
      const items = this._getItems();
      const current = items.indexOf(document.activeElement);
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          items[(current + 1) % items.length]?.focus();
          break;
        case "ArrowUp":
          event.preventDefault();
          items[(current - 1 + items.length) % items.length]?.focus();
          break;
        case "Home":
          event.preventDefault();
          items[0]?.focus();
          break;
        case "End":
          event.preventDefault();
          items[items.length - 1]?.focus();
          break;
        case "Enter":
        case " ":
          if (document.activeElement?.matches('[data-slot="select-item"]')) {
            event.preventDefault();
            document.activeElement.click();
          }
          break;
      }
    }
    _getItems() {
      if (!this.hasContentTarget) return [];
      return Array.from(this.contentTarget.querySelectorAll('[data-slot="select-item"]:not([data-disabled])'));
    }
  };

  // app/javascript/controllers/shadcn/sheet_controller.js
  var sheet_controller_default = class extends Controller {
    static targets = ["trigger", "overlay", "content", "close", "title", "description"];
    static values = {
      open: { type: Boolean, default: false },
      side: { type: String, default: "right" },
      closeOnOverlay: { type: Boolean, default: true },
      closeOnEscape: { type: Boolean, default: true }
    };
    connect() {
      this._onKeydown = this._handleKeydown.bind(this);
      this._previouslyFocused = null;
      this._hideTimeouts = [];
      this._syncState();
    }
    disconnect() {
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
      document.removeEventListener("keydown", this._onKeydown);
      this._unlockScroll();
    }
    toggle() {
      this.openValue = !this.openValue;
    }
    show() {
      this.openValue = true;
    }
    hide() {
      this.openValue = false;
    }
    openValueChanged() {
      this._syncState();
    }
    clickOverlay(event) {
      if (this.closeOnOverlayValue && event.target === event.currentTarget) {
        this.hide();
      }
    }
    _syncState() {
      if (!this._hideTimeouts) return;
      const state = this.openValue ? "open" : "closed";
      this.element.dataset.state = state;
      this.overlayTargets.forEach((el) => {
        el.dataset.state = state;
        if (this.openValue) {
          el.hidden = false;
        } else {
          this._hideAfterAnimation(el);
        }
      });
      this.contentTargets.forEach((el) => {
        el.dataset.state = state;
        el.dataset.side = this.sideValue;
        if (this.openValue) {
          el.hidden = false;
          el.setAttribute("role", "dialog");
          el.setAttribute("aria-modal", "true");
        } else {
          this._hideAfterAnimation(el);
        }
      });
      if (this.openValue) {
        this._lockScroll();
        document.addEventListener("keydown", this._onKeydown);
        requestAnimationFrame(() => this._trapFocus());
      } else {
        this._unlockScroll();
        document.removeEventListener("keydown", this._onKeydown);
        if (this._previouslyFocused?.focus) {
          this._previouslyFocused.focus();
          this._previouslyFocused = null;
        }
      }
    }
    _trapFocus() {
      this._previouslyFocused = document.activeElement;
      if (this.hasContentTarget) {
        const focusable = this._getFocusable(this.contentTarget);
        if (focusable.length > 0) focusable[0].focus();
      }
    }
    _handleKeydown(event) {
      if (event.key === "Escape" && this.closeOnEscapeValue) {
        event.preventDefault();
        this.hide();
        return;
      }
      if (event.key === "Tab" && this.hasContentTarget) {
        const focusable = this._getFocusable(this.contentTarget);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    _getFocusable(container) {
      return Array.from(container.querySelectorAll(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
      )).filter((el) => !el.closest("[hidden]") && el.offsetParent !== null);
    }
    _lockScroll() {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    }
    _unlockScroll() {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    _hideAfterAnimation(el) {
      const onEnd = () => {
        if (el.dataset.state === "closed") el.hidden = true;
        el.removeEventListener("animationend", onEnd);
      };
      el.addEventListener("animationend", onEnd);
      this._hideTimeouts.push(setTimeout(() => {
        if (el.dataset.state === "closed") el.hidden = true;
      }, 500));
    }
  };

  // app/javascript/controllers/shadcn/slider_controller.js
  var slider_controller_default = class extends Controller {
    static targets = ["track", "range", "thumb", "input"];
    static values = {
      value: { type: Number, default: 0 },
      min: { type: Number, default: 0 },
      max: { type: Number, default: 100 },
      step: { type: Number, default: 1 },
      disabled: { type: Boolean, default: false },
      orientation: { type: String, default: "horizontal" }
    };
    connect() {
      this._onPointerMove = this._handlePointerMove.bind(this);
      this._onPointerUp = this._handlePointerUp.bind(this);
      this._dragging = false;
      this._syncState();
    }
    disconnect() {
      document.removeEventListener("pointermove", this._onPointerMove);
      document.removeEventListener("pointerup", this._onPointerUp);
    }
    // Click on track to set value
    clickTrack(event) {
      if (this.disabledValue) return;
      this._setValueFromPointer(event);
    }
    // Start dragging thumb
    startDrag(event) {
      if (this.disabledValue) return;
      event.preventDefault();
      this._dragging = true;
      document.addEventListener("pointermove", this._onPointerMove);
      document.addEventListener("pointerup", this._onPointerUp);
    }
    // Keyboard control
    keydown(event) {
      if (this.disabledValue) return;
      const step = this.stepValue;
      const bigStep = (this.maxValue - this.minValue) / 10;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
          event.preventDefault();
          this.valueValue = Math.min(this.maxValue, this.valueValue + step);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          event.preventDefault();
          this.valueValue = Math.max(this.minValue, this.valueValue - step);
          break;
        case "PageUp":
          event.preventDefault();
          this.valueValue = Math.min(this.maxValue, this.valueValue + bigStep);
          break;
        case "PageDown":
          event.preventDefault();
          this.valueValue = Math.max(this.minValue, this.valueValue - bigStep);
          break;
        case "Home":
          event.preventDefault();
          this.valueValue = this.minValue;
          break;
        case "End":
          event.preventDefault();
          this.valueValue = this.maxValue;
          break;
      }
      this.dispatch("change", { detail: { value: this.valueValue } });
    }
    valueValueChanged() {
      this._syncState();
    }
    _handlePointerMove(event) {
      if (!this._dragging) return;
      this._setValueFromPointer(event);
    }
    _handlePointerUp() {
      this._dragging = false;
      document.removeEventListener("pointermove", this._onPointerMove);
      document.removeEventListener("pointerup", this._onPointerUp);
      this.dispatch("change", { detail: { value: this.valueValue } });
    }
    _setValueFromPointer(event) {
      if (!this.hasTrackTarget) return;
      const rect = this.trackTarget.getBoundingClientRect();
      let ratio;
      if (this.orientationValue === "horizontal") {
        ratio = (event.clientX - rect.left) / rect.width;
      } else {
        ratio = 1 - (event.clientY - rect.top) / rect.height;
      }
      ratio = Math.max(0, Math.min(1, ratio));
      const raw = this.minValue + ratio * (this.maxValue - this.minValue);
      const stepped = Math.round(raw / this.stepValue) * this.stepValue;
      this.valueValue = Math.max(this.minValue, Math.min(this.maxValue, stepped));
    }
    _syncState() {
      const pct = (this.valueValue - this.minValue) / (this.maxValue - this.minValue) * 100;
      this.rangeTargets.forEach((el) => {
        if (this.orientationValue === "horizontal") {
          el.style.width = `${pct}%`;
        } else {
          el.style.height = `${pct}%`;
        }
      });
      this.thumbTargets.forEach((el) => {
        if (this.orientationValue === "horizontal") {
          el.style.left = `${pct}%`;
          el.style.transform = "translateX(-50%)";
        } else {
          el.style.bottom = `${pct}%`;
          el.style.transform = "translateY(50%)";
        }
        el.setAttribute("aria-valuenow", String(this.valueValue));
        el.setAttribute("aria-valuemin", String(this.minValue));
        el.setAttribute("aria-valuemax", String(this.maxValue));
      });
      this.inputTargets.forEach((input) => {
        input.value = String(this.valueValue);
      });
    }
  };

  // app/javascript/controllers/shadcn/switch_controller.js
  var switch_controller_default = class extends Controller {
    static targets = ["button", "thumb", "input"];
    static values = {
      checked: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false }
    };
    connect() {
      this._syncState();
    }
    toggle() {
      if (this.disabledValue) return;
      this.checkedValue = !this.checkedValue;
      this.dispatch("change", { detail: { checked: this.checkedValue } });
    }
    checkedValueChanged() {
      this._syncState();
    }
    _syncState() {
      const state = this.checkedValue ? "checked" : "unchecked";
      this.buttonTargets.forEach((btn) => {
        btn.dataset.state = state;
        btn.setAttribute("aria-checked", String(this.checkedValue));
      });
      this.thumbTargets.forEach((thumb) => {
        thumb.dataset.state = state;
      });
      this.inputTargets.forEach((input) => {
        input.value = this.checkedValue ? "1" : "0";
        input.checked = this.checkedValue;
      });
    }
  };

  // app/javascript/controllers/shadcn/tabs_controller.js
  var tabs_controller_default = class extends Controller {
    static targets = ["list", "trigger", "content"];
    static values = {
      value: { type: String, default: "" },
      orientation: { type: String, default: "horizontal" },
      activationMode: { type: String, default: "automatic" }
      // "automatic" or "manual"
    };
    connect() {
      if (!this.valueValue && this.triggerTargets.length > 0) {
        this.valueValue = this.triggerTargets[0].dataset.value || "";
      }
      this._syncState();
    }
    select(event) {
      const trigger = event.currentTarget;
      const value = trigger.dataset.value;
      if (value) this.valueValue = value;
    }
    keydown(event) {
      const triggers = this.triggerTargets;
      const current = triggers.indexOf(event.currentTarget);
      if (current === -1) return;
      const isHorizontal = this.orientationValue === "horizontal";
      const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
      const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
      let nextIndex;
      switch (event.key) {
        case nextKey:
          event.preventDefault();
          nextIndex = (current + 1) % triggers.length;
          triggers[nextIndex].focus();
          if (this.activationModeValue === "automatic") {
            this.valueValue = triggers[nextIndex].dataset.value;
          }
          break;
        case prevKey:
          event.preventDefault();
          nextIndex = (current - 1 + triggers.length) % triggers.length;
          triggers[nextIndex].focus();
          if (this.activationModeValue === "automatic") {
            this.valueValue = triggers[nextIndex].dataset.value;
          }
          break;
        case "Home":
          event.preventDefault();
          triggers[0].focus();
          if (this.activationModeValue === "automatic") {
            this.valueValue = triggers[0].dataset.value;
          }
          break;
        case "End":
          event.preventDefault();
          const last = triggers[triggers.length - 1];
          last.focus();
          if (this.activationModeValue === "automatic") {
            this.valueValue = last.dataset.value;
          }
          break;
        case "Enter":
        case " ":
          if (this.activationModeValue === "manual") {
            event.preventDefault();
            this.valueValue = event.currentTarget.dataset.value;
          }
          break;
      }
    }
    valueValueChanged() {
      this._syncState();
    }
    _syncState() {
      this.triggerTargets.forEach((trigger) => {
        const isActive = trigger.dataset.value === this.valueValue;
        trigger.dataset.state = isActive ? "active" : "inactive";
        trigger.setAttribute("aria-selected", String(isActive));
        trigger.setAttribute("tabindex", isActive ? "0" : "-1");
      });
      this.contentTargets.forEach((content) => {
        const isActive = content.dataset.value === this.valueValue;
        content.dataset.state = isActive ? "active" : "inactive";
        content.hidden = !isActive;
        content.setAttribute("tabindex", isActive ? "0" : "-1");
      });
    }
  };

  // app/javascript/controllers/shadcn/toast_controller.js
  var toast_controller_default = class extends Controller {
    static targets = ["container", "toast"];
    static values = {
      position: { type: String, default: "bottom-right" },
      duration: { type: Number, default: 5e3 },
      maxToasts: { type: Number, default: 5 }
    };
    connect() {
      this._toasts = /* @__PURE__ */ new Map();
      this._counter = 0;
      this._hideTimeouts = [];
      this._globalShow = (e) => this.show(e);
      this._globalSuccess = (e) => this.success(e);
      this._globalError = (e) => this.error(e);
      this._globalWarning = (e) => this.warning(e);
      this._globalInfo = (e) => this.info(e);
      document.addEventListener("toast:show", this._globalShow);
      document.addEventListener("toast:success", this._globalSuccess);
      document.addEventListener("toast:error", this._globalError);
      document.addEventListener("toast:warning", this._globalWarning);
      document.addEventListener("toast:info", this._globalInfo);
    }
    disconnect() {
      this._toasts.forEach((timer) => clearTimeout(timer));
      this._toasts.clear();
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
      document.removeEventListener("toast:show", this._globalShow);
      document.removeEventListener("toast:success", this._globalSuccess);
      document.removeEventListener("toast:error", this._globalError);
      document.removeEventListener("toast:warning", this._globalWarning);
      document.removeEventListener("toast:info", this._globalInfo);
    }
    // Public API: works with event.detail (custom events) or event.params (Stimulus actions)
    show(event) {
      const data = event.detail || event.params || {};
      const { title, description, variant = "default", duration, action } = data;
      this._addToast({ title, description, variant, duration: duration || this.durationValue, action });
    }
    success(event) {
      const data = event.detail || event.params || {};
      this._addToast({ ...data, variant: "success", duration: data.duration || this.durationValue });
    }
    error(event) {
      const data = event.detail || event.params || {};
      this._addToast({ ...data, variant: "error", duration: data.duration || this.durationValue });
    }
    warning(event) {
      const data = event.detail || event.params || {};
      this._addToast({ ...data, variant: "warning", duration: data.duration || this.durationValue });
    }
    info(event) {
      const data = event.detail || event.params || {};
      this._addToast({ ...data, variant: "info", duration: data.duration || this.durationValue });
    }
    dismiss(event) {
      const toast = event.currentTarget.closest('[data-slot="toast"]');
      if (toast) this._removeToast(toast);
    }
    _addToast({ title, description, variant, duration, action }) {
      const id = `toast-${++this._counter}`;
      const container = this.hasContainerTarget ? this.containerTarget : this.element;
      const existing = container.querySelectorAll('[data-slot="toast"]');
      if (existing.length >= this.maxToastsValue) {
        this._removeToast(existing[0]);
      }
      const toast = document.createElement("div");
      toast.dataset.slot = "toast";
      toast.dataset.variant = variant;
      toast.dataset.state = "open";
      toast.id = id;
      toast.setAttribute("role", "alert");
      toast.className = this._getToastClasses(variant);
      let html = '<div class="grid gap-1">';
      if (title) html += `<div data-slot="toast-title" class="text-sm font-semibold">${this._escapeHtml(title)}</div>`;
      if (description) html += `<div data-slot="toast-description" class="text-sm opacity-90">${this._escapeHtml(description)}</div>`;
      html += "</div>";
      if (action) {
        html += `<button data-slot="toast-action" class="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary">${this._escapeHtml(action.label)}</button>`;
      }
      html += `<button data-action="shadcn--toast#dismiss" class="absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>`;
      toast.innerHTML = html;
      if (action?.handler) {
        const actionBtn = toast.querySelector('[data-slot="toast-action"]');
        if (actionBtn) {
          actionBtn.addEventListener("click", () => {
            action.handler();
            this._removeToast(toast);
          });
        }
      }
      this._addSwipeToDismiss(toast);
      container.appendChild(toast);
      if (duration > 0) {
        const timer = setTimeout(() => this._removeToast(toast), duration);
        this._toasts.set(id, timer);
      }
      toast.addEventListener("mouseenter", () => {
        const timer = this._toasts.get(id);
        if (timer) clearTimeout(timer);
      });
      toast.addEventListener("mouseleave", () => {
        if (duration > 0) {
          const timer = setTimeout(() => this._removeToast(toast), duration);
          this._toasts.set(id, timer);
        }
      });
    }
    _removeToast(toast) {
      const id = toast.id;
      const timer = this._toasts.get(id);
      if (timer) clearTimeout(timer);
      this._toasts.delete(id);
      toast.dataset.state = "closed";
      toast.style.transition = "opacity 200ms, transform 200ms";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      this._hideTimeouts.push(setTimeout(() => toast.remove(), 200));
    }
    _addSwipeToDismiss(toast) {
      let startX = 0;
      let currentX = 0;
      toast.addEventListener("pointerdown", (e) => {
        startX = e.clientX;
        toast.style.transition = "none";
      });
      toast.addEventListener("pointermove", (e) => {
        if (!startX) return;
        currentX = e.clientX - startX;
        if (currentX > 0) {
          toast.style.transform = `translateX(${currentX}px)`;
          toast.style.opacity = String(1 - currentX / 200);
        }
      });
      toast.addEventListener("pointerup", () => {
        if (currentX > 100) {
          this._removeToast(toast);
        } else {
          toast.style.transition = "transform 200ms, opacity 200ms";
          toast.style.transform = "";
          toast.style.opacity = "";
        }
        startX = 0;
        currentX = 0;
      });
    }
    _getToastClasses(variant) {
      const base = "group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all";
      const variants = {
        default: "border bg-background text-foreground",
        success: "border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100",
        error: "border-destructive/50 bg-destructive text-white",
        warning: "border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100",
        info: "border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
      };
      return `${base} ${variants[variant] || variants.default}`;
    }
    _escapeHtml(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }
  };

  // app/javascript/controllers/shadcn/toggle_controller.js
  var toggle_controller_default = class extends Controller {
    static targets = ["button"];
    static values = {
      pressed: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false }
    };
    connect() {
      this._syncState();
    }
    toggle() {
      if (this.disabledValue) return;
      this.pressedValue = !this.pressedValue;
      this.dispatch("change", { detail: { pressed: this.pressedValue } });
    }
    pressedValueChanged() {
      this._syncState();
    }
    _syncState() {
      const state = this.pressedValue ? "on" : "off";
      this.buttonTargets.forEach((btn) => {
        btn.dataset.state = state;
        btn.setAttribute("aria-pressed", String(this.pressedValue));
      });
    }
  };

  // app/javascript/controllers/shadcn/toggle_group_controller.js
  var toggle_group_controller_default = class extends Controller {
    static targets = ["item"];
    static values = {
      type: { type: String, default: "single" },
      // "single" or "multiple"
      value: { type: Array, default: [] },
      disabled: { type: Boolean, default: false }
    };
    connect() {
      this._syncState();
    }
    toggle(event) {
      if (this.disabledValue) return;
      const item = event.currentTarget;
      const value = item.dataset.value;
      if (!value) return;
      if (this.typeValue === "single") {
        if (this.valueValue.includes(value)) {
          this.valueValue = [];
        } else {
          this.valueValue = [value];
        }
      } else {
        if (this.valueValue.includes(value)) {
          this.valueValue = this.valueValue.filter((v) => v !== value);
        } else {
          this.valueValue = [...this.valueValue, value];
        }
      }
      this.dispatch("change", { detail: { value: this.valueValue } });
    }
    keydown(event) {
      const items = this.itemTargets;
      const current = items.indexOf(event.currentTarget);
      if (current === -1) return;
      let nextIndex;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          nextIndex = (current + 1) % items.length;
          items[nextIndex].focus();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          nextIndex = (current - 1 + items.length) % items.length;
          items[nextIndex].focus();
          break;
      }
    }
    valueValueChanged() {
      this._syncState();
    }
    _syncState() {
      this.itemTargets.forEach((item) => {
        const isPressed = this.valueValue.includes(item.dataset.value);
        item.dataset.state = isPressed ? "on" : "off";
        item.setAttribute("aria-pressed", String(isPressed));
      });
    }
  };

  // app/javascript/controllers/shadcn/tooltip_controller.js
  var tooltip_controller_default = class extends Controller {
    static targets = ["trigger", "content"];
    static values = {
      open: { type: Boolean, default: false },
      side: { type: String, default: "top" },
      sideOffset: { type: Number, default: 4 },
      delayDuration: { type: Number, default: 200 },
      skipDelayDuration: { type: Number, default: 300 }
    };
    connect() {
      this._showTimeout = null;
      this._hideTimeout = null;
      this._hideTimeouts = [];
      this._syncState();
    }
    disconnect() {
      clearTimeout(this._showTimeout);
      clearTimeout(this._hideTimeout);
      this._hideTimeouts.forEach((id) => clearTimeout(id));
      this._hideTimeouts = [];
    }
    mouseEnter() {
      clearTimeout(this._hideTimeout);
      this._showTimeout = setTimeout(() => {
        this.openValue = true;
      }, this.delayDurationValue);
    }
    mouseLeave() {
      clearTimeout(this._showTimeout);
      this._hideTimeout = setTimeout(() => {
        this.openValue = false;
      }, 100);
    }
    focusIn() {
      clearTimeout(this._hideTimeout);
      this.openValue = true;
    }
    focusOut() {
      this.openValue = false;
    }
    contentMouseEnter() {
      clearTimeout(this._hideTimeout);
    }
    contentMouseLeave() {
      this._hideTimeout = setTimeout(() => {
        this.openValue = false;
      }, 100);
    }
    openValueChanged() {
      this._syncState();
    }
    _syncState() {
      if (!this._hideTimeouts) return;
      const state = this.openValue ? "open" : "closed";
      this.element.dataset.state = state;
      this.contentTargets.forEach((el) => {
        el.dataset.state = state;
        if (this.openValue) {
          el.hidden = false;
          el.setAttribute("role", "tooltip");
          this._position(el);
        } else {
          this._hideAfterAnimation(el);
        }
      });
      if (this.hasTriggerTarget && this.hasContentTarget) {
        if (this.openValue) {
          const id = this._ensureId(this.contentTarget, "tooltip");
          this.triggerTarget.setAttribute("aria-describedby", id);
        } else {
          this.triggerTarget.removeAttribute("aria-describedby");
        }
      }
    }
    _position(content) {
      const trigger = this.hasTriggerTarget ? this.triggerTarget : null;
      if (!trigger) return;
      const triggerRect = trigger.getBoundingClientRect();
      const offset = this.sideOffsetValue;
      content.style.position = "fixed";
      content.style.zIndex = "50";
      content.style.pointerEvents = "auto";
      const contentRect = content.getBoundingClientRect();
      let top, left;
      switch (this.sideValue) {
        case "top":
          top = triggerRect.top - contentRect.height - offset;
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
          content.dataset.side = "top";
          break;
        case "bottom":
          top = triggerRect.bottom + offset;
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
          content.dataset.side = "bottom";
          break;
        case "left":
          top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
          left = triggerRect.left - contentRect.width - offset;
          content.dataset.side = "left";
          break;
        case "right":
          top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
          left = triggerRect.right + offset;
          content.dataset.side = "right";
          break;
      }
      if (this.sideValue === "top" && top < 0) {
        top = triggerRect.bottom + offset;
        content.dataset.side = "bottom";
      } else if (this.sideValue === "bottom" && top + contentRect.height > window.innerHeight) {
        top = triggerRect.top - contentRect.height - offset;
        content.dataset.side = "top";
      }
      left = Math.max(8, Math.min(left, window.innerWidth - contentRect.width - 8));
      content.style.top = `${top}px`;
      content.style.left = `${left}px`;
    }
    _hideAfterAnimation(el) {
      this._hideTimeouts.push(setTimeout(() => {
        if (el.dataset.state === "closed") el.hidden = true;
      }, 150));
    }
    _ensureId(el, prefix) {
      if (!el.id) el.id = `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
      return el.id;
    }
  };

  // app/javascript/controllers/shadcn/index.js
  function registerShadcnControllers(application2) {
    application2.register("shadcn--accordion", accordion_controller_default);
    application2.register("shadcn--dark-mode", dark_mode_controller_default);
    application2.register("shadcn--checkbox", checkbox_controller_default);
    application2.register("shadcn--collapsible", collapsible_controller_default);
    application2.register("shadcn--combobox", combobox_controller_default);
    application2.register("shadcn--command", command_controller_default);
    application2.register("shadcn--context-menu", context_menu_controller_default);
    application2.register("shadcn--dialog", dialog_controller_default);
    application2.register("shadcn--drawer", drawer_controller_default);
    application2.register("shadcn--dropdown-menu", dropdown_menu_controller_default);
    application2.register("shadcn--hover-card", hover_card_controller_default);
    application2.register("shadcn--menubar", menubar_controller_default);
    application2.register("shadcn--navigation-menu", navigation_menu_controller_default);
    application2.register("shadcn--popover", popover_controller_default);
    application2.register("shadcn--radio-group", radio_group_controller_default);
    application2.register("shadcn--scroll-area", scroll_area_controller_default);
    application2.register("shadcn--select", select_controller_default);
    application2.register("shadcn--sheet", sheet_controller_default);
    application2.register("shadcn--slider", slider_controller_default);
    application2.register("shadcn--switch", switch_controller_default);
    application2.register("shadcn--tabs", tabs_controller_default);
    application2.register("shadcn--toast", toast_controller_default);
    application2.register("shadcn--toggle", toggle_controller_default);
    application2.register("shadcn--toggle-group", toggle_group_controller_default);
    application2.register("shadcn--tooltip", tooltip_controller_default);
  }

  // app/javascript/controllers/toast_trigger_controller.js
  var toast_trigger_controller_default = class extends Controller {
    static values = {
      title: String,
      description: String,
      variant: { type: String, default: "default" }
    };
    fire() {
      const eventName = this.variantValue === "default" ? "toast:show" : `toast:${this.variantValue}`;
      document.dispatchEvent(new CustomEvent(eventName, {
        detail: {
          title: this.titleValue,
          description: this.descriptionValue
        }
      }));
    }
  };

  // app/javascript/controllers/sonner_controller.js
  var sonner_controller_default = class extends Controller {
    static values = {
      position: { type: String, default: "bottom-right" },
      theme: { type: String, default: "light" },
      richColors: { type: Boolean, default: true },
      closeButton: { type: Boolean, default: true },
      duration: { type: Number, default: 4e3 },
      gap: { type: Number, default: 14 },
      offset: { type: Number, default: 32 },
      visibleToasts: { type: Number, default: 3 },
      width: { type: Number, default: 356 }
    };
    connect() {
      this._toasts = [];
      this._counter = 0;
      this._expanded = false;
      this._buildToaster();
      this._bindGlobalEvents();
    }
    disconnect() {
      this._unbindGlobalEvents();
      this._toaster?.remove();
    }
    // ─── Public API via global events ───────────────────────
    show(e) {
      this._add({ ...e.detail, type: "default" });
    }
    success(e) {
      this._add({ ...e.detail, type: "success" });
    }
    error(e) {
      this._add({ ...e.detail, type: "error" });
    }
    warning(e) {
      this._add({ ...e.detail, type: "warning" });
    }
    info(e) {
      this._add({ ...e.detail, type: "info" });
    }
    // ─── Internal ───────────────────────────────────────────
    _buildToaster() {
      const [y, x] = this.positionValue.split("-");
      const t = document.createElement("ol");
      t.setAttribute("data-sonner-toaster", "true");
      t.setAttribute("data-sonner-theme", this._getTheme());
      t.setAttribute("data-rich-colors", String(this.richColorsValue));
      t.setAttribute("data-y-position", y);
      t.setAttribute("data-x-position", x);
      t.setAttribute("dir", "ltr");
      t.setAttribute("tabindex", "-1");
      t.style.setProperty("--front-toast-height", "0px");
      t.style.setProperty("--offset", `${this.offsetValue}px`);
      t.style.setProperty("--width", `${this.widthValue}px`);
      t.style.setProperty("--gap", `${this.gapValue}px`);
      t.style.setProperty(`--offset-${x}`, `${this.offsetValue}px`);
      t.style.setProperty(`--offset-${y}`, `${this.offsetValue}px`);
      t.style.setProperty("--mobile-offset-left", "16px");
      t.style.setProperty("--mobile-offset-right", "16px");
      t.style.setProperty("--mobile-offset-bottom", "16px");
      t.style.setProperty("--mobile-offset-top", "16px");
      t.addEventListener("mouseenter", () => {
        this._expanded = true;
        this._updatePositions();
      });
      t.addEventListener("mouseleave", () => {
        this._expanded = false;
        this._updatePositions();
      });
      document.body.appendChild(t);
      this._toaster = t;
    }
    _getTheme() {
      if (this.themeValue === "system") {
        return document.documentElement.classList.contains("dark") ? "dark" : "light";
      }
      return this.themeValue;
    }
    _add({ title, description, type = "default", duration, action }) {
      const id = ++this._counter;
      const dur = duration || this.durationValue;
      this._toaster.setAttribute("data-sonner-theme", this._getTheme());
      const li = document.createElement("li");
      li.setAttribute("data-sonner-toast", "");
      li.setAttribute("data-styled", "true");
      li.setAttribute("data-mounted", "false");
      li.setAttribute("data-expanded", String(this._expanded));
      li.setAttribute("data-front", "true");
      li.setAttribute("data-type", type);
      li.setAttribute("data-y-position", this.positionValue.split("-")[0]);
      li.setAttribute("data-x-position", this.positionValue.split("-")[1]);
      li.setAttribute("data-rich-colors", String(this.richColorsValue));
      li.setAttribute("role", "status");
      li.setAttribute("aria-live", "polite");
      li.setAttribute("aria-atomic", "true");
      li.setAttribute("tabindex", "0");
      li.style.setProperty("--index", "0");
      li.style.setProperty("--toasts-before", "0");
      li.style.setProperty("--z-index", String(id));
      li.style.setProperty("--initial-height", "0px");
      let html = "";
      const icon = this._getIcon(type);
      if (icon) html += `<div data-icon="">${icon}</div>`;
      html += `<div data-content="">`;
      if (title) html += `<div data-title="">${this._esc(title)}</div>`;
      if (description) html += `<div data-description="">${this._esc(description)}</div>`;
      html += `</div>`;
      if (action) {
        html += `<button data-button="" data-action-btn="">${this._esc(action)}</button>`;
      }
      if (this.closeButtonValue) {
        html += `<button data-close-button="" aria-label="Close toast"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>`;
      }
      li.innerHTML = html;
      const closeBtn = li.querySelector("[data-close-button]");
      if (closeBtn) closeBtn.addEventListener("click", () => this._dismiss(id));
      this._addSwipe(li, id);
      this._toasts.push({ id, el: li, timer: null });
      this._toaster.prepend(li);
      requestAnimationFrame(() => {
        const height = li.getBoundingClientRect().height;
        li.style.setProperty("--initial-height", `${height}px`);
        this._toaster.style.setProperty("--front-toast-height", `${height}px`);
        li.setAttribute("data-mounted", "true");
        this._updatePositions();
      });
      if (dur > 0) {
        const timer = setTimeout(() => this._dismiss(id), dur);
        this._toasts.find((t) => t.id === id).timer = timer;
      }
    }
    _dismiss(id) {
      const idx = this._toasts.findIndex((t) => t.id === id);
      if (idx === -1) return;
      const toast = this._toasts[idx];
      if (toast.timer) clearTimeout(toast.timer);
      toast.el.setAttribute("data-removed", "true");
      toast.el.setAttribute("data-front", String(idx === this._toasts.length - 1));
      toast.el.setAttribute("data-swipe-out", "false");
      setTimeout(() => {
        toast.el.remove();
        this._toasts.splice(idx, 1);
        this._updatePositions();
      }, 400);
    }
    _updatePositions() {
      const toasts = this._toasts;
      const total = toasts.length;
      toasts.forEach((toast, i) => {
        const frontIdx = total - 1 - i;
        toast.el.setAttribute("data-front", String(frontIdx === 0));
        toast.el.setAttribute("data-expanded", String(this._expanded));
        toast.el.style.setProperty("--index", String(frontIdx));
        toast.el.style.setProperty("--toasts-before", String(frontIdx));
        if (this._expanded) {
          let offset = 0;
          for (let j = i + 1; j < total; j++) {
            offset += this._toasts[j].el.getBoundingClientRect().height + this.gapValue;
          }
          toast.el.style.setProperty("--offset", `${offset}px`);
        }
        toast.el.setAttribute("data-visible", String(frontIdx < this.visibleToastsValue));
      });
    }
    _addSwipe(el, id) {
      let startY = 0, swipeY = 0;
      const yPos = this.positionValue.split("-")[0];
      el.addEventListener("pointerdown", (e) => {
        startY = e.clientY;
        el.setAttribute("data-swiping", "true");
        el.style.transition = "none";
      });
      el.addEventListener("pointermove", (e) => {
        if (!startY) return;
        const delta = e.clientY - startY;
        if (yPos === "bottom" && delta > 0 || yPos === "top" && delta < 0) {
          swipeY = delta;
          el.style.setProperty("--swipe-amount-y", `${swipeY}px`);
        }
      });
      el.addEventListener("pointerup", () => {
        el.setAttribute("data-swiping", "false");
        el.style.transition = "";
        if (Math.abs(swipeY) > 80) {
          el.setAttribute("data-swipe-out", "true");
          el.setAttribute("data-swipe-direction", swipeY > 0 ? "down" : "up");
          setTimeout(() => this._dismiss(id), 200);
        } else {
          el.style.setProperty("--swipe-amount-y", "0px");
        }
        startY = 0;
        swipeY = 0;
      });
    }
    _getIcon(type) {
      const icons = {
        success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>`,
        error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>`,
        warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"/></svg>`,
        info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>`
      };
      return icons[type] || null;
    }
    _esc(str) {
      const d = document.createElement("div");
      d.textContent = str;
      return d.innerHTML;
    }
    _bindGlobalEvents() {
      this._handlers = {
        "toast:show": (e) => this.show(e),
        "toast:success": (e) => this.success(e),
        "toast:error": (e) => this.error(e),
        "toast:warning": (e) => this.warning(e),
        "toast:info": (e) => this.info(e)
      };
      Object.entries(this._handlers).forEach(([evt, fn]) => document.addEventListener(evt, fn));
    }
    _unbindGlobalEvents() {
      if (!this._handlers) return;
      Object.entries(this._handlers).forEach(([evt, fn]) => document.removeEventListener(evt, fn));
    }
  };

  // app/javascript/controllers/index.js
  registerShadcnControllers(application);
  application.register("toast-trigger", toast_trigger_controller_default);
  application.register("sonner", sonner_controller_default);
})();
/*! Bundled license information:

@hotwired/turbo/dist/turbo.es2017-esm.js:
  (*!
  Turbo 8.0.23
  Copyright © 2026 37signals LLC
   *)
*/
//# sourceMappingURL=application.js.map
