# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Card
    # Sub-components: Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter
    class Card < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "card", class: classes)
      end
    end

    class CardHeader < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6",
          "has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "card-header", class: classes)
      end
    end

    class CardTitle < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("leading-none font-semibold", @attrs.delete(:class))
        @attrs.merge(data_slot: "card-title", class: classes)
      end
    end

    class CardDescription < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-muted-foreground text-sm", @attrs.delete(:class))
        @attrs.merge(data_slot: "card-description", class: classes)
      end
    end

    class CardAction < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", @attrs.delete(:class))
        @attrs.merge(data_slot: "card-action", class: classes)
      end
    end

    class CardContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("px-6", @attrs.delete(:class))
        @attrs.merge(data_slot: "card-content", class: classes)
      end
    end

    class CardFooter < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex items-center px-6 [.border-t]:pt-6", @attrs.delete(:class))
        @attrs.merge(data_slot: "card-footer", class: classes)
      end
    end
  end
end
