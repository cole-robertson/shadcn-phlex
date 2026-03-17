# frozen_string_literal: true

require "rails/generators"

module ShadcnPhlex
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path("install/templates", __dir__)
    desc "Install shadcn-phlex: CSS variables, Stimulus controllers, and base config"

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

    def create_css
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

      create_file "app/assets/stylesheets/shadcn.css", <<~CSS
        @import "tailwindcss";
        @import "tw-animate-css";

        /* Custom variants (required by shadcn components) */
        @custom-variant dark (&:is(.dark *));
        @custom-variant data-open (&:is([data-state="open"], [data-open]));
        @custom-variant data-closed (&:is([data-state="closed"], [data-closed]));
        @custom-variant data-checked (&:is([data-state="checked"], [data-checked]));
        @custom-variant data-unchecked (&:is([data-state="unchecked"], [data-unchecked]));
        @custom-variant data-selected (&:is([data-selected="true"]));
        @custom-variant data-disabled (&:is([data-disabled="true"], [data-disabled]));
        @custom-variant data-active (&:is([data-state="active"], [data-active]));
        @custom-variant data-horizontal (&:is([data-orientation="horizontal"]));
        @custom-variant data-vertical (&:is([data-orientation="vertical"]));

        @utility no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          &::-webkit-scrollbar { display: none; }
        }

        /* Theme: #{base_color}#{accent_color ? " + #{accent_color}" : ""} */
        #{theme_css}

        @theme inline {
          --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
          --font-mono: "JetBrains Mono", ui-monospace, monospace;

          --color-background: var(--background);
          --color-foreground: var(--foreground);
          --color-card: var(--card);
          --color-card-foreground: var(--card-foreground);
          --color-popover: var(--popover);
          --color-popover-foreground: var(--popover-foreground);
          --color-primary: var(--primary);
          --color-primary-foreground: var(--primary-foreground);
          --color-secondary: var(--secondary);
          --color-secondary-foreground: var(--secondary-foreground);
          --color-muted: var(--muted);
          --color-muted-foreground: var(--muted-foreground);
          --color-accent: var(--accent);
          --color-accent-foreground: var(--accent-foreground);
          --color-destructive: var(--destructive);
          --color-border: var(--border);
          --color-input: var(--input);
          --color-ring: var(--ring);
          --color-chart-1: var(--chart-1);
          --color-chart-2: var(--chart-2);
          --color-chart-3: var(--chart-3);
          --color-chart-4: var(--chart-4);
          --color-chart-5: var(--chart-5);
          --color-sidebar: var(--sidebar);
          --color-sidebar-foreground: var(--sidebar-foreground);
          --color-sidebar-primary: var(--sidebar-primary);
          --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
          --color-sidebar-accent: var(--sidebar-accent);
          --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
          --color-sidebar-border: var(--sidebar-border);
          --color-sidebar-ring: var(--sidebar-ring);

          --radius-sm: calc(var(--radius) * 0.6);
          --radius-md: calc(var(--radius) * 0.8);
          --radius-lg: var(--radius);
          --radius-xl: calc(var(--radius) * 1.4);
          --radius-2xl: calc(var(--radius) * 1.8);
          --radius-3xl: calc(var(--radius) * 2.2);
          --radius-4xl: calc(var(--radius) * 2.6);

          --animate-accordion-down: accordion-down 200ms ease-out;
          --animate-accordion-up: accordion-up 200ms ease-out;
          --animate-collapsible-down: collapsible-down 200ms ease-out;
          --animate-collapsible-up: collapsible-up 200ms ease-out;
        }

        @layer base {
          * { @apply border-border outline-ring/50; }
          body { @apply bg-background text-foreground; }
        }

        @keyframes accordion-down {
          from { height: 0; }
          to { height: var(--radix-accordion-content-height, var(--accordion-panel-height)); }
        }
        @keyframes accordion-up {
          from { height: var(--radix-accordion-content-height, var(--accordion-panel-height)); }
          to { height: 0; }
        }
        @keyframes collapsible-down {
          from { height: 0; }
          to { height: var(--radix-collapsible-content-height, var(--collapsible-panel-height)); }
        }
        @keyframes collapsible-up {
          from { height: var(--radix-collapsible-content-height, var(--collapsible-panel-height)); }
          to { height: 0; }
        }
      CSS
    end

    def create_initializer
      create_file "config/initializers/shadcn_phlex.rb", <<~RUBY
        # frozen_string_literal: true

        # Configure Tailwind to scan Phlex component files
        # Add to your tailwind.config or CSS content paths:
        #   content: [
        #     ...
        #     "\#{Shadcn::Engine.root}/lib/**/*.rb",
        #     "./app/components/**/*.rb",
        #     "./app/views/**/*.rb",
        #   ]
      RUBY
    end

    def setup_stimulus
      say_status :info, "Register shadcn Stimulus controllers in your application.js:", :blue
      say <<~MSG

        import { registerShadcnControllers } from "shadcn/controllers"
        registerShadcnControllers(application)

      MSG
    end

    private

    def gem_installed?(name)
      File.read("Gemfile").include?(name)
    rescue Errno::ENOENT
      false
    end
  end
end
