# frozen_string_literal: true

module Pages
  module Components
    class KbdPage < BaseComponentPage
      def initialize
        super(title: "Kbd", description: "Displays a keyboard key or shortcut.")
      end

      def view_template
        preview("Single keys") do
          div(class: "flex items-center gap-3") do
            ui_kbd { "K" }
            ui_kbd { "Enter" }
            ui_kbd { "Tab" }
            ui_kbd { "Shift" }
          end
        end

        preview("Key combinations") do
          div(class: "flex items-center gap-4") do
            ui_kbd_group do
              ui_kbd { "Ctrl" }
              ui_kbd { "C" }
            end
            ui_kbd_group do
              ui_kbd { "Ctrl" }
              ui_kbd { "V" }
            end
            ui_kbd_group do
              ui_kbd { "Cmd" }
              ui_kbd { "K" }
            end
          end
        end

        preview("In context") do
          div(class: "flex items-center gap-2 text-sm text-muted-foreground") do
            plain "Press "
            ui_kbd_group do
              ui_kbd { "Ctrl" }
              ui_kbd { "S" }
            end
            plain " to save"
          end
        end

        code <<~RUBY
          ui_kbd { "K" }

          ui_kbd_group do
            ui_kbd { "Ctrl" }
            ui_kbd { "K" }
          end
        RUBY
      end
    end
  end
end
