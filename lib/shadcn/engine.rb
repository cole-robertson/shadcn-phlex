# frozen_string_literal: true

module Shadcn
  class Engine < ::Rails::Engine
    isolate_namespace Shadcn

    initializer "shadcn.assets" do |app|
      # Add JS controllers to asset pipeline
      if app.config.respond_to?(:assets)
        app.config.assets.paths << root.join("js")
      end
    end

    initializer "shadcn.importmap", before: "importmap" do |app|
      if app.config.respond_to?(:importmap)
        # Pin all Stimulus controllers
        app.config.importmap.pin_all_from(
          root.join("js/controllers"),
          under: "shadcn/controllers"
        )
      end
    end
  end
end
