# frozen_string_literal: true

module Pages
  module Components
    class ThemeTogglePage < BaseComponentPage
      def initialize
        super(title: "Theme Toggle", description: "A drop-in dark mode toggle button.")
      end

      def view_template
        preview("Default") do
          ui_theme_toggle
        end

        preview("With outline variant") do
          ui_theme_toggle(variant: :outline)
        end

        code <<~RUBY
          ui_theme_toggle
          ui_theme_toggle(variant: :outline)
        RUBY
      end
    end
  end
end
