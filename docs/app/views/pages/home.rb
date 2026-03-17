# frozen_string_literal: true

module Pages
  class Home < Layouts::DocsLayout
    def initialize
      super(title: nil)
    end

    def around_template(&block)
      # Override to skip the default title rendering for home page
      doctype
      html(lang: "en", class: "scroll-smooth") do
        head do
          meta(charset: "utf-8")
          meta(name: "viewport", content: "width=device-width,initial-scale=1")
          title { "shadcn-phlex — shadcn/ui for Rails" }
          stylesheet_tag("application")
          script_tag("application")
        end
        body(class: "min-h-screen bg-background text-foreground antialiased", data_controller: "shadcn--dark-mode") do
          render_header
          yield
        end
      end
    end

    def view_template
      # Hero section
      section(class: "py-20 md:py-32") do
        div(class: "max-w-4xl mx-auto px-6 text-center") do
          ui_badge(variant: :secondary, class: "mb-4") { "v0.1.0" }
          h1(class: "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl") do
            plain "Build your Rails UI"
            br
            span(class: "text-muted-foreground") { "with shadcn components" }
          end
          p(class: "mt-6 max-w-2xl mx-auto text-lg text-muted-foreground") do
            plain "Every shadcn/ui component, ported to Phlex for Ruby on Rails. "
            plain "Same Tailwind classes. Same theming. Stimulus controllers included."
          end
          div(class: "mt-10 flex flex-wrap items-center justify-center gap-4") do
            ui_button(tag: :a, href: "/installation", size: :lg) { "Get Started" }
            ui_button(tag: :a, href: "/components/button", variant: :outline, size: :lg) { "Browse Components" }
          end
        end
      end

      # Feature cards
      section(class: "py-16 border-t") do
        div(class: "max-w-5xl mx-auto px-6") do
          div(class: "grid gap-6 md:grid-cols-3") do
            feature_card(
              "55 Components",
              "Every shadcn/ui v4 component — Button, Card, Dialog, Table, Tabs, and 50 more."
            )
            feature_card(
              "25 Stimulus Controllers",
              "Focus traps, keyboard navigation, positioning, animations. Radix UI behavior in vanilla JS."
            )
            feature_card(
              "shadcn Theming",
              "Copy-paste themes from ui.shadcn.com/themes. Same CSS variables, same format."
            )
          end

          div(class: "grid gap-6 md:grid-cols-3 mt-6") do
            feature_card(
              "Kit Helpers",
              "ui_button { \"Click\" } — short syntax that composes naturally in Phlex views."
            )
            feature_card(
              "Form Integration",
              "Hidden inputs for Checkbox, Switch, Select, Slider. Works with Rails forms."
            )
            feature_card(
              "AI Skills",
              "Agent skill for Claude Code, Cursor, and 40+ coding agents via npx skills add."
            )
          end
        end
      end

      # Quick example
      section(class: "py-16 border-t") do
        div(class: "max-w-4xl mx-auto px-6") do
          h2(class: "text-2xl font-bold tracking-tight mb-8 text-center") { "Write UI in pure Ruby" }
          div(class: "grid gap-8 md:grid-cols-2") do
            # Code side
            div do
              h3(class: "text-sm font-medium text-muted-foreground mb-3") { "Code" }
              div(class: "rounded-lg border bg-muted/30 p-4") do
                pre(class: "text-sm font-mono overflow-x-auto") do
                  code do
                    plain <<~RUBY
                      ui_card do
                        ui_card_header do
                          ui_card_title { "Settings" }
                          ui_card_description { "Manage your account." }
                        end
                        ui_card_content do
                          ui_text_field(
                            label: "Name",
                            name: "user[name]",
                            placeholder: "Enter your name"
                          )
                        end
                        ui_card_footer do
                          ui_button { "Save" }
                        end
                      end
                    RUBY
                  end
                end
              end
            end
            # Preview side
            div do
              h3(class: "text-sm font-medium text-muted-foreground mb-3") { "Preview" }
              ui_card do
                ui_card_header do
                  ui_card_title { "Settings" }
                  ui_card_description { "Manage your account." }
                end
                ui_card_content do
                  ui_text_field(
                    label: "Name",
                    name: "user[name]",
                    placeholder: "Enter your name"
                  )
                end
                ui_card_footer do
                  ui_button { "Save" }
                end
              end
            end
          end
        end
      end

      # Footer
      footer(class: "border-t py-8") do
        div(class: "max-w-5xl mx-auto px-6 text-center text-sm text-muted-foreground") do
          plain "Built with shadcn-phlex. "
          a(href: "https://github.com/cole-robertson/shadcn-phlex", class: "underline hover:text-foreground") { "GitHub" }
        end
      end
    end

    private

    def feature_card(title, desc)
      ui_card(class: "p-6") do
        ui_card_header do
          ui_card_title { title }
        end
        ui_card_content do
          p(class: "text-sm text-muted-foreground") { desc }
        end
      end
    end
  end
end
