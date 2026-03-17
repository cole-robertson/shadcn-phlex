# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Field
    # Form field composition: label, control, description, error message
    class Field < Base
      def initialize(disabled: false, **attrs)
        @disabled = disabled
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "group/field grid gap-2",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "field",
          data_disabled: @disabled || nil,
          class: classes
        )
      end
    end

    class FieldControl < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "field-control")
      end
    end

    class FieldDescription < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        p(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-muted-foreground text-sm", @attrs.delete(:class))
        @attrs.merge(data_slot: "field-description", class: classes)
      end
    end

    class FieldError < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        p(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-destructive text-sm font-medium", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "field-error",
          role: "alert",
          class: classes
        )
      end
    end

    class Fieldset < Base
      def initialize(disabled: false, **attrs)
        @disabled = disabled
        @attrs = attrs
      end

      def view_template(&block)
        fieldset(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "grid gap-6 rounded-lg border p-4 disabled:opacity-50",
          @attrs.delete(:class)
        )
        result = @attrs.merge(data_slot: "fieldset", class: classes)
        result[:disabled] = true if @disabled
        result
      end
    end

    class FieldsetLegend < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        legend(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm font-medium leading-none", @attrs.delete(:class))
        @attrs.merge(data_slot: "fieldset-legend", class: classes)
      end
    end
  end
end
