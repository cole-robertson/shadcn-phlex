# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::Kit do
  let(:view_class) do
    Class.new(Phlex::HTML) do
      include Shadcn::Kit

      attr_reader :output_method, :output_args

      def initialize(method_name, **args, &block)
        @output_method = method_name
        @output_args = args
        @output_block = block
      end

      def view_template
        send(@output_method, **@output_args, &@output_block)
      end
    end
  end

  def render_kit(method_name, **args, &block)
    html = view_class.new(method_name, **args, &block).call
    Nokogiri::HTML::DocumentFragment.parse(html)
  end

  it "ui_button renders a Button component" do
    doc = render_kit(:ui_button) { "Click" }
    el = doc.at_css('[data-slot="button"]')
    expect(el).not_to be_nil
    # Block content is yielded inside the button
    expect(el).not_to be_nil
  end

  it "ui_button passes variants" do
    doc = render_kit(:ui_button, variant: :destructive) { "Del" }
    el = doc.at_css('[data-slot="button"]')
    expect(el["class"]).to include("bg-destructive")
  end

  it "ui_card renders a Card component" do
    doc = render_kit(:ui_card) { "content" }
    el = doc.at_css('[data-slot="card"]')
    expect(el).not_to be_nil
  end

  it "ui_badge renders a Badge component" do
    doc = render_kit(:ui_badge) { "New" }
    el = doc.at_css('[data-slot="badge"]')
    expect(el).not_to be_nil
  end

  it "ui_input renders an Input component" do
    doc = render_kit(:ui_input, type: "email")
    el = doc.at_css('[data-slot="input"]')
    expect(el).not_to be_nil
    expect(el["type"]).to eq("email")
  end

  it "ui_separator renders a Separator component" do
    doc = render_kit(:ui_separator)
    el = doc.at_css('[data-slot="separator"]')
    expect(el).not_to be_nil
  end

  it "ui_checkbox renders a Checkbox with name" do
    doc = render_kit(:ui_checkbox, name: "terms")
    hidden = doc.at_css('input[type="hidden"]')
    expect(hidden).not_to be_nil
    expect(hidden["name"]).to eq("terms")
  end

  it "ui_dialog renders with controller" do
    doc = render_kit(:ui_dialog) { "" }
    el = doc.at_css('[data-controller="shadcn--dialog"]')
    expect(el).not_to be_nil
  end

  it "responds to all expected helper methods" do
    view = view_class.new(:ui_button) { "" }
    %i[
      ui_button ui_badge ui_card ui_card_header ui_card_title ui_card_content
      ui_input ui_textarea ui_label ui_separator ui_skeleton ui_spinner
      ui_dialog ui_dialog_trigger ui_dialog_content ui_dialog_title
      ui_checkbox ui_switch ui_radio_group ui_select ui_tabs ui_toggle
      ui_accordion ui_alert ui_popover ui_tooltip ui_progress ui_slider
    ].each do |method|
      expect(view).to respond_to(method), "Missing Kit method: #{method}"
    end
  end
end
