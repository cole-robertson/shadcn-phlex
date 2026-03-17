# frozen_string_literal: true

module Pages
  module Components
    class DrawerPage < BaseComponentPage
      def initialize
        super(title: "Drawer", description: "A panel that slides in from the edge of the screen.")
      end

      def view_template
        preview("Bottom (default)") do
          ui_drawer do
            ui_drawer_trigger(class: "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground") do
              plain "Open Drawer"
            end
            ui_drawer_content do
              div(class: "mx-auto w-full max-w-sm") do
                ui_drawer_header do
                  ui_drawer_title { "Move Goal" }
                  ui_drawer_description { "Set your daily activity goal." }
                end
                div(class: "p-4") do
                  div(class: "flex items-center justify-center gap-4") do
                    ui_button(variant: :outline, size: :icon) { "-" }
                    span(class: "text-4xl font-bold tabular-nums") { "350" }
                    ui_button(variant: :outline, size: :icon) { "+" }
                  end
                  p(class: "mt-2 text-center text-sm text-muted-foreground") { "calories/day" }
                end
                ui_drawer_footer do
                  ui_button { "Submit" }
                  ui_drawer_close(class: "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground") do
                    plain "Cancel"
                  end
                end
              end
            end
          end
        end

        code <<~RUBY
          ui_drawer do
            ui_drawer_trigger { "Open" }
            ui_drawer_content do
              ui_drawer_header do
                ui_drawer_title { "Title" }
                ui_drawer_description { "Description" }
              end
              # content here
              ui_drawer_footer do
                ui_button { "Submit" }
                ui_drawer_close { "Cancel" }
              end
            end
          end
        RUBY
      end
    end
  end
end
