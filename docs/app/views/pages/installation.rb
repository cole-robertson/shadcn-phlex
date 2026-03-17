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

      step("3. Register Stimulus controllers", <<~JS)
        // app/javascript/controllers/index.js
        import { registerShadcnControllers } from "shadcn/controllers"
        registerShadcnControllers(application)
      JS

      step("4. Include Kit in your base view", <<~RUBY)
        # app/views/application_view.rb
        class ApplicationView < Phlex::HTML
          include Shadcn::Kit
        end
      RUBY

      step("5. Start building", <<~RUBY)
        class MyView < ApplicationView
          def view_template
            ui_button { "Hello World" }
          end
        end
      RUBY

      div(class: "mt-8") do
        h2(class: "text-xl font-semibold mb-4") { "AI / LLM Support" }
        p(class: "text-muted-foreground mb-4") do
          plain "Install the agent skill so your AI assistant knows every component:"
        end
        render Components::CodeBlock.new(code: "npx skills add shadcn-phlex/shadcn-phlex", language: "bash")
      end
    end

    private

    def step(title, code)
      div(class: "mb-8") do
        h3(class: "text-lg font-semibold mb-2") { title }
        render Components::CodeBlock.new(code: code.strip)
      end
    end
  end
end
