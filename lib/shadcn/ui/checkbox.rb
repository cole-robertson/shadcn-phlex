# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Checkbox
    class Checkbox < Base
      def initialize(checked: false, name: nil, **attrs)
        @checked = checked
        @name = name
        @attrs = attrs
      end

      def view_template
        span(data_controller: "shadcn--checkbox") do
        if @name
          input(type: "hidden", name: @name, value: @checked ? "1" : "0", data_shadcn__checkbox_target: "input")
        end
        button(**build_attrs) do
          if @checked
            span(
              data_slot: "checkbox-indicator",
              class: "grid place-content-center text-current transition-none"
            ) do
              svg(
                xmlns: "http://www.w3.org/2000/svg",
                width: "14", height: "14",
                viewbox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                stroke_width: "2",
                stroke_linecap: "round",
                stroke_linejoin: "round",
                class: "size-3.5"
              ) do |s|
                s.path(d: "M20 6 9 17l-5-5")
              end
            end
          end
        end
        end
      end

      private

      def build_attrs
        classes = cn(
          "peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs",
          "transition-shadow outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          "dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "checkbox",
          data_shadcn__checkbox_target: "button",
          data_action: "click->shadcn--checkbox#toggle",
          data_state: @checked ? "checked" : "unchecked",
          role: "checkbox",
          type: "button",
          aria_checked: @checked,
          class: classes
        )
      end
    end
  end
end
