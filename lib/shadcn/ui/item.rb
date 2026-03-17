# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Item
    # Versatile content display component (media, content, actions)
    class Item < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex items-start gap-3 rounded-lg p-3",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "item", class: classes)
      end
    end

    class ItemMedia < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex shrink-0 items-center justify-center [&_svg]:size-5 [&_svg]:text-muted-foreground",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "item-media", class: classes)
      end
    end

    class ItemContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex min-w-0 flex-1 flex-col gap-1", @attrs.delete(:class))
        @attrs.merge(data_slot: "item-content", class: classes)
      end
    end

    class ItemTitle < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm font-medium leading-none", @attrs.delete(:class))
        @attrs.merge(data_slot: "item-title", class: classes)
      end
    end

    class ItemDescription < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        p(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm text-muted-foreground", @attrs.delete(:class))
        @attrs.merge(data_slot: "item-description", class: classes)
      end
    end

    class ItemActions < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex shrink-0 items-center gap-1", @attrs.delete(:class))
        @attrs.merge(data_slot: "item-actions", class: classes)
      end
    end
  end
end
