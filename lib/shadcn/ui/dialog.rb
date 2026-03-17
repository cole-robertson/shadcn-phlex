# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Dialog
    # Wired to shadcn--dialog Stimulus controller
    class Dialog < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "dialog",
          data_controller: "shadcn--dialog",
          data_shadcn__dialog_open_value: false
        )
      end
    end

    class DialogTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "dialog-trigger",
          data_shadcn__dialog_target: "trigger",
          data_action: "click->shadcn--dialog#show",
          type: "button"
        )
      end
    end

    class DialogOverlay < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template
        div(**build_attrs)
      end

      private

      def build_attrs
        classes = cn(
          "fixed inset-0 z-50 bg-black/50",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "dialog-overlay",
          data_shadcn__dialog_target: "overlay",
          data_action: "click->shadcn--dialog#clickOverlay",
          hidden: true,
          class: classes
        )
      end
    end

    class DialogContent < Base
      def initialize(show_close_button: true, **attrs)
        @show_close_button = show_close_button
        @attrs = attrs
      end

      def view_template(&block)
        render DialogOverlay.new

        div(**build_attrs) do
          yield if block_given?

          if @show_close_button
            button(
              data_slot: "dialog-close",
              data_shadcn__dialog_target: "close",
              data_action: "click->shadcn--dialog#hide",
              type: "button",
              class: "absolute right-4 top-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            ) do
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
                s.path(d: "M18 6 6 18")
                s.path(d: "m6 6 12 12")
              end
              span(class: "sr-only") { "Close" }
            end
          end
        end
      end

      private

      def build_attrs
        classes = cn(
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%]",
          "gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "sm:max-w-lg",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "dialog-content",
          data_shadcn__dialog_target: "content",
          role: "dialog",
          hidden: true,
          class: classes
        )
      end
    end

    class DialogHeader < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex flex-col gap-2 text-center sm:text-left", @attrs.delete(:class))
        @attrs.merge(data_slot: "dialog-header", class: classes)
      end
    end

    class DialogFooter < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", @attrs.delete(:class))
        @attrs.merge(data_slot: "dialog-footer", class: classes)
      end
    end

    class DialogTitle < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        h2(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-lg font-semibold leading-none tracking-tight", @attrs.delete(:class))
        @attrs.merge(data_slot: "dialog-title", data_shadcn__dialog_target: "title", class: classes)
      end
    end

    class DialogDescription < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        p(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm text-muted-foreground", @attrs.delete(:class))
        @attrs.merge(data_slot: "dialog-description", data_shadcn__dialog_target: "description", class: classes)
      end
    end

    class DialogClose < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "dialog-close",
          data_action: "click->shadcn--dialog#hide",
          type: "button"
        )
      end
    end
  end
end
