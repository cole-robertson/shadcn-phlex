# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Toggle
    # Variants: default, outline
    # Sizes: default, sm, lg
    class Toggle < Base
      VARIANTS = ClassVariants.build(
        base: [
          "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap",
          "transition-[color,box-shadow] outline-none",
          "hover:bg-muted hover:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        ].join(" "),
        variants: {
          variant: {
            default: "bg-transparent",
            outline: "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground"
          },
          size: {
            default: "h-9 px-2 min-w-9",
            sm: "h-8 px-1.5 min-w-8",
            lg: "h-10 px-2.5 min-w-10"
          }
        },
        defaults: {
          variant: :default,
          size: :default
        }
      )

      def initialize(variant: :default, size: :default, pressed: false, **attrs)
        @variant = variant
        @size = size
        @pressed = pressed
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(VARIANTS.render(variant: @variant, size: @size), @attrs.delete(:class))
        @attrs.merge(
          data_slot: "toggle",
          data_controller: "shadcn--toggle",
          data_shadcn__toggle_target: "button",
          data_action: "click->shadcn--toggle#toggle",
          data_shadcn__toggle_pressed_value: @pressed,
          data_state: @pressed ? "on" : "off",
          type: "button",
          aria_pressed: @pressed,
          class: classes
        )
      end
    end
  end
end
