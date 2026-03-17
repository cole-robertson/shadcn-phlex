# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Select
    class Select < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "select")
      end
    end

    class SelectTrigger < Base
      def initialize(size: :default, **attrs)
        @size = size
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs) do
          yield if block_given?
          # ChevronDown icon
          svg(
            xmlns: "http://www.w3.org/2000/svg",
            width: "16", height: "16",
            viewbox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            stroke_width: "2",
            stroke_linecap: "round",
            stroke_linejoin: "round",
            class: "size-4 opacity-50 shrink-0"
          ) do |s|
            s.path(d: "m6 9 6 6 6-6")
          end
        end
      end

      private

      def build_attrs
        size_classes = @size == :sm ? "h-8" : "h-9 py-2"

        classes = cn(
          "border-input data-[placeholder]:text-muted-foreground [&_svg]:text-muted-foreground",
          "flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3",
          "text-sm whitespace-nowrap shadow-xs ring-offset-background",
          "transition-[color,box-shadow] outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
          "dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          size_classes,
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "select-trigger",
          type: "button",
          role: "combobox",
          class: classes
        )
      end
    end

    class SelectValue < Base
      def initialize(placeholder: nil, **attrs)
        @placeholder = placeholder
        @attrs = attrs
      end

      def view_template(&block)
        span(**build_attrs) do
          if block_given?
            yield
          elsif @placeholder
            plain @placeholder
          end
        end
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "select-value")
      end
    end

    class SelectContent < Base
      def initialize(position: :popper, **attrs)
        @position = position
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        popper_classes = @position == :popper ?
          "max-h-[min(var(--radix-select-content-available-height),24rem)]" : ""

        classes = cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          popper_classes,
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "select-content", data_position: @position, role: "listbox", class: classes)
      end
    end

    class SelectItem < Base
      def initialize(value:, **attrs)
        @value = value
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          span(class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center") do
            # Check icon rendered when selected via data-state
          end
          yield if block_given?
        end
      end

      private

      def build_attrs
        classes = cn(
          "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm",
          "outline-hidden select-none",
          "focus:bg-accent focus:text-accent-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "select-item",
          data_value: @value,
          role: "option",
          class: classes
        )
      end
    end

    class SelectGroup < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "select-group", role: "group")
      end
    end

    class SelectLabel < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("px-2 py-1.5 text-sm font-medium", @attrs.delete(:class))
        @attrs.merge(data_slot: "select-label", class: classes)
      end
    end

    class SelectSeparator < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template
        div(**build_attrs)
      end

      private

      def build_attrs
        classes = cn("-mx-1 my-1 h-px bg-muted", @attrs.delete(:class))
        @attrs.merge(data_slot: "select-separator", class: classes)
      end
    end
  end
end
