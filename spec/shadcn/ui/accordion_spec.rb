# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::Accordion do
  it "renders with Stimulus controller" do
    el = render_root(described_class.new { "" })
    expect(el["data-slot"]).to eq("accordion")
    expect(el["data-controller"]).to eq("shadcn--accordion")
  end

  it "defaults to single type" do
    el = render_root(described_class.new { "" })
    expect(el["data-shadcn--accordion-type-value"]).to eq("single")
  end

  it "supports multiple type" do
    el = render_root(described_class.new(type: "multiple") { "" })
    expect(el["data-shadcn--accordion-type-value"]).to eq("multiple")
  end
end

RSpec.describe Shadcn::UI::AccordionItem do
  it "renders with data-state" do
    el = render_root(described_class.new { "" })
    expect(el["data-slot"]).to eq("accordion-item")
    expect(el["data-state"]).to eq("closed")
  end

  it "can start open" do
    el = render_root(described_class.new(open: true) { "" })
    expect(el["data-state"]).to eq("open")
  end
end

RSpec.describe Shadcn::UI::AccordionTrigger do
  it "renders button with toggle action" do
    doc = parse_component(described_class.new { "Item 1" })
    trigger = doc.at_css('[data-slot="accordion-trigger"]')
    expect(trigger.name).to eq("button")
    expect(trigger["data-action"]).to include("click->shadcn--accordion#toggle")
  end

  it "renders chevron icon" do
    doc = parse_component(described_class.new { "Item" })
    svg = doc.at_css("svg")
    expect(svg).not_to be_nil
  end
end

RSpec.describe Shadcn::UI::AccordionContent do
  it "starts hidden" do
    doc = parse_component(described_class.new { "content" })
    content = doc.at_css('[data-slot="accordion-content"]')
    expect(content["hidden"]).to eq("")
  end
end
