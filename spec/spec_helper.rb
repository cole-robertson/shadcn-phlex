# frozen_string_literal: true

require "bundler/setup"
require "nokogiri"
require "shadcn"

module RenderHelper
  # Render a Phlex component to an HTML string
  def render_component(component)
    component.call
  end

  # Render and parse into Nokogiri for assertions
  def parse_component(component)
    html = render_component(component)
    Nokogiri::HTML::DocumentFragment.parse(html)
  end

  # Shorthand: render and return the root element
  def render_root(component)
    doc = parse_component(component)
    doc.children.first
  end
end

RSpec.configure do |config|
  config.include RenderHelper

  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.shared_context_metadata_behavior = :apply_to_host_groups
  config.filter_run_when_matching :focus
  config.disable_monkey_patching!
  config.order = :random
end
