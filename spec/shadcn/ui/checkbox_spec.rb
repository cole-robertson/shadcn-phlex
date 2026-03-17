# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::Checkbox do
  it "renders with data-slot='checkbox'" do
    doc = parse_component(described_class.new)
    checkbox = doc.at_css('[data-slot="checkbox"]')
    expect(checkbox).not_to be_nil
    expect(checkbox.name).to eq("button")
  end

  it "defaults to unchecked state" do
    doc = parse_component(described_class.new)
    checkbox = doc.at_css('[data-slot="checkbox"]')
    expect(checkbox["data-state"]).to eq("unchecked")
    # Phlex omits boolean false attributes
    expect(checkbox["aria-checked"]).to be_nil
  end

  it "renders checked state" do
    doc = parse_component(described_class.new(checked: true))
    checkbox = doc.at_css('[data-slot="checkbox"]')
    expect(checkbox["data-state"]).to eq("checked")
    # Phlex renders boolean true as valueless attribute
    expect(checkbox.key?("aria-checked")).to be true
  end

  it "renders check icon when checked" do
    doc = parse_component(described_class.new(checked: true))
    indicator = doc.at_css('[data-slot="checkbox-indicator"]')
    expect(indicator).not_to be_nil
    expect(doc.at_css("svg")).not_to be_nil
  end

  it "does not render check icon when unchecked" do
    doc = parse_component(described_class.new(checked: false))
    indicator = doc.at_css('[data-slot="checkbox-indicator"]')
    expect(indicator).to be_nil
  end

  it "has role='checkbox'" do
    doc = parse_component(described_class.new)
    checkbox = doc.at_css('[data-slot="checkbox"]')
    expect(checkbox["role"]).to eq("checkbox")
  end

  it "wires Stimulus controller" do
    doc = parse_component(described_class.new)
    wrapper = doc.at_css('[data-controller="shadcn--checkbox"]')
    expect(wrapper).not_to be_nil
  end

  it "wires toggle action" do
    doc = parse_component(described_class.new)
    checkbox = doc.at_css('[data-slot="checkbox"]')
    expect(checkbox["data-action"]).to include("click->shadcn--checkbox#toggle")
  end

  describe "form integration" do
    it "does not render hidden input without name" do
      doc = parse_component(described_class.new)
      expect(doc.at_css('input[type="hidden"]')).to be_nil
    end

    it "renders hidden input with name" do
      doc = parse_component(described_class.new(name: "user[terms]"))
      hidden = doc.at_css('input[type="hidden"]')
      expect(hidden).not_to be_nil
      expect(hidden["name"]).to eq("user[terms]")
      expect(hidden["value"]).to eq("0")
    end

    it "sets hidden input value to 1 when checked" do
      doc = parse_component(described_class.new(name: "terms", checked: true))
      hidden = doc.at_css('input[type="hidden"]')
      expect(hidden["value"]).to eq("1")
    end
  end
end
