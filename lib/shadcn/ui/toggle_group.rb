# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui ToggleGroup
    class ToggleGroup < Base
      def initialize(variant: :default, size: :default, spacing: 1, **attrs)
        @variant = variant
        @size = size
        @spacing = spacing
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        spacing_classes = if @spacing == 0
          "gap-0 -space-x-px [&_[data-slot=toggle]:first-child]:rounded-l-md [&_[data-slot=toggle]:last-child]:rounded-r-md [&_[data-slot=toggle]:not(:first-child):not(:last-child)]:rounded-none"
        else
          "gap-1"
        end

        classes = cn(
          "flex items-center",
          spacing_classes,
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "toggle-group",
          data_variant: @variant,
          data_size: @size,
          data_spacing: @spacing,
          role: "group",
          class: classes
        )
      end
    end

    class ToggleGroupItem < Base
      def initialize(value:, variant: :default, size: :default, pressed: false, **attrs)
        @value = value
        @variant = variant
        @size = size
        @pressed = pressed
        @attrs = attrs
      end

      def view_template(&block)
        render Toggle.new(
          variant: @variant,
          size: @size,
          pressed: @pressed,
          data_value: @value,
          data_slot: "toggle-group-item",
          **@attrs,
          &block
        )
      end
    end
  end
end
