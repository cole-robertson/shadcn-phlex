# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui RadioGroup
    class RadioGroup < Base
      def initialize(name: nil, value: nil, **attrs)
        @name = name
        @value = value
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          if @name
            input(type: "hidden", name: @name, value: @value.to_s, data_shadcn__radio_group_target: "input")
          end
          yield if block_given?
        end
      end

      private

      def build_attrs
        classes = cn("grid gap-3", @attrs.delete(:class))
        attrs = @attrs.merge(
          data_slot: "radio-group",
          data_controller: "shadcn--radio-group",
          role: "radiogroup",
          class: classes
        )
        attrs[:data_shadcn__radio_group_value_value] = @value.to_s if @value
        attrs
      end
    end

    class RadioGroupItem < Base
      def initialize(value:, checked: false, **attrs)
        @value = value
        @checked = checked
        @attrs = attrs
      end

      def view_template
        button(**build_attrs) do
          span(
            data_shadcn__radio_group_target: "indicator",
            data_value: @value,
            hidden: !@checked,
            class: "relative flex items-center justify-center"
          ) do
            svg(
              xmlns: "http://www.w3.org/2000/svg",
              width: "8", height: "8",
              viewbox: "0 0 24 24",
              fill: "currentColor",
              class: "size-2.5 fill-primary"
            ) do |s|
              s.circle(cx: "12", cy: "12", r: "10")
            end
          end
        end
      end

      private

      def build_attrs
        classes = cn(
          "aspect-square size-4 shrink-0 rounded-full border border-input shadow-xs",
          "transition-shadow outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
          "data-[state=checked]:border-primary",
          "dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "radio-group-item",
          data_shadcn__radio_group_target: "item",
          data_action: "click->shadcn--radio-group#select keydown->shadcn--radio-group#keydown",
          data_state: @checked ? "checked" : "unchecked",
          data_value: @value,
          role: "radio",
          type: "button",
          aria_checked: @checked,
          class: classes
        )
      end
    end
  end
end
