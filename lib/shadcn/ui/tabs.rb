# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Tabs
    # Uses data-state="active" for active tab styling
    class Tabs < Base
      def initialize(orientation: :horizontal, **attrs)
        @orientation = orientation
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "tabs",
          data_orientation: @orientation,
          class: classes
        )
      end
    end

    class TabsList < Base
      VARIANTS = ClassVariants.build(
        base: [
          "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground",
          "group-data-[orientation=horizontal]/tabs:h-9",
          "group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
          "data-[variant=line]:rounded-none"
        ].join(" "),
        variants: {
          variant: {
            default: "bg-muted",
            line: "gap-1 bg-transparent"
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
        @attrs.merge(
          data_slot: "tabs-list",
          data_variant: @variant,
          role: "tablist",
          class: classes
        )
      end
    end

    class TabsTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5",
          "rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap",
          "text-foreground/60 transition-all",
          "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
          "hover:text-foreground",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
          "dark:text-muted-foreground dark:hover:text-foreground",
          "dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "tabs-trigger",
          role: "tab",
          type: "button",
          class: classes
        )
      end
    end

    class TabsContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex-1 outline-none", @attrs.delete(:class))
        @attrs.merge(data_slot: "tabs-content", role: "tabpanel", class: classes)
      end
    end
  end
end
