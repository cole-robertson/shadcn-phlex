# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Sonner (Toast container)
    # The JS behavior must be provided by a Stimulus controller or similar
    # This provides the styled markup structure
    class Toaster < Base
      def initialize(position: "bottom-right", **attrs)
        @position = position
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "fixed z-[100] flex max-h-screen flex-col gap-2 p-4",
          position_classes,
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "toaster",
          data_controller: "shadcn--toast",
          data_shadcn__toast_target: "container",
          data_position: @position,
          class: classes
        )
      end

      def position_classes
        case @position
        when "top-left" then "top-0 left-0"
        when "top-center" then "top-0 left-1/2 -translate-x-1/2"
        when "top-right" then "top-0 right-0"
        when "bottom-left" then "bottom-0 left-0"
        when "bottom-center" then "bottom-0 left-1/2 -translate-x-1/2"
        when "bottom-right" then "bottom-0 right-0"
        else "bottom-0 right-0"
        end
      end
    end

    class Toast < Base
      VARIANTS = ClassVariants.build(
        base: [
          "group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden",
          "rounded-md border p-4 pr-6 shadow-lg transition-all",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full data-[state=open]:fade-in-0"
        ].join(" "),
        variants: {
          variant: {
            default: "border bg-background text-foreground",
            success: "border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100",
            error: "border-destructive/50 bg-destructive text-white",
            warning: "border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100",
            info: "border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
          }
        },
        defaults: { variant: :default }
      )

      def initialize(variant: :default, **attrs)
        @variant = variant
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(VARIANTS.render(variant: @variant), @attrs.delete(:class))
        @attrs.merge(data_slot: "toast", data_variant: @variant, role: "alert", class: classes)
      end
    end

    class ToastTitle < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm font-semibold", @attrs.delete(:class))
        @attrs.merge(data_slot: "toast-title", class: classes)
      end
    end

    class ToastDescription < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm opacity-90", @attrs.delete(:class))
        @attrs.merge(data_slot: "toast-description", class: classes)
      end
    end

    class ToastAction < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3",
          "text-sm font-medium transition-colors",
          "hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "toast-action", type: "button", class: classes)
      end
    end

    class ToastClose < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template
        button(**build_attrs) do
          svg(
            xmlns: "http://www.w3.org/2000/svg",
            width: "14", height: "14",
            viewbox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            stroke_width: "2",
            class: "size-4"
          ) do |s|
            s.path(d: "M18 6 6 18")
            s.path(d: "m6 6 12 12")
          end
        end
      end

      private

      def build_attrs
        classes = cn(
          "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity",
          "group-hover:opacity-100",
          "hover:text-foreground focus:opacity-100 focus:outline-none",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "toast-close", type: "button", class: classes)
      end
    end
  end
end
