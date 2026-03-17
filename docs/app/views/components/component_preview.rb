# frozen_string_literal: true

module Components
  class ComponentPreview < Phlex::HTML
    include Shadcn::Kit

    def initialize(title:, description: nil, &block)
      @title = title
      @description = description
    end

    def view_template(&block)
      div(class: "mb-10") do
        h3(class: "text-lg font-semibold mb-1") { @title }
        if @description
          p(class: "text-sm text-muted-foreground mb-3") { @description }
        end
        div(class: "rounded-lg border bg-card p-6") do
          yield
        end
      end
    end
  end
end
