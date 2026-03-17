# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Button
    # Variants: default, destructive, outline, secondary, ghost, link
    # Sizes: default, xs, sm, lg, icon, icon_xs, icon_sm, icon_lg
    class Button < Base
      VARIANTS = ClassVariants.build(
        base: [
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
          "transition-all cursor-pointer",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        ].join(" "),
        variants: {
          variant: {
            default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
            destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
          },
          size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            xs: "h-7 gap-1 rounded-md px-2 has-[>svg]:px-1.5",
            sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9",
            icon_xs: "size-7 rounded-md",
            icon_sm: "size-8 rounded-md",
            icon_lg: "size-10 rounded-md"
          }
        },
        defaults: {
          variant: :default,
          size: :default
        }
      )

      def initialize(variant: :default, size: :default, tag: :button, **attrs)
        @variant = variant
        @size = size
        @tag = tag
        @attrs = attrs
      end

      def view_template(&block)
        send(@tag, **build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(VARIANTS.render(variant: @variant, size: @size), @attrs.delete(:class))
        @attrs.merge(data_slot: "button", class: classes)
      end
    end
  end
end
