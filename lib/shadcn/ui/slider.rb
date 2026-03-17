# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Slider
    class Slider < Base
      def initialize(value: 0, min: 0, max: 100, **attrs)
        @value = value
        @min = min
        @max = max
        @attrs = attrs
      end

      def view_template
        span(**build_attrs) do
          span(
            data_slot: "slider-track",
            class: "relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
          ) do
            pct = ((@value.to_f - @min) / (@max - @min) * 100).clamp(0, 100)
            span(
              data_slot: "slider-range",
              class: "absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
              style: "width: #{pct}%"
            )
          end

          span(
            data_slot: "slider-thumb",
            class: "block size-4 shrink-0 rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
            role: "slider",
            aria_valuemin: @min,
            aria_valuemax: @max,
            aria_valuenow: @value
          )
        end
      end

      private

      def build_attrs
        classes = cn(
          "relative flex w-full touch-none items-center select-none",
          "data-[disabled]:opacity-50",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "slider", class: classes)
      end
    end
  end
end
