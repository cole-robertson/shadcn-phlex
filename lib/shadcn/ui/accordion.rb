# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Accordion
    # Wired to shadcn--accordion Stimulus controller
    # type: "single" (default) or "multiple"
    # collapsible: true allows closing all items in single mode
    class Accordion < Base
      def initialize(type: "single", collapsible: false, **attrs)
        @type = type
        @collapsible = collapsible
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("w-full", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "accordion",
          data_controller: "shadcn--accordion",
          data_shadcn__accordion_type_value: @type,
          data_shadcn__accordion_collapsible_value: @collapsible,
          class: classes
        )
      end
    end

    class AccordionItem < Base
      def initialize(open: false, **attrs)
        @open = open
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("border-b last:border-b-0", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "accordion-item",
          data_state: @open ? "open" : "closed",
          data_shadcn__accordion_target: "item",
          class: classes
        )
      end
    end

    class AccordionTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        h3(data_slot: "accordion-header", class: "flex") do
          button(**build_attrs) do
            yield if block_given?
            svg(
              xmlns: "http://www.w3.org/2000/svg",
              width: "16", height: "16",
              viewbox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              stroke_width: "2",
              stroke_linecap: "round",
              stroke_linejoin: "round",
              class: "size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
            ) do |s|
              s.path(d: "m6 9 6 6 6-6")
            end
          end
        end
      end

      private

      def build_attrs
        classes = cn(
          "group flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium",
          "transition-all outline-none",
          "hover:underline",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&[data-state=open]>svg]:rotate-180",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "accordion-trigger",
          data_shadcn__accordion_target: "trigger",
          data_action: "click->shadcn--accordion#toggle keydown->shadcn--accordion#keydown",
          type: "button",
          aria_expanded: "false",
          class: classes
        )
      end
    end

    class AccordionContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          div(class: "pb-4 pt-0", &block)
        end
      end

      private

      def build_attrs
        classes = cn(
          "overflow-hidden text-sm",
          "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "accordion-content",
          data_shadcn__accordion_target: "content",
          role: "region",
          hidden: true,
          class: classes
        )
      end
    end
  end
end
