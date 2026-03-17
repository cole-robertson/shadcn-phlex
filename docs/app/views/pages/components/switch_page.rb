# frozen_string_literal: true

module Pages
  module Components
    class SwitchPage < BaseComponentPage
      def initialize
        super(title: "Switch", description: "A control that allows the user to toggle between on and off.")
      end

      def view_template
        preview("Default") do
          ui_switch
        end

        preview("Checked") do
          ui_switch(checked: true)
        end

        preview("With label", description: "Click the label to toggle.") do
          ui_switch(checked: true) { "Airplane Mode" }
        end

        preview("Small size") do
          div(class: "flex items-center gap-4") do
            ui_switch { "Default" }
            ui_switch(size: :sm) { "Small" }
          end
        end

        preview("With form name") do
          ui_switch(name: "notifications", checked: true) { "Enable notifications" }
        end

        code <<~RUBY
          ui_switch
          ui_switch(checked: true) { "Airplane Mode" }
          ui_switch(name: "notifications", checked: true) { "Enable" }
        RUBY
      end
    end
  end
end
