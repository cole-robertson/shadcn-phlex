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
          include Phlex::Rails::Helpers::Routes
          include Phlex::Rails::Helpers::StyleSheetLinkTag
          include Phlex::Rails::Helpers::JavaScriptIncludeTag

          # Dark mode blocking script — prevents flash of light mode
          DARK_MODE_SCRIPT = '(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();'

          def around_template(&block)
            doctype
            html(lang: "en") do
              head do
                meta(charset: "utf-8")
                meta(name: "viewport", content: "width=device-width,initial-scale=1")
                title { page_title }
                script { raw(Phlex::HTML::SafeValue.new(DARK_MODE_SCRIPT)) }
                stylesheet_link_tag("application")
                javascript_include_tag("application", defer: "defer")
              end
              body(class: "min-h-screen bg-background text-foreground antialiased", data_controller: "shadcn--dark-mode") do
                yield
              end
            end
          end

          private

          def page_title
            "My App"
          end
        end
      RUBY
    end

    def copy_tailwind_config
      source = gem_css("shadcn-tailwind.css")
      create_file "app/assets/stylesheets/shadcn-tailwind.css", File.read(source)
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
      target = "app/javascript/controllers/shadcn"

      if File.directory?(gem_js_dir) && !File.directory?(target)
        js_files = Dir[File.join(gem_js_dir, "*.js")]
        js_files.each do |file|
          create_file File.join(target, File.basename(file)), File.read(file)
        end
        say_status :copied, "#{js_files.count} Stimulus controllers to #{target}/", :green
      end
    end

    def create_stimulus_registration
      index_path = "app/javascript/controllers/index.js"
      return unless File.exist?(index_path)

      content = File.read(index_path)
      return if content.include?("shadcn")

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
          - app/views/application_view.rb (base view with Kit, dark mode, asset tags)
          - app/assets/stylesheets/shadcn.css (Tailwind + theme)
          - app/javascript/controllers/shadcn/ (Stimulus controllers)
          - config/application.rb (autoload app/views)

        Start using components:
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

    def gem_root
      @gem_root ||= begin
        spec = Gem.loaded_specs["shadcn-phlex"]
        if spec
          spec.full_gem_path
        else
          File.expand_path("../../../..", __dir__)
        end
      end
    end

    def gem_css(filename)
      File.join(gem_root, "css", filename)
    end

    def gem_js_dir
      File.join(gem_root, "js", "controllers")
    end
  end
end
