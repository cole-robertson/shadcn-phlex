# frozen_string_literal: true

require "rails/generators"

module ShadcnPhlex
  class ComponentGenerator < Rails::Generators::Base
    desc "Copy a shadcn component into your app"
    argument :name, type: :string, desc: "Component name (e.g., button, card, dialog)"

    COMPONENTS = %w[
      accordion alert alert_dialog aspect_ratio avatar badge breadcrumb
      button button_group card checkbox collapsible context_menu dialog
      direction drawer dropdown_menu empty field hover_card input
      input_group item kbd label menubar native_select navigation_menu
      pagination popover progress radio_group scroll_area select
      separator sheet skeleton slider sonner spinner switch table tabs
      textarea toggle toggle_group tooltip typography
    ].freeze

    # Components that need a Stimulus controller
    INTERACTIVE = %w[
      accordion checkbox collapsible combobox command context_menu dialog
      drawer dropdown_menu hover_card menubar navigation_menu popover
      radio_group scroll_area select sheet slider switch tabs toast
      toggle toggle_group tooltip
    ].freeze

    def validate_component
      unless COMPONENTS.include?(normalized_name) || normalized_name == "all"
        say_status :error, "Unknown component: #{name}. Available: #{COMPONENTS.join(', ')}", :red
        raise SystemExit
      end
    end

    def copy_component
      if normalized_name == "all"
        COMPONENTS.each { |c| copy_single_component(c) }
      else
        copy_single_component(normalized_name)
      end
    end

    def copy_stimulus_controller
      if normalized_name == "all"
        INTERACTIVE.each { |c| copy_single_controller(c) }
      elsif INTERACTIVE.include?(normalized_name)
        copy_single_controller(normalized_name)
      end
    end

    private

    def normalized_name
      @normalized_name ||= name.underscore.tr("-", "_")
    end

    def copy_single_component(component_name)
      source = gem_root.join("lib/shadcn/ui/#{component_name}.rb")
      if File.exist?(source)
        dest = "app/components/shadcn/ui/#{component_name}.rb"
        copy_file source, dest
        say_status :create, dest, :green
      end
    end

    def copy_single_controller(component_name)
      source = gem_root.join("js/controllers/#{component_name}_controller.js")
      if File.exist?(source)
        dest = "app/javascript/controllers/shadcn/#{component_name}_controller.js"
        copy_file source, dest
        say_status :create, dest, :green
      end
    end

    def gem_root
      Pathname.new(File.expand_path("../../..", __dir__))
    end
  end
end
