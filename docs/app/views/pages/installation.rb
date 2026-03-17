# frozen_string_literal: true

module Pages
  class Installation < Layouts::DocsLayout
    def initialize
      super(title: "Installation", description: "Get started with shadcn-phlex in your Rails app.")
    end

    def view_template
      step("1. Add the gem", <<~RUBY)
        # Gemfile
        gem "shadcn-phlex"
      RUBY

      step("2. Run the install generator", <<~BASH)
        rails g shadcn_phlex:install --base-color=neutral --accent-color=blue
      BASH

      div(class: "mb-8") do
        p(class: "text-muted-foreground") do
          plain "The generator sets up everything automatically:"
        end
        ul(class: "mt-2 ml-6 list-disc text-sm text-muted-foreground [&>li]:mt-1") do
          li { "app/views/application_view.rb with Shadcn::Kit included" }
          li { "app/assets/stylesheets/shadcn.css (Tailwind + theme)" }
          li { "app/javascript/controllers/shadcn/ (25 Stimulus controllers)" }
          li { "config/application.rb (autoload app/views for Phlex)" }
        end
      end

      step("3. Start building", <<~RUBY)
        class MyView < ApplicationView
          def view_template
            ui_card do
              ui_card_header { ui_card_title { "Hello" } }
              ui_card_content { ui_button { "World" } }
            end
          end
        end
      RUBY

      div(class: "mt-8") do
        h2(class: "text-xl font-semibold mb-4") { "AI / LLM Support" }
        p(class: "text-muted-foreground mb-4") do
          plain "Install the agent skill so your AI assistant knows every component:"
        end
        render ::Components::CodeBlock.new(code: "npx skills add shadcn-phlex/shadcn-phlex", language: "bash")
      end
    end

    private

    def step(title, code)
      div(class: "mb-8") do
        h3(class: "text-lg font-semibold mb-2") { title }
        render ::Components::CodeBlock.new(code: code.strip)
      end
    end
  end
end
