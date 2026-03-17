# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Progress
    class Progress < Base
      def initialize(value: 0, **attrs)
        @value = value.to_i.clamp(0, 100)
        @attrs = attrs
      end

      def view_template
        div(**build_attrs) do
          div(
            data_slot: "progress-indicator",
            class: "h-full w-full flex-1 bg-primary transition-all",
            style: "transform: translateX(-#{100 - @value}%)"
          )
        end
      end

      private

      def build_attrs
        classes = cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "progress",
          role: "progressbar",
          aria_valuemin: 0,
          aria_valuemax: 100,
          aria_valuenow: @value,
          class: classes
        )
      end
    end
  end
end
