# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Button
    # Variants: default, destructive, outline, secondary, ghost, link
    # Sizes: default, xs, sm, lg, icon, icon_xs, icon_sm, icon_lg
    class Button < Base
      VARIANTS = ClassVariants.build(
        base: [
          "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap",
          "transition-all outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        ].join(" "),
        variants: {
          variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
          },
          size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
            sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9",
            icon_xs: "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
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
