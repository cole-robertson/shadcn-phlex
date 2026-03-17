# frozen_string_literal: true

class ApplicationView < Phlex::HTML
  include Shadcn::Kit
  include Phlex::Rails::Helpers::Routes

  def around_template(&block)
    doctype
    html(lang: "en") do
      head do
        meta(charset: "utf-8")
        meta(name: "viewport", content: "width=device-width,initial-scale=1")
        title { "shadcn-phlex — Component Library for Rails" }
        link(rel: "stylesheet", href: helpers.asset_path("application.css"))
        script(src: helpers.asset_path("application.js"), defer: true)
      end
      body(class: "min-h-screen bg-background text-foreground antialiased") do
        yield
      end
    end
  end

  private

  def helpers
    Phlex::Rails::Helpers
  end
end
