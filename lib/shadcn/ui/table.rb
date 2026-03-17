# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Table
    class Table < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(data_slot: "table-container", class: "relative w-full overflow-x-auto") do
          table(**build_attrs, &block)
        end
      end

      private

      def build_attrs
        classes = cn("w-full caption-bottom text-sm", @attrs.delete(:class))
        @attrs.merge(data_slot: "table", class: classes)
      end
    end

    class TableHeader < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        thead(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("[&_tr]:border-b", @attrs.delete(:class))
        @attrs.merge(data_slot: "table-header", class: classes)
      end
    end

    class TableBody < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        tbody(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("[&_tr:last-child]:border-0", @attrs.delete(:class))
        @attrs.merge(data_slot: "table-body", class: classes)
      end
    end

    class TableFooter < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        tfoot(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", @attrs.delete(:class))
        @attrs.merge(data_slot: "table-footer", class: classes)
      end
    end

    class TableRow < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        tr(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "table-row", class: classes)
      end
    end

    class TableHead < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        th(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "text-muted-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap",
          "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "table-head", class: classes)
      end
    end

    class TableCell < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        td(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "table-cell", class: classes)
      end
    end

    class TableCaption < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        caption(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-muted-foreground mt-4 text-sm", @attrs.delete(:class))
        @attrs.merge(data_slot: "table-caption", class: classes)
      end
    end
  end
end
