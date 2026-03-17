# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Command (cmdk-style command palette)
    # Wired to shadcn--command Stimulus controller
    class Command < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "command",
          data_controller: "shadcn--command",
          class: classes
        )
      end
    end

    class CommandDialog < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        # Overlay
        div(
          data_slot: "command-overlay",
          data_shadcn__command_target: "overlay",
          data_action: "click->shadcn--command#clickOverlay",
          class: "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
          hidden: true
        )

        # Dialog
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "fixed top-[50%] left-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
          "overflow-hidden rounded-lg border bg-popover p-0 shadow-lg",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "command-dialog",
          data_shadcn__command_target: "dialog",
          hidden: true,
          class: classes
        )
      end
    end

    class CommandInput < Base
      def initialize(placeholder: "Type a command or search...", **attrs)
        @placeholder = placeholder
        @attrs = attrs
      end

      def view_template
        div(class: "flex items-center border-b px-3") do
          svg(xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16",
              viewbox: "0 0 24 24", fill: "none", stroke: "currentColor",
              stroke_width: "2", class: "mr-2 size-4 shrink-0 opacity-50") do |s|
            s.circle(cx: "11", cy: "11", r: "8")
            s.path(d: "m21 21-4.3-4.3")
          end
          input(**build_attrs)
        end
      end

      private

      def build_attrs
        classes = cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none",
          "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "command-input",
          data_shadcn__command_target: "input",
          data_action: "input->shadcn--command#filter",
          type: "text",
          placeholder: @placeholder,
          class: classes
        )
      end
    end

    class CommandList < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "max-h-[300px] overflow-y-auto overflow-x-hidden",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "command-list",
          data_shadcn__command_target: "list",
          class: classes
        )
      end
    end

    class CommandEmpty < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          if block_given?
            yield
          else
            plain "No results found."
          end
        end
      end

      private

      def build_attrs
        classes = cn("py-6 text-center text-sm", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "command-empty",
          data_shadcn__command_target: "empty",
          hidden: true,
          class: classes
        )
      end
    end

    class CommandGroup < Base
      def initialize(heading: nil, **attrs)
        @heading = heading
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          if @heading
            div(
              data_slot: "command-group-heading",
              class: "px-2 py-1.5 text-xs font-medium text-muted-foreground"
            ) { @heading }
          end
          div(data_slot: "command-group-items", class: "p-1", &block)
        end
      end

      private

      def build_attrs
        classes = cn(
          "overflow-hidden text-foreground [&_[data-slot=command-group-heading]]:px-2 [&_[data-slot=command-group-heading]]:py-1.5 [&_[data-slot=command-group-heading]]:text-xs [&_[data-slot=command-group-heading]]:font-medium [&_[data-slot=command-group-heading]]:text-muted-foreground",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "command-group",
          data_shadcn__command_target: "group",
          class: classes
        )
      end
    end

    class CommandItem < Base
      def initialize(value: nil, **attrs)
        @value = value
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
          "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
          "hover:bg-accent hover:text-accent-foreground",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "command-item",
          data_shadcn__command_target: "item",
          data_action: "click->shadcn--command#selectItem",
          data_value: @value,
          tabindex: "-1",
          class: classes
        )
      end
    end

    class CommandSeparator < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template
        div(**build_attrs)
      end

      private

      def build_attrs
        classes = cn("-mx-1 h-px bg-border", @attrs.delete(:class))
        @attrs.merge(data_slot: "command-separator", class: classes)
      end
    end

    class CommandShortcut < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        span(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("ml-auto text-xs tracking-widest text-muted-foreground", @attrs.delete(:class))
        @attrs.merge(data_slot: "command-shortcut", class: classes)
      end
    end
  end
end
