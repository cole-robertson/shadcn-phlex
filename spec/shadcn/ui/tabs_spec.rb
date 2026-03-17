# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::Tabs do
  it "renders with Stimulus controller" do
    el = render_root(described_class.new { "" })
    expect(el["data-slot"]).to eq("tabs")
    expect(el["data-controller"]).to eq("shadcn--tabs")
  end

  it "defaults to horizontal orientation" do
    el = render_root(described_class.new { "" })
    expect(el["data-orientation"]).to eq("horizontal")
  end
end

RSpec.describe Shadcn::UI::TabsTrigger do
  it "renders button with data-value" do
    el = render_root(described_class.new(value: "tab1") { "Tab 1" })
    expect(el.name).to eq("button")
    expect(el["data-value"]).to eq("tab1")
    expect(el["role"]).to eq("tab")
  end

  it "wires Stimulus actions" do
    el = render_root(described_class.new(value: "t") { "T" })
    expect(el["data-action"]).to include("click->shadcn--tabs#select")
    expect(el["data-action"]).to include("keydown->shadcn--tabs#keydown")
  end

  it "includes line variant after: pseudo-element classes" do
    el = render_root(described_class.new(value: "t") { "T" })
    expect(el["class"]).to include("after:absolute")
    expect(el["class"]).to include("after:bg-foreground")
  end
end

RSpec.describe Shadcn::UI::TabsContent do
  it "starts hidden" do
    el = render_root(described_class.new(value: "tab1") { "Content" })
    expect(el["hidden"]).to eq("")
    expect(el["role"]).to eq("tabpanel")
  end
end
