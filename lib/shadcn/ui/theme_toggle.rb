# frozen_string_literal: true

module Shadcn
  module UI
    # Dark mode toggle button
    # Wired to shadcn--dark-mode Stimulus controller
    # Renders a button with sun/moon SVG icons that swap based on dark mode state
    class ThemeToggle < Base
      def initialize(variant: :ghost, size: :icon, **attrs)
        @variant = variant
        @size = size
        @attrs = attrs
      end

      def view_template(&block)
        div(
          data_controller: "shadcn--dark-mode",
          data_shadcn__dark_mode_mode_value: "system"
        ) do
          render Button.new(
            variant: @variant,
            size: @size,
            data_action: "click->shadcn--dark-mode#toggle",
            **@attrs
          ) do
            if block_given?
              yield
            else
              # Sun icon (visible in dark mode, triggers switch to light)
              svg(
                xmlns: "http://www.w3.org/2000/svg",
                width: "16", height: "16",
                viewbox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                stroke_width: "2",
                stroke_linecap: "round",
                stroke_linejoin: "round",
                class: "size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              ) do |s|
                s.circle(cx: "12", cy: "12", r: "4")
                s.path(d: "M12 2v2")
                s.path(d: "M12 20v2")
                s.path(d: "m4.93 4.93 1.41 1.41")
                s.path(d: "m17.66 17.66 1.41 1.41")
                s.path(d: "M2 12h2")
                s.path(d: "M20 12h2")
                s.path(d: "m6.34 17.66-1.41 1.41")
                s.path(d: "m19.07 4.93-1.41 1.41")
              end

              # Moon icon (visible in light mode, triggers switch to dark)
              svg(
                xmlns: "http://www.w3.org/2000/svg",
                width: "16", height: "16",
                viewbox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                stroke_width: "2",
                stroke_linecap: "round",
                stroke_linejoin: "round",
                class: "absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              ) do |s|
                s.path(d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z")
              end

              span(class: "sr-only") { "Toggle theme" }
            end
          end
        end
      end
    end
  end
end
