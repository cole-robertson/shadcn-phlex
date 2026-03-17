# frozen_string_literal: true

module Pages
  class Home < Layouts::DocsLayout
    def initialize
      super(title: nil)
    end

    def around_template(&block)
      doctype
      html(lang: "en", class: "scroll-smooth") do
        head do
          meta(charset: "utf-8")
          meta(name: "viewport", content: "width=device-width,initial-scale=1")
          title { "shadcn-phlex — shadcn/ui for Ruby on Rails" }
          script do
            raw(Phlex::HTML::SafeValue.new('(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();'))
          end
          stylesheet_tag("application")
          script_tag("application")
        end
        body(class: "min-h-screen bg-background text-foreground antialiased", data_controller: "shadcn--dark-mode") do
          div(data_controller: "sonner", data_sonner_theme_value: "system", data_sonner_rich_colors_value: "true")
          render_header
          yield
        end
      end
    end

    def view_template
      # Hero
      section(class: "relative") do
        div(class: "mx-auto max-w-[980px] py-20 md:py-28 flex flex-col items-center gap-4 text-center") do
          a(href: "https://github.com/cole-robertson/shadcn-phlex", class: "inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent") do
            plain "Now on RubyGems "
            span(class: "ml-1") { "→" }
          end

          h1(class: "text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]") do
            plain "Build your UI with "
            br
            span(class: "text-muted-foreground") { "shadcn components in Ruby" }
          end

          p(class: "max-w-[750px] text-lg text-muted-foreground sm:text-xl") do
            plain "Every shadcn/ui component, ported to Phlex. Same Tailwind classes. Same theming. Stimulus controllers for interactivity. Open source."
          end

          div(class: "flex gap-4") do
            ui_button(tag: :a, href: "/installation", size: :lg) do
              plain "Get Started"
            end
            ui_button(tag: :a, href: "/components/button", variant: :outline, size: :lg) do
              plain "Components"
            end
          end
        end
      end

      # Component showcase
      section(class: "border-t") do
        div(class: "mx-auto max-w-6xl px-6 py-16") do
          div(class: "grid gap-6 lg:grid-cols-2 xl:grid-cols-3") do
            # Card with form
            showcase_card do
              ui_card do
                ui_card_header do
                  ui_card_title { "Create Account" }
                  ui_card_description { "Enter your details to get started." }
                end
                ui_card_content do
                  div(class: "flex flex-col gap-4") do
                    ui_text_field(label: "Name", name: "name", placeholder: "John Doe")
                    ui_text_field(label: "Email", name: "email", type: "email", placeholder: "john@example.com")
                  end
                end
                ui_card_footer do
                  ui_button(class: "w-full") { "Sign Up" }
                end
              end
            end

            # Controls
            showcase_card do
              ui_card(class: "p-6") do
                div(class: "flex flex-col gap-5") do
                  div(class: "flex flex-col gap-2") do
                    span(class: "text-sm font-medium") { "Notifications" }
                    ui_switch(checked: true) { "Push notifications" }
                    ui_switch { "Email digests" }
                    ui_switch(checked: true) { "Marketing emails" }
                  end
                  ui_separator
                  div(class: "flex flex-col gap-2") do
                    span(class: "text-sm font-medium") { "Plan" }
                    ui_radio_group(name: "plan", value: "pro") do
                      label(class: "flex items-center gap-2 cursor-pointer") do
                        ui_radio_group_item(value: "free")
                        span(class: "text-sm") { "Free" }
                      end
                      label(class: "flex items-center gap-2 cursor-pointer") do
                        ui_radio_group_item(value: "pro", checked: true)
                        span(class: "text-sm") { "Pro" }
                      end
                      label(class: "flex items-center gap-2 cursor-pointer") do
                        ui_radio_group_item(value: "enterprise")
                        span(class: "text-sm") { "Enterprise" }
                      end
                    end
                  end
                end
              end
            end

            # Badges + Alerts
            showcase_card do
              div(class: "flex flex-col gap-4") do
                div(class: "flex flex-wrap gap-2") do
                  ui_badge { "Default" }
                  ui_badge(variant: :secondary) { "Secondary" }
                  ui_badge(variant: :outline) { "Outline" }
                  ui_badge(variant: :destructive) { "Destructive" }
                end
                ui_alert do
                  ui_alert_title { "Heads up!" }
                  ui_alert_description { "You can use shadcn-phlex to build your Rails UI with Phlex components." }
                end
                ui_alert(variant: :destructive) do
                  ui_alert_title { "Error" }
                  ui_alert_description { "Your session has expired. Please log in again." }
                end
              end
            end

            # Data table
            showcase_card(class: "lg:col-span-2") do
              ui_table do
                ui_table_header do
                  ui_table_row do
                    ui_table_head { "Name" }
                    ui_table_head { "Status" }
                    ui_table_head { "Role" }
                    ui_table_head(class: "text-right") { "Amount" }
                  end
                end
                ui_table_body do
                  [
                    ["Olivia Martin", "Active", "Admin", "$1,999.00"],
                    ["Jackson Lee", "Active", "Member", "$39.00"],
                    ["Isabella Nguyen", "Inactive", "Member", "$299.00"],
                    ["William Kim", "Active", "Member", "$99.00"],
                  ].each do |name, status, role, amount|
                    ui_table_row do
                      ui_table_cell(class: "font-medium") { name }
                      ui_table_cell do
                        ui_badge(variant: status == "Active" ? :default : :secondary) { status }
                      end
                      ui_table_cell { role }
                      ui_table_cell(class: "text-right") { amount }
                    end
                  end
                end
              end
            end

            # Progress + Skeleton
            showcase_card do
              div(class: "flex flex-col gap-6") do
                div(class: "flex flex-col gap-2") do
                  div(class: "flex justify-between text-sm") do
                    span { "Storage" }
                    span(class: "text-muted-foreground") { "68%" }
                  end
                  ui_progress(value: 68)
                end
                div(class: "flex flex-col gap-3") do
                  span(class: "text-sm font-medium") { "Loading..." }
                  div(class: "flex items-center gap-3") do
                    ui_skeleton(class: "size-10 rounded-full")
                    div(class: "flex flex-col gap-2 flex-1") do
                      ui_skeleton(class: "h-4 w-3/4")
                      ui_skeleton(class: "h-3 w-1/2")
                    end
                  end
                  div(class: "flex items-center gap-3") do
                    ui_skeleton(class: "size-10 rounded-full")
                    div(class: "flex flex-col gap-2 flex-1") do
                      ui_skeleton(class: "h-4 w-2/3")
                      ui_skeleton(class: "h-3 w-1/3")
                    end
                  end
                end
              end
            end
          end
        end
      end

      # Code + Preview
      section(class: "border-t bg-muted/30") do
        div(class: "mx-auto max-w-5xl px-6 py-16") do
          h2(class: "text-2xl font-bold tracking-tight text-center mb-2") { "Write UI in pure Ruby" }
          p(class: "text-center text-muted-foreground mb-10") { "No ERB. No JSX. Just Ruby classes with ui_* helpers." }
          div(class: "grid gap-8 lg:grid-cols-2 items-start") do
            # Code
            div(class: "rounded-lg border bg-card overflow-hidden") do
              div(class: "border-b px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50") { "app/views/settings_view.rb" }
              pre(class: "p-4 text-[13px] font-mono overflow-x-auto leading-relaxed") do
                code do
                  plain <<~RUBY
                    class SettingsView < ApplicationView
                      def view_template
                        ui_dialog do
                          ui_dialog_trigger do
                            ui_button(variant: :outline) { "Edit Profile" }
                          end
                          ui_dialog_content do
                            ui_dialog_header do
                              ui_dialog_title { "Edit Profile" }
                              ui_dialog_description { "Update your info." }
                            end

                            ui_text_field(
                              label: "Name",
                              name: "user[name]",
                              value: @user.name
                            )
                            ui_text_field(
                              label: "Email",
                              name: "user[email]",
                              type: "email",
                              error: @user.errors[:email]&.first
                            )
                            ui_switch(name: "user[newsletter]") do
                              "Subscribe to newsletter"
                            end

                            ui_dialog_footer do
                              ui_button { "Save changes" }
                            end
                          end
                        end
                      end
                    end
                  RUBY
                end
              end
            end

            # Live preview
            div(class: "rounded-lg border bg-card p-6") do
              div(class: "border-b -mx-6 -mt-6 mb-6 px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50") { "Preview" }
              ui_dialog do
                ui_dialog_trigger do
                  ui_button(variant: :outline) { "Edit Profile" }
                end
                ui_dialog_content do
                  ui_dialog_header do
                    ui_dialog_title { "Edit Profile" }
                    ui_dialog_description { "Update your info." }
                  end
                  div(class: "flex flex-col gap-4 py-4") do
                    ui_text_field(label: "Name", name: "user[name]", value: "Cole Robertson")
                    ui_text_field(label: "Email", name: "user[email]", type: "email", error: "has already been taken")
                    ui_switch(name: "user[newsletter]", checked: true) { "Subscribe to newsletter" }
                  end
                  ui_dialog_footer do
                    ui_button { "Save changes" }
                  end
                end
              end
            end
          end
        end
      end

      # Footer
      footer(class: "border-t py-8") do
        div(class: "mx-auto max-w-5xl px-6 text-center text-sm text-muted-foreground") do
          plain "Built with shadcn-phlex. The source code is available on "
          a(href: "https://github.com/cole-robertson/shadcn-phlex", class: "underline hover:text-foreground") { "GitHub" }
          plain "."
        end
      end
    end

    private

    def showcase_card(**attrs, &block)
      classes = ["rounded-lg border bg-card p-4", attrs.delete(:class)].compact.join(" ")
      div(class: classes, **attrs, &block)
    end
  end
end
