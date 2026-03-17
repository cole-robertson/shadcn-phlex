# frozen_string_literal: true

class ApplicationView < Phlex::HTML
  include Shadcn::Kit
  include Phlex::Rails::Helpers::Routes
  include Phlex::Rails::Helpers::StyleSheetLinkTag
  include Phlex::Rails::Helpers::JavaScriptIncludeTag

  private

  def stylesheet_tag(name)
    stylesheet_link_tag(name)
  end

  def script_tag(name)
    javascript_include_tag(name, defer: "defer")
  end
end
