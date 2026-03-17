# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Tabs
    # Wired to shadcn--tabs Stimulus controller
    class Tabs < Base
      def initialize(value: nil, orientation: :horizontal, **attrs)
        @value = value
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
        result = @attrs.merge(
          data_slot: "tabs",
          data_orientation: @orientation,
          data_controller: "shadcn--tabs",
          data_shadcn__tabs_orientation_value: @orientation,
          class: classes
        )
        result[:data_shadcn__tabs_value_value] = @value if @value
        result
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
          data_shadcn__tabs_target: "list",
          role: "tablist",
          class: classes
        )
      end
    end

    class TabsTrigger < Base
      def initialize(value:, **attrs)
        @value = value
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          # Base
          "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5",
          "rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap",
          "text-foreground/60 transition-all",
          "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
          "hover:text-foreground",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          # Default variant active state
          "group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm",
          "group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none",
          "dark:text-muted-foreground dark:hover:text-foreground",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          # Line variant overrides
          "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
          "dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
          # Active state
          "data-[state=active]:bg-background data-[state=active]:text-foreground",
          "dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground",
          # After pseudo-element (line indicator)
          "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity",
          "group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5",
          "group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5",
          "group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "tabs-trigger",
          data_value: @value,
          data_shadcn__tabs_target: "trigger",
          data_action: "click->shadcn--tabs#select keydown->shadcn--tabs#keydown",
          role: "tab",
          type: "button",
          class: classes
        )
      end
    end

    class TabsContent < Base
      def initialize(value:, **attrs)
        @value = value
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex-1 outline-none", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "tabs-content",
          data_value: @value,
          data_shadcn__tabs_target: "content",
          role: "tabpanel",
          hidden: true,
          class: classes
        )
      end
    end
  end
end
