# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui ButtonGroup
    class ButtonGroup < Base
      def initialize(orientation: :horizontal, **attrs)
        @orientation = orientation
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "inline-flex items-center gap-0 -space-x-px shadow-xs",
          "data-[orientation=vertical]:flex-col data-[orientation=vertical]:space-x-0 data-[orientation=vertical]:-space-y-px",
          "[&_[data-slot=button]]:rounded-none [&_[data-slot=button]]:shadow-none",
          "[&_[data-slot=button]:first-child]:rounded-s-md [&_[data-slot=button]:last-child]:rounded-e-md",
          "data-[orientation=vertical]:[&_[data-slot=button]:first-child]:rounded-se-none data-[orientation=vertical]:[&_[data-slot=button]:first-child]:rounded-ss-md",
          "data-[orientation=vertical]:[&_[data-slot=button]:last-child]:rounded-es-md data-[orientation=vertical]:[&_[data-slot=button]:last-child]:rounded-ee-none",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "button-group",
          data_orientation: @orientation,
          role: "group",
          class: classes
        )
      end
    end

    class ButtonGroupText < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        span(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "inline-flex items-center justify-center border px-3 text-sm font-medium",
          "border-input bg-background text-foreground",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "button-group-text", class: classes)
      end
    end
  end
end
