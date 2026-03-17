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
      gem "class_variants", "~> 1.0" unless gem_installed?("class_variants")
      gem "tailwind_merge", "~> 1.0" unless gem_installed?("tailwind_merge")
    end

    def add_npm_packages
      say_status :run, "Adding tw-animate-css and @hotwired/stimulus", :green
      run "npm install tw-animate-css @hotwired/stimulus" if File.exist?("package.json")
      run "yarn add tw-animate-css @hotwired/stimulus" if File.exist?("yarn.lock")
    end

    def copy_tailwind_config
      # Copy the stable Tailwind config (custom variants, @theme inline, keyframes)
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

      # Write just the theme variables — user can swap this with
      # any theme from ui.shadcn.com/themes (same :root / .dark format)
      create_file "app/assets/stylesheets/shadcn-theme.css", <<~CSS
        /*
         * shadcn theme: #{base_color}#{accent_color ? " + #{accent_color}" : ""}
         * To change themes, replace this file with CSS from ui.shadcn.com/themes
         */
        #{theme_css}
      CSS
    end

    def create_entrypoint
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

    def setup_stimulus
      say_status :info, "Register shadcn Stimulus controllers in your application.js:", :blue
      say <<~MSG

        import { registerShadcnControllers } from "shadcn/controllers"
        registerShadcnControllers(application)

      MSG
    end

    def print_theme_instructions
      say_status :info, "Theme setup complete!", :green
      say <<~MSG

        To change your theme:
          1. Go to ui.shadcn.com/themes
          2. Pick a theme and copy the CSS
          3. Paste into app/assets/stylesheets/shadcn-theme.css

        The format is identical — just :root and .dark blocks with CSS variables.

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
