# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Spinner
    class Spinner < Base
      def initialize(size: :default, **attrs)
        @size = size
        @attrs = attrs
      end

      def view_template
        span(**build_attrs) do
          # Animated loader SVG (Lucide Loader2 equivalent)
          svg(
            xmlns: "http://www.w3.org/2000/svg",
            width: "24", height: "24",
            viewbox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            stroke_width: "2",
            stroke_linecap: "round",
            stroke_linejoin: "round",
            class: cn("animate-spin", size_class)
          ) do |s|
            s.path(d: "M21 12a9 9 0 1 1-6.219-8.56")
          end
          span(class: "sr-only") { "Loading..." }
        end
      end

      private

      def build_attrs
        classes = cn(
          "inline-flex items-center justify-center text-muted-foreground",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "spinner",
          role: "status",
          aria_label: "Loading",
          class: classes
        )
      end

      def size_class
        case @size
        when :xs then "size-3"
        when :sm then "size-4"
        when :default then "size-5"
        when :lg then "size-8"
        else "size-5"
        end
      end
    end
  end
end
