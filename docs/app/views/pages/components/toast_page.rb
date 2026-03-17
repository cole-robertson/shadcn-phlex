# frozen_string_literal: true

module Pages
  module Components
    class ToastPage < BaseComponentPage
      def initialize
        super(title: "Toast (Sonner)", description: "Beautiful, stacking toast notifications. Powered by Sonner's CSS with a vanilla JS Stimulus controller.")
      end

      def view_template
        preview("Interactive", description: "Click buttons to trigger toasts in the bottom-right corner.") do
          div(class: "flex flex-wrap gap-3") do
            toast_btn("Default", variant: :default, type: "default", title: "Event has been created", desc: "Sunday, December 03, 2023 at 9:00 AM")
            toast_btn("Success", variant: :secondary, type: "success", title: "Success", desc: "Your changes have been saved.")
            toast_btn("Error", variant: :destructive, type: "error", title: "Error", desc: "There was a problem with your request.")
            toast_btn("Warning", variant: :outline, type: "warning", title: "Warning", desc: "Please review before continuing.")
            toast_btn("Info", variant: :outline, type: "info", title: "New update", desc: "A new version is available.")
          end
        end

        preview("Multiple toasts", description: "Click rapidly to see stacking behavior.") do
          div(class: "flex flex-wrap gap-3") do
            toast_btn("Toast 1", variant: :default, type: "default", title: "First toast", desc: "This is the first message.")
            toast_btn("Toast 2", variant: :default, type: "success", title: "Second toast", desc: "This is the second message.")
            toast_btn("Toast 3", variant: :default, type: "info", title: "Third toast", desc: "Hover over the stack to expand.")
          end
        end

        code <<~RUBY
          # 1. Add the Sonner toaster to your layout (once):
          div(data_controller: "sonner",
              data_sonner_position_value: "bottom-right",
              data_sonner_theme_value: "system",
              data_sonner_rich_colors_value: true)

          # 2. Trigger from anywhere via JS events:
          # document.dispatchEvent(new CustomEvent("toast:success", {
          #   detail: { title: "Saved!", description: "Changes saved." }
          # }))
          #
          # Events: toast:show, toast:success, toast:error,
          #         toast:warning, toast:info
        RUBY
      end

      private

      def toast_btn(label, variant:, type:, title:, desc:)
        ui_button(
          variant: variant,
          data_controller: "toast-trigger",
          data_toast_trigger_title_value: title,
          data_toast_trigger_description_value: desc,
          data_toast_trigger_variant_value: type,
          data_action: "click->toast-trigger#fire"
        ) { label }
      end
    end
  end
end
