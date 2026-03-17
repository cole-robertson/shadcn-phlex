# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Alert
    # Variants: default, destructive
    class Alert < Base
      VARIANTS = ClassVariants.build(
        base: [
          "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm",
          "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3",
          "[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current"
        ].join(" "),
        variants: {
          variant: {
            default: "bg-card text-card-foreground",
            destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90"
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
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(VARIANTS.render(variant: @variant), @attrs.delete(:class))
        @attrs.merge(data_slot: "alert", role: "alert", class: classes)
      end
    end

    class AlertTitle < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", @attrs.delete(:class))
        @attrs.merge(data_slot: "alert-title", class: classes)
      end
    end

    class AlertDescription < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "alert-description", class: classes)
      end
    end
  end
end
