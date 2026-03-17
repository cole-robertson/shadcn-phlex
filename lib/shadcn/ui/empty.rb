# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Empty state
    class Empty < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "empty", class: classes)
      end
    end

    class EmptyMedia < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex items-center justify-center [&_svg]:size-12 [&_svg]:text-muted-foreground",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "empty-media", class: classes)
      end
    end

    class EmptyTitle < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        h3(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-lg font-semibold", @attrs.delete(:class))
        @attrs.merge(data_slot: "empty-title", class: classes)
      end
    end

    class EmptyDescription < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        p(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm text-muted-foreground max-w-sm", @attrs.delete(:class))
        @attrs.merge(data_slot: "empty-description", class: classes)
      end
    end

    class EmptyActions < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex items-center gap-2", @attrs.delete(:class))
        @attrs.merge(data_slot: "empty-actions", class: classes)
      end
    end
  end
end
