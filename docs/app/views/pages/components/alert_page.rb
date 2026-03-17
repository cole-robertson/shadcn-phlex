# frozen_string_literal: true

module Pages
  module Components
    class AlertPage < BaseComponentPage
      def initialize
        super(title: "Alert", description: "Displays a callout for important information.")
      end

      def view_template
        preview("Default") do
          ui_alert do
            ui_alert_title { "Heads up!" }
            ui_alert_description { "You can add components to your app using the CLI." }
          end
        end

        preview("Destructive") do
          ui_alert(variant: :destructive) do
            ui_alert_title { "Error" }
            ui_alert_description { "Your session has expired. Please log in again." }
          end
        end

        preview("Title only") do
          ui_alert do
            ui_alert_title { "Note: This action cannot be undone." }
          end
        end

        code <<~RUBY
          ui_alert(variant: :default) do
            ui_alert_title { "Heads up!" }
            ui_alert_description { "Description text here." }
          end

          ui_alert(variant: :destructive) do
            ui_alert_title { "Error" }
            ui_alert_description { "Something went wrong." }
          end
        RUBY
      end
    end
  end
end
