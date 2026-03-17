# frozen_string_literal: true

module Pages
  module Components
    class AlertDialogPage < BaseComponentPage
      def initialize
        super(title: "Alert Dialog", description: "A modal dialog that interrupts the user with important content and expects a response.")
      end

      def view_template
        preview("Default") do
          ui_alert_dialog do
            ui_alert_dialog_trigger(class: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90") do
              plain "Delete Account"
            end
            ui_alert_dialog_content do
              ui_alert_dialog_header do
                ui_alert_dialog_title { "Are you absolutely sure?" }
                ui_alert_dialog_description { "This action cannot be undone. This will permanently delete your account and remove your data from our servers." }
              end
              ui_alert_dialog_footer do
                ui_alert_dialog_cancel { "Cancel" }
                ui_alert_dialog_action { "Yes, delete account" }
              end
            end
          end
        end

        code <<~RUBY
          ui_alert_dialog do
            ui_alert_dialog_trigger { "Delete Account" }
            ui_alert_dialog_content do
              ui_alert_dialog_header do
                ui_alert_dialog_title { "Are you sure?" }
                ui_alert_dialog_description { "This action cannot be undone." }
              end
              ui_alert_dialog_footer do
                ui_alert_dialog_cancel { "Cancel" }
                ui_alert_dialog_action { "Continue" }
              end
            end
          end
        RUBY
      end
    end
  end
end
