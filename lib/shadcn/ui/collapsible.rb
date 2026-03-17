# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Collapsible
    # Uses data-state="open"/"closed" for JS interactivity
    class Collapsible < Base
      def initialize(open: false, **attrs)
        @open = open
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "collapsible",
          data_state: @open ? "open" : "closed",
          data_controller: "shadcn--collapsible",
          data_shadcn__collapsible_open_value: @open
        )
      end
    end

    class CollapsibleTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "collapsible-trigger",
          data_shadcn__collapsible_target: "trigger",
          data_action: "click->shadcn--collapsible#toggle",
          role: "button",
          style: "display: inline-block"
        )
      end
    end

    class CollapsibleContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "overflow-hidden",
          "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "collapsible-content",
          data_shadcn__collapsible_target: "content",
          class: classes
        )
      end
    end
  end
end
