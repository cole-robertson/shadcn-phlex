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
            ui_dialog_trigger(class: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90") do
              plain "Open Dialog"
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
                ui_dialog_close(class: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground") do
                  plain "Cancel"
                end
                ui_button { "Save changes" }
              end
            end
          end
        end

        code <<~RUBY
          ui_dialog do
            ui_dialog_trigger { "Open" }
            ui_dialog_content do
              ui_dialog_header do
                ui_dialog_title { "Title" }
                ui_dialog_description { "Description" }
              end
              # content here
              ui_dialog_footer do
                ui_dialog_close { "Cancel" }
                ui_button { "Confirm" }
              end
            end
          end
        RUBY
      end
    end
  end
end
