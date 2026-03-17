# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui AlertDialog
    class AlertDialog < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "alert-dialog",
          data_controller: "shadcn--dialog",
          data_shadcn__dialog_close_on_overlay_value: false
        )
      end
    end

    class AlertDialogTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "alert-dialog-trigger",
          data_shadcn__dialog_target: "trigger",
          data_action: "click->shadcn--dialog#show",
          role: "button"
        )
      end
    end

    class AlertDialogOverlay < Base
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
          data_slot: "alert-dialog-overlay",
          data_shadcn__dialog_target: "overlay",
          hidden: true,
          class: classes
        )
      end
    end

    class AlertDialogContent < Base
      def initialize(size: :default, **attrs)
        @size = size
        @attrs = attrs
      end

      def view_template(&block)
        render AlertDialogOverlay.new

        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)]",
          "translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200",
          "data-[size=sm]:max-w-xs",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[size=default]:sm:max-w-lg",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "alert-dialog-content",
          data_shadcn__dialog_target: "content",
          data_size: @size,
          role: "alertdialog",
          hidden: true,
          class: classes
        )
      end
    end

    class AlertDialogHeader < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center",
          "sm:group-data-[size=default]/alert-dialog-content:place-items-start",
          "sm:group-data-[size=default]/alert-dialog-content:text-left",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "alert-dialog-header", class: classes)
      end
    end

    class AlertDialogFooter < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex flex-col-reverse gap-2",
          "group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2",
          "sm:flex-row sm:justify-end",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "alert-dialog-footer", class: classes)
      end
    end

    class AlertDialogTitle < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        h2(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-lg font-semibold", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "alert-dialog-title",
          data_shadcn__dialog_target: "title",
          class: classes
        )
      end
    end

    class AlertDialogDescription < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        p(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm text-muted-foreground", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "alert-dialog-description",
          data_shadcn__dialog_target: "description",
          class: classes
        )
      end
    end

    class AlertDialogAction < Base
      def initialize(variant: :default, size: :default, **attrs)
        @variant = variant
        @size = size
        @attrs = attrs
      end

      def view_template(&block)
        render Button.new(variant: @variant, size: @size, data_slot: "alert-dialog-action", **@attrs, &block)
      end
    end

    class AlertDialogCancel < Base
      def initialize(variant: :outline, size: :default, **attrs)
        @variant = variant
        @size = size
        @attrs = attrs
      end

      def view_template(&block)
        render Button.new(variant: @variant, size: @size, data_slot: "alert-dialog-cancel", data_action: "click->shadcn--dialog#hide", **@attrs, &block)
      end
    end
  end
end
