# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Switch
    # Sizes: default, sm
    class Switch < Base
      def initialize(checked: false, size: :default, name: nil, **attrs)
        @checked = checked
        @size = size
        @name = name
        @attrs = attrs
      end

      def view_template(&block)
        label(
          data_controller: "shadcn--switch",
          data_shadcn__switch_checked_value: @checked.to_s,
          class: "inline-flex items-center gap-2 cursor-pointer"
        ) do
          if @name
            input(type: "hidden", name: @name, value: @checked ? "1" : "0", data_shadcn__switch_target: "input")
          end
          button(**build_attrs) do
            span(**thumb_attrs)
          end
          if block
            span(class: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", &block)
          end
        end
      end

      private

      def build_attrs
        classes = cn(
          "peer group/switch inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs",
          "transition-all outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[size=default]:h-[1.15rem] data-[size=default]:w-8",
          "data-[size=sm]:h-3.5 data-[size=sm]:w-6",
          "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          "dark:data-[state=unchecked]:bg-input/80",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "switch",
          data_shadcn__switch_target: "button",
          data_action: "click->shadcn--switch#toggle",
          data_state: @checked ? "checked" : "unchecked",
          data_size: @size,
          role: "switch",
          type: "button",
          aria_checked: @checked,
          class: classes
        )
      end

      def thumb_attrs
        {
          data_slot: "switch-thumb",
          data_shadcn__switch_target: "thumb",
          data_state: @checked ? "checked" : "unchecked",
          class: cn(
            "pointer-events-none block rounded-full bg-background ring-0 transition-transform",
            "group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3",
            "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
            "dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground"
          )
        }
      end
    end
  end
end
