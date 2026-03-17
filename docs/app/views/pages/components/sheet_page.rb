# frozen_string_literal: true

module Pages
  module Components
    class SheetPage < BaseComponentPage
      def initialize
        super(title: "Sheet", description: "Extends the Dialog component to display content that complements the main content.")
      end

      def view_template
        preview("Right side") do
          ui_sheet do
            ui_sheet_trigger do
              ui_button(variant: :outline) { "Open Sheet" }
            end
            ui_sheet_content(side: :right) do
              ui_sheet_header do
                ui_sheet_title { "Edit Profile" }
                ui_sheet_description { "Make changes to your profile here. Click save when you're done." }
              end
              div(class: "flex flex-col gap-4 py-4") do
                ui_text_field(label: "Name", name: "name", placeholder: "John Doe")
                ui_text_field(label: "Username", name: "username", placeholder: "@johndoe")
              end
              ui_sheet_footer do
                ui_sheet_close do
                  ui_button(variant: :outline) { "Cancel" }
                end
                ui_button { "Save changes" }
              end
            end
          end
        end

        preview("Left side") do
          ui_sheet do
            ui_sheet_trigger do
              ui_button(variant: :outline) { "Open Left Sheet" }
            end
            ui_sheet_content(side: :left) do
              ui_sheet_header do
                ui_sheet_title { "Navigation" }
                ui_sheet_description { "Browse sections of the application." }
              end
              div(class: "py-4 space-y-2 text-sm") do
                p { "Dashboard" }
                p { "Projects" }
                p { "Settings" }
              end
            end
          end
        end

        code <<~RUBY
          ui_sheet do
            ui_sheet_trigger { ui_button { "Open" } }
            ui_sheet_content(side: :right) do
              ui_sheet_header do
                ui_sheet_title { "Title" }
                ui_sheet_description { "Description" }
              end
              # content here
              ui_sheet_footer do
                ui_button { "Save" }
              end
            end
          end
        RUBY
      end
    end
  end
end
