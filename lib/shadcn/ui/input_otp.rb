# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui InputOTP
    # One-time password input with individual digit boxes
    class InputOTP < Base
      def initialize(max_length: 6, **attrs)
        @max_length = max_length
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex items-center gap-2 has-[:disabled]:opacity-50",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "input-otp",
          data_input_otp_container: true,
          class: classes
        )
      end
    end

    class InputOTPGroup < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex items-center", @attrs.delete(:class))
        @attrs.merge(data_slot: "input-otp-group", class: classes)
      end
    end

    class InputOTPSlot < Base
      def initialize(index: 0, active: false, **attrs)
        @index = index
        @active = active
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          if block_given?
            yield
          else
            # Caret when active
            if @active
              div(class: "pointer-events-none absolute inset-0 flex items-center justify-center") do
                div(class: "h-4 w-px animate-caret-blink bg-foreground duration-1000")
              end
            end
          end
        end
      end

      private

      def build_attrs
        classes = cn(
          "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-xs transition-all",
          "first:rounded-l-md first:border-l last:rounded-r-md",
          @active ? "z-10 ring-2 ring-ring" : "",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "input-otp-slot",
          data_index: @index,
          data_active: @active,
          class: classes
        )
      end
    end

    class InputOTPSeparator < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template
        div(**build_attrs) do
          # Dot separator
          svg(xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16",
              viewbox: "0 0 24 24", fill: "none", stroke: "currentColor",
              stroke_width: "2", class: "size-4") do |s|
            s.circle(cx: "12.1", cy: "12.1", r: "1")
          end
        end
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "input-otp-separator", role: "separator")
      end
    end
  end
end
