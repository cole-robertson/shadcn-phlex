# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::Switch do
  it "renders with data-slot='switch'" do
    doc = parse_component(described_class.new)
    sw = doc.at_css('[data-slot="switch"]')
    expect(sw).not_to be_nil
    expect(sw["role"]).to eq("switch")
  end

  it "defaults to unchecked" do
    doc = parse_component(described_class.new)
    sw = doc.at_css('[data-slot="switch"]')
    expect(sw["data-state"]).to eq("unchecked")
    expect(sw["aria-checked"]).to be_nil
  end

  it "renders checked state" do
    doc = parse_component(described_class.new(checked: true))
    sw = doc.at_css('[data-slot="switch"]')
    expect(sw["data-state"]).to eq("checked")
    expect(sw.key?("aria-checked")).to be true
  end

  it "renders thumb element" do
    doc = parse_component(described_class.new)
    thumb = doc.at_css('[data-slot="switch-thumb"]')
    expect(thumb).not_to be_nil
  end

  it "supports size variants" do
    doc = parse_component(described_class.new(size: :sm))
    sw = doc.at_css('[data-slot="switch"]')
    expect(sw["data-size"]).to eq("sm")
  end

  describe "form integration" do
    it "renders hidden input with name" do
      doc = parse_component(described_class.new(name: "notifications"))
      hidden = doc.at_css('input[type="hidden"]')
      expect(hidden).not_to be_nil
      expect(hidden["name"]).to eq("notifications")
    end

    it "sets value based on checked state" do
      doc = parse_component(described_class.new(name: "n", checked: true))
      expect(doc.at_css('input[type="hidden"]')["value"]).to eq("1")
    end
  end
end
