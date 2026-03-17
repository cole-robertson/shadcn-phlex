# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Pagination
    class Pagination < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        nav(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("mx-auto flex w-full justify-center", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "pagination",
          role: "navigation",
          aria_label: "pagination",
          class: classes
        )
      end
    end

    class PaginationContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        ul(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex flex-row items-center gap-1", @attrs.delete(:class))
        @attrs.merge(data_slot: "pagination-content", class: classes)
      end
    end

    class PaginationItem < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        li(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "pagination-item")
      end
    end

    class PaginationLink < Base
      def initialize(href: "#", active: false, size: :icon, **attrs)
        @href = href
        @active = active
        @size = size
        @attrs = attrs
      end

      def view_template(&block)
        a(**build_attrs, &block)
      end

      private

      def build_attrs
        size_class = case @size
        when :icon then "size-9"
        when :default then "h-9 px-4 py-2"
        else "h-9 px-4 py-2"
        end

        classes = cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
          "transition-all cursor-pointer border border-input bg-background shadow-xs",
          "hover:bg-accent hover:text-accent-foreground",
          size_class,
          @active ? "border-primary bg-primary text-primary-foreground" : "",
          @attrs.delete(:class)
        )
        result = @attrs.merge(
          data_slot: "pagination-link",
          href: @href,
          class: classes
        )
        result[:aria_current] = "page" if @active
        result
      end
    end

    class PaginationPrevious < Base
      def initialize(href: "#", **attrs)
        @href = href
        @attrs = attrs
      end

      def view_template(&block)
        a(**build_attrs) do
          svg(
            xmlns: "http://www.w3.org/2000/svg",
            width: "16", height: "16",
            viewbox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            stroke_width: "2",
            stroke_linecap: "round",
            stroke_linejoin: "round",
            class: "size-4"
          ) do |s|
            s.path(d: "m15 18-6-6 6-6")
          end
          span { "Previous" }
        end
      end

      private

      def build_attrs
        classes = cn(
          "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium",
          "h-9 px-4 py-2 cursor-pointer border border-input bg-background shadow-xs",
          "hover:bg-accent hover:text-accent-foreground",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "pagination-previous",
          href: @href,
          aria_label: "Go to previous page",
          class: classes
        )
      end
    end

    class PaginationNext < Base
      def initialize(href: "#", **attrs)
        @href = href
        @attrs = attrs
      end

      def view_template(&block)
        a(**build_attrs) do
          span { "Next" }
          svg(
            xmlns: "http://www.w3.org/2000/svg",
            width: "16", height: "16",
            viewbox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            stroke_width: "2",
            stroke_linecap: "round",
            stroke_linejoin: "round",
            class: "size-4"
          ) do |s|
            s.path(d: "m9 18 6-6-6-6")
          end
        end
      end

      private

      def build_attrs
        classes = cn(
          "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium",
          "h-9 px-4 py-2 cursor-pointer border border-input bg-background shadow-xs",
          "hover:bg-accent hover:text-accent-foreground",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "pagination-next",
          href: @href,
          aria_label: "Go to next page",
          class: classes
        )
      end
    end

    class PaginationEllipsis < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template
        span(**build_attrs) do
          svg(
            xmlns: "http://www.w3.org/2000/svg",
            width: "16", height: "16",
            viewbox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            stroke_width: "2",
            stroke_linecap: "round",
            stroke_linejoin: "round",
            class: "size-4"
          ) do |s|
            s.circle(cx: "12", cy: "12", r: "1")
            s.circle(cx: "19", cy: "12", r: "1")
            s.circle(cx: "5", cy: "12", r: "1")
          end
          span(class: "sr-only") { "More pages" }
        end
      end

      private

      def build_attrs
        classes = cn("flex size-9 items-center justify-center", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "pagination-ellipsis",
          aria_hidden: "true",
          class: classes
        )
      end
    end
  end
end
