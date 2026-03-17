# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Breadcrumb
    class Breadcrumb < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        nav(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "breadcrumb", aria_label: "breadcrumb")
      end
    end

    class BreadcrumbList < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        ol(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "breadcrumb-list", class: classes)
      end
    end

    class BreadcrumbItem < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        li(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("inline-flex items-center gap-1.5", @attrs.delete(:class))
        @attrs.merge(data_slot: "breadcrumb-item", class: classes)
      end
    end

    class BreadcrumbLink < Base
      def initialize(href: "#", **attrs)
        @href = href
        @attrs = attrs
      end

      def view_template(&block)
        a(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("transition-colors hover:text-foreground", @attrs.delete(:class))
        @attrs.merge(data_slot: "breadcrumb-link", href: @href, class: classes)
      end
    end

    class BreadcrumbPage < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        span(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("font-normal text-foreground", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "breadcrumb-page",
          role: "link",
          aria_disabled: "true",
          aria_current: "page",
          class: classes
        )
      end
    end

    class BreadcrumbSeparator < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        li(**build_attrs) do
          if block_given?
            yield
          else
            # Default ChevronRight icon
            svg(
              xmlns: "http://www.w3.org/2000/svg",
              width: "14", height: "14",
              viewbox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              stroke_width: "2",
              stroke_linecap: "round",
              stroke_linejoin: "round",
              class: "size-3.5"
            ) do |s|
              s.path(d: "m9 18 6-6-6-6")
            end
          end
        end
      end

      private

      def build_attrs
        classes = cn("[&>svg]:size-3.5", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "breadcrumb-separator",
          role: "presentation",
          aria_hidden: "true",
          class: classes
        )
      end
    end

    class BreadcrumbEllipsis < Base
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
          span(class: "sr-only") { "More" }
        end
      end

      private

      def build_attrs
        classes = cn("flex size-9 items-center justify-center", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "breadcrumb-ellipsis",
          role: "presentation",
          aria_hidden: "true",
          class: classes
        )
      end
    end
  end
end
