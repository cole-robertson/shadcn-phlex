# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui ContextMenu
    class ContextMenu < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "context-menu",
          data_controller: "shadcn--context-menu"
        )
      end
    end

    class ContextMenuTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "context-menu-trigger",
          data_shadcn__context_menu_target: "trigger"
        )
      end
    end

    class ContextMenuContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "z-50 max-h-[var(--radix-context-menu-content-available-height)] min-w-[8rem]",
          "overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "context-menu-content",
          data_shadcn__context_menu_target: "content",
          role: "menu",
          hidden: true,
          class: classes
        )
      end
    end

    class ContextMenuItem < Base
      def initialize(inset: false, variant: :default, **attrs)
        @inset = inset
        @variant = variant
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
          "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          "data-[inset]:pl-8",
          "data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive",
          "dark:data-[variant=destructive]:focus:bg-destructive/20",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          "[&_svg:not([class*='text-'])]:text-muted-foreground",
          @attrs.delete(:class)
        )
        result = @attrs.merge(
          data_slot: "context-menu-item",
          data_shadcn__context_menu_target: "item",
          data_action: "click->shadcn--context-menu#selectItem",
          data_variant: @variant,
          role: "menuitem",
          tabindex: "-1",
          class: classes
        )
        result[:data_inset] = true if @inset
        result
      end
    end

    class ContextMenuCheckboxItem < Base
      def initialize(checked: false, **attrs)
        @checked = checked
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          span(class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center") do
            if @checked
              svg(
                xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16",
                viewbox: "0 0 24 24", fill: "none", stroke: "currentColor",
                stroke_width: "2", class: "size-4"
              ) { |s| s.path(d: "M20 6 9 17l-5-5") }
            end
          end
          yield if block_given?
        end
      end

      private

      def build_attrs
        classes = cn(
          "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm",
          "outline-hidden select-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "context-menu-checkbox-item",
          role: "menuitemcheckbox",
          aria_checked: @checked,
          class: classes
        )
      end
    end

    class ContextMenuRadioGroup < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "context-menu-radio-group", role: "group")
      end
    end

    class ContextMenuRadioItem < Base
      def initialize(checked: false, **attrs)
        @checked = checked
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          span(class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center") do
            if @checked
              svg(
                xmlns: "http://www.w3.org/2000/svg", width: "8", height: "8",
                viewbox: "0 0 24 24", fill: "currentColor", class: "size-2"
              ) { |s| s.circle(cx: "12", cy: "12", r: "10") }
            end
          end
          yield if block_given?
        end
      end

      private

      def build_attrs
        classes = cn(
          "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm",
          "outline-hidden select-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "context-menu-radio-item",
          role: "menuitemradio",
          aria_checked: @checked,
          class: classes
        )
      end
    end

    class ContextMenuLabel < Base
      def initialize(inset: false, **attrs)
        @inset = inset
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("px-2 py-1.5 text-sm font-medium text-foreground data-[inset]:pl-8", @attrs.delete(:class))
        result = @attrs.merge(data_slot: "context-menu-label", class: classes)
        result[:data_inset] = true if @inset
        result
      end
    end

    class ContextMenuSeparator < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template
        div(**build_attrs)
      end

      private

      def build_attrs
        classes = cn("-mx-1 my-1 h-px bg-border", @attrs.delete(:class))
        @attrs.merge(data_slot: "context-menu-separator", role: "separator", class: classes)
      end
    end

    class ContextMenuShortcut < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        span(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("ml-auto text-xs tracking-widest text-muted-foreground", @attrs.delete(:class))
        @attrs.merge(data_slot: "context-menu-shortcut", class: classes)
      end
    end

    class ContextMenuSubTrigger < Base
      def initialize(inset: false, **attrs)
        @inset = inset
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          yield if block_given?
          svg(
            xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16",
            viewbox: "0 0 24 24", fill: "none", stroke: "currentColor",
            stroke_width: "2", class: "ml-auto size-4"
          ) { |s| s.path(d: "m9 18 6-6-6-6") }
        end
      end

      private

      def build_attrs
        classes = cn(
          "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
          "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
          "data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          "[&_svg:not([class*='text-'])]:text-muted-foreground",
          @attrs.delete(:class)
        )
        result = @attrs.merge(data_slot: "context-menu-sub-trigger", class: classes)
        result[:data_inset] = true if @inset
        result
      end
    end

    class ContextMenuSubContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "context-menu-sub-content", class: classes)
      end
    end
  end
end
