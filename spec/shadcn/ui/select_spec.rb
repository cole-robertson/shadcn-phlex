# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::Select do
  it "renders with Stimulus controller" do
    el = render_root(described_class.new { "" })
    expect(el["data-slot"]).to eq("select")
    expect(el["data-controller"]).to eq("shadcn--select")
  end

  it "renders hidden input when name provided" do
    doc = parse_component(described_class.new(name: "role") { "" })
    hidden = doc.at_css('input[type="hidden"]')
    expect(hidden).not_to be_nil
    expect(hidden["name"]).to eq("role")
  end

  it "does not render hidden input without name" do
    doc = parse_component(described_class.new { "" })
    expect(doc.at_css('input[type="hidden"]')).to be_nil
  end
end

RSpec.describe Shadcn::UI::SelectTrigger do
  it "renders a button with combobox role" do
    doc = parse_component(described_class.new { "Pick" })
    trigger = doc.at_css('[data-slot="select-trigger"]')
    expect(trigger.name).to eq("button")
    expect(trigger["role"]).to eq("combobox")
  end

  it "uses w-fit not w-full" do
    doc = parse_component(described_class.new { "Pick" })
    trigger = doc.at_css('[data-slot="select-trigger"]')
    classes = trigger["class"]
    expect(classes).to include("w-fit")
    expect(classes).not_to match(/\bw-full\b/)
  end

  it "wires toggle action" do
    doc = parse_component(described_class.new { "Pick" })
    trigger = doc.at_css('[data-slot="select-trigger"]')
    expect(trigger["data-action"]).to include("click->shadcn--select#toggle")
  end

  it "renders chevron icon" do
    doc = parse_component(described_class.new { "Pick" })
    svg = doc.at_css('[data-slot="select-trigger"] svg')
    expect(svg).not_to be_nil
  end
end

RSpec.describe Shadcn::UI::SelectContent do
  it "starts hidden" do
    doc = parse_component(described_class.new { "" })
    content = doc.at_css('[data-slot="select-content"]')
    expect(content["hidden"]).to eq("")
  end
end

RSpec.describe Shadcn::UI::SelectItem do
  it "renders with data-value" do
    doc = parse_component(described_class.new(value: "admin") { "Admin" })
    item = doc.at_css('[data-slot="select-item"]')
    expect(item["data-value"]).to eq("admin")
  end

  it "has check indicator on the right side" do
    doc = parse_component(described_class.new(value: "x") { "X" })
    item = doc.at_css('[data-slot="select-item"]')
    expect(item["class"]).to include("pr-8")
    expect(item["class"]).to include("pl-2")
    indicator = item.at_css("span")
    expect(indicator["class"]).to include("right-2")
  end
end
