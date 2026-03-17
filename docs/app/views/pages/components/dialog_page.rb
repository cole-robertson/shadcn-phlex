# frozen_string_literal: true

module Pages
  module Components
    class DialogPage < BaseComponentPage
      def initialize
        super(title: "Dialog", description: "A modal dialog that interrupts the user with important content.")
      end

      def view_template
        preview("Default") do
          ui_dialog do
            ui_dialog_trigger do
              ui_button { "Open Dialog" }
            end
            ui_dialog_content do
              ui_dialog_header do
                ui_dialog_title { "Edit Profile" }
                ui_dialog_description { "Make changes to your profile here. Click save when you're done." }
              end
              div(class: "flex flex-col gap-4 py-4") do
                ui_text_field(label: "Name", name: "name", placeholder: "John Doe")
                ui_text_field(label: "Username", name: "username", placeholder: "@johndoe")
              end
              ui_dialog_footer do
                ui_dialog_close do
                  ui_button(variant: :outline) { "Cancel" }
                end
                ui_button { "Save changes" }
              end
            end
          end
        end

        code <<~RUBY
          ui_dialog do
            ui_dialog_trigger { ui_button { "Open" } }
            ui_dialog_content do
              ui_dialog_header do
                ui_dialog_title { "Title" }
                ui_dialog_description { "Description" }
              end
              # content here
              ui_dialog_footer do
                ui_dialog_close { ui_button(variant: :outline) { "Cancel" } }
                ui_button { "Confirm" }
              end
            end
          end
        RUBY
      end
    end
  end
end
