# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Combobox
    # Searchable select with filtering
    # Wired to shadcn--combobox Stimulus controller
    class Combobox < Base
      def initialize(name: nil, **attrs)
        @name = name
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          if @name
            input(type: "hidden", name: @name, value: "", data_shadcn__combobox_target: "hiddenInput")
          end
          yield if block_given?
        end
      end

      private

      def build_attrs
        classes = cn("relative", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "combobox",
          data_controller: "shadcn--combobox",
          data_action: "click@window->shadcn--combobox#hide keydown.esc@window->shadcn--combobox#hideOnEscape",
          class: classes
        )
      end
    end

    class ComboboxTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs) do
          yield if block_given?
          # ChevronsUpDown icon
          svg(xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16",
              viewbox: "0 0 24 24", fill: "none", stroke: "currentColor",
              stroke_width: "2", class: "ml-2 size-4 shrink-0 opacity-50") do |s|
            s.path(d: "m7 15 5 5 5-5")
            s.path(d: "m7 9 5-5 5 5")
          end
        end
      end

      private

      def build_attrs
        classes = cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3",
          "text-sm shadow-xs transition-[color,box-shadow] outline-none whitespace-nowrap",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-input/30",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "combobox-trigger",
          data_action: "click->shadcn--combobox#toggle",
          type: "button",
          role: "combobox",
          class: classes
        )
      end
    end

    class ComboboxValue < Base
      def initialize(placeholder: "Select...", **attrs)
        @placeholder = placeholder
        @attrs = attrs
      end

      def view_template(&block)
        span(**build_attrs) do
          if block_given?
            yield
          else
            plain @placeholder
          end
        end
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "combobox-value",
          data_shadcn__combobox_target: "value"
        )
      end
    end

    class ComboboxContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "combobox-content",
          data_shadcn__combobox_target: "content",
          hidden: true,
          class: classes
        )
      end
    end

    class ComboboxInput < Base
      def initialize(placeholder: "Search...", **attrs)
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
          data_slot: "combobox-input",
          data_shadcn__combobox_target: "input",
          data_action: "input->shadcn--combobox#filter keydown->shadcn--combobox#keydown",
          type: "text",
          placeholder: @placeholder,
          class: classes
        )
      end
    end

    class ComboboxEmpty < Base
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
        classes = cn("py-6 text-center text-sm text-muted-foreground", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "combobox-empty",
          data_shadcn__combobox_target: "empty",
          hidden: true,
          class: classes
        )
      end
    end

    class ComboboxItem < Base
      def initialize(value:, **attrs)
        @value = value
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
          "outline-hidden select-none",
          "data-[state=checked]:font-medium",
          "hover:bg-accent hover:text-accent-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "combobox-item",
          data_shadcn__combobox_target: "item",
          data_action: "click->shadcn--combobox#selectItem",
          data_value: @value,
          tabindex: "-1",
          class: classes
        )
      end
    end
  end
end
