# frozen_string_literal: true

require "rails/generators"

module ShadcnPhlex
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path("install/templates", __dir__)
    desc "Install shadcn-phlex: CSS, Stimulus controllers, and base config"

    class_option :base_color, type: :string, default: "neutral",
      desc: "Base color theme (neutral, stone, zinc, mauve, olive, mist, taupe)"
    class_option :accent_color, type: :string, default: nil,
      desc: "Accent color (blue, red, green, violet, orange, amber, etc.)"
    class_option :radius, type: :string, default: "0.625rem",
      desc: "Border radius base value"

    def add_gems
      gem "phlex-rails", "~> 2.1" unless gem_installed?("phlex-rails")
    end

    def add_npm_packages
      say_status :run, "Adding tw-animate-css", :green
      if File.exist?("package.json")
        run "npm install tw-animate-css"
      elsif File.exist?("yarn.lock")
        run "yarn add tw-animate-css"
      end
    end

    def configure_autoload
      # Phlex views in app/views/ need to be autoloaded
      application_rb = "config/application.rb"
      return unless File.exist?(application_rb)

      content = File.read(application_rb)
      return if content.include?("app/views")

      inject_into_file application_rb,
        after: /config\.autoload_lib.*\n/ do
        <<-RUBY
    # Autoload Phlex views
    config.autoload_paths << Rails.root.join("app/views")

        RUBY
      end
      say_status :inject, "config.autoload_paths << app/views", :green
    end

    def create_application_view
      path = "app/views/application_view.rb"
      return if File.exist?(path)

      create_file path, <<~RUBY
        # frozen_string_literal: true

        class ApplicationView < Phlex::HTML
          include Shadcn::Kit
        end
      RUBY
    end

    def copy_tailwind_config
      copy_file gem_css("shadcn-tailwind.css"), "app/assets/stylesheets/shadcn-tailwind.css"
    end

    def create_theme
      base_color = options[:base_color].to_sym
      accent_color = options[:accent_color]&.to_sym
      radius = options[:radius]

      require "shadcn/themes/base_colors"
      require "shadcn/themes/accent_colors"

      theme_css = Shadcn::Themes.generate_css(
        base_color: base_color,
        accent_color: accent_color,
        radius: radius
      )

      create_file "app/assets/stylesheets/shadcn-theme.css", <<~CSS
        /*
         * shadcn theme: #{base_color}#{accent_color ? " + #{accent_color}" : ""}
         * To change themes, replace this file with CSS from ui.shadcn.com/themes
         */
        #{theme_css}
      CSS
    end

    def create_css_entrypoint
      gem_path = Gem.loaded_specs["shadcn-phlex"]&.full_gem_path

      create_file "app/assets/stylesheets/shadcn.css", <<~CSS
        @import "tailwindcss";
        @import "tw-animate-css";
        @import "./shadcn-tailwind.css";
        @import "./shadcn-theme.css";

        /* Ensure Tailwind scans component files for class names */
        @source "../../app/components";
        @source "../../app/views";
        #{gem_path ? "@source \"#{gem_path}/lib/**/*.rb\";" : "/* @source \"path/to/shadcn-phlex/lib/**/*.rb\"; */"}
      CSS
    end

    def copy_stimulus_controllers
      # Copy JS controllers into the app so bundlers can find them
      gem_js = File.expand_path("../../../../js/controllers", __dir__)
      target = "app/javascript/controllers/shadcn"

      if File.directory?(gem_js) && !File.directory?(target)
        FileUtils.mkdir_p(target)
        Dir[File.join(gem_js, "*.js")].each do |file|
          copy_file file, File.join(target, File.basename(file))
        end
        say_status :create, "#{target}/ (#{Dir[File.join(gem_js, '*.js')].count} controllers)", :green
      end
    end

    def create_stimulus_registration
      index_path = "app/javascript/controllers/index.js"
      return unless File.exist?(index_path)

      content = File.read(index_path)
      return if content.include?("shadcn")

      # Add import and registration
      append_to_file index_path, <<~JS

        // shadcn-phlex Stimulus controllers
        import { registerShadcnControllers } from "./shadcn/index"
        registerShadcnControllers(application)
      JS
      say_status :inject, "shadcn controllers into #{index_path}", :green
    end

    def print_setup_complete
      say_status :info, "Setup complete!", :green
      say <<~MSG

        shadcn-phlex is ready. Here's what was set up:
          - app/views/application_view.rb (base view with Shadcn::Kit)
          - app/assets/stylesheets/shadcn.css (Tailwind + theme)
          - app/javascript/controllers/shadcn/ (Stimulus controllers)
          - config/application.rb (autoload app/views)

        Start using components in any Phlex view:
          class MyView < ApplicationView
            def view_template
              ui_button { "Hello" }
            end
          end

        To change your theme:
          1. Go to ui.shadcn.com/themes
          2. Copy the CSS
          3. Paste into app/assets/stylesheets/shadcn-theme.css

        For AI/LLM support:
          npx skills add shadcn-phlex/shadcn-phlex

      MSG
    end

    private

    def gem_installed?(name)
      File.read("Gemfile").include?(name)
    rescue Errno::ENOENT
      false
    end

    def gem_css(filename)
      File.expand_path("../../../../css/#{filename}", __dir__)
    end
  end
end
