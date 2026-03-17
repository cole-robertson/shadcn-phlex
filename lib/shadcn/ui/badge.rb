# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Badge
    # Variants: default, secondary, destructive, outline, ghost, link
    class Badge < Base
      VARIANTS = ClassVariants.build(
        base: [
          "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0",
          "transition-[color,box-shadow]",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3"
        ].join(" "),
        variants: {
          variant: {
            default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
            secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
            destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
            outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            ghost: "border-transparent [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            link: "border-transparent text-primary underline-offset-4 [a&]:hover:underline"
          }
        },
        defaults: {
          variant: :default
        }
      )

      def initialize(variant: :default, **attrs)
        @variant = variant
        @attrs = attrs
      end

      def view_template(&block)
        span(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(VARIANTS.render(variant: @variant), @attrs.delete(:class))
        @attrs.merge(data_slot: "badge", class: classes)
      end
    end
  end
end
