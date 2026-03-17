# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Popover
    class Popover < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "popover")
      end
    end

    class PopoverTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "popover-trigger", type: "button")
      end
    end

    class PopoverAnchor < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "popover-anchor")
      end
    end

    class PopoverContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "popover-content", class: classes)
      end
    end

    class PopoverHeader < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex flex-col gap-1", @attrs.delete(:class))
        @attrs.merge(data_slot: "popover-header", class: classes)
      end
    end

    class PopoverTitle < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        h4(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm font-medium leading-none", @attrs.delete(:class))
        @attrs.merge(data_slot: "popover-title", class: classes)
      end
    end

    class PopoverDescription < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        p(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm text-muted-foreground", @attrs.delete(:class))
        @attrs.merge(data_slot: "popover-description", class: classes)
      end
    end
  end
end
