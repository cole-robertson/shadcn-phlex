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

        preview("With label") do
          div(class: "flex items-center gap-2") do
            ui_switch(checked: true)
            ui_label { "Airplane Mode" }
          end
        end

        preview("Small size") do
          div(class: "flex items-center gap-3") do
            div(class: "flex items-center gap-2") do
              ui_switch(size: :default)
              ui_label { "Default" }
            end
            div(class: "flex items-center gap-2") do
              ui_switch(size: :sm)
              ui_label { "Small" }
            end
          end
        end

        preview("With form name") do
          div(class: "flex items-center gap-2") do
            ui_switch(name: "notifications", checked: true)
            ui_label { "Enable notifications" }
          end
        end

        code <<~RUBY
          ui_switch
          ui_switch(checked: true, size: :sm)
          ui_switch(name: "dark_mode", checked: false)
        RUBY
      end
    end
  end
end
