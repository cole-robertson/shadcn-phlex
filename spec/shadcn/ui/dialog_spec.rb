# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::Dialog do
  it "renders with Stimulus controller" do
    el = render_root(described_class.new { "" })
    expect(el["data-slot"]).to eq("dialog")
    expect(el["data-controller"]).to eq("shadcn--dialog")
  end

  it "defaults to closed" do
    el = render_root(described_class.new { "" })
    # Phlex omits boolean false attributes
    expect(el["data-shadcn--dialog-open-value"]).to be_nil
  end
end

RSpec.describe Shadcn::UI::DialogTrigger do
  it "renders a button with show action" do
    el = render_root(described_class.new { "Open" })
    expect(el.name).to eq("button")
    expect(el["data-slot"]).to eq("dialog-trigger")
    expect(el["data-action"]).to include("click->shadcn--dialog#show")
  end
end

RSpec.describe Shadcn::UI::DialogOverlay do
  it "renders with overlay classes" do
    el = render_root(described_class.new)
    expect(el["data-slot"]).to eq("dialog-overlay")
    expect(el["class"]).to include("fixed")
    expect(el["class"]).to include("bg-black/50")
    expect(el["hidden"]).to eq("")
  end
end

RSpec.describe Shadcn::UI::DialogContent do
  it "renders overlay and content" do
    doc = parse_component(described_class.new { "body" })
    overlay = doc.at_css('[data-slot="dialog-overlay"]')
    content = doc.at_css('[data-slot="dialog-content"]')
    expect(overlay).not_to be_nil
    expect(content).not_to be_nil
  end

  it "includes close button by default" do
    doc = parse_component(described_class.new { "body" })
    close = doc.at_css('[data-slot="dialog-close"]')
    expect(close).not_to be_nil
    expect(close["data-action"]).to include("click->shadcn--dialog#hide")
  end

  it "can hide close button" do
    doc = parse_component(described_class.new(show_close_button: false) { "body" })
    close = doc.at_css('[data-slot="dialog-close"]')
    expect(close).to be_nil
  end

  it "has outline-none" do
    doc = parse_component(described_class.new { "body" })
    content = doc.at_css('[data-slot="dialog-content"]')
    expect(content["class"]).to include("outline-none")
  end

  it "content starts hidden" do
    doc = parse_component(described_class.new { "body" })
    content = doc.at_css('[data-slot="dialog-content"]')
    expect(content["hidden"]).to eq("")
  end
end

RSpec.describe Shadcn::UI::DialogTitle do
  it "renders h2 with correct classes" do
    el = render_root(described_class.new { "Title" })
    expect(el.name).to eq("h2")
    expect(el["data-slot"]).to eq("dialog-title")
    expect(el["class"]).to include("font-semibold")
    expect(el["class"]).not_to include("tracking-tight")
  end
end

RSpec.describe Shadcn::UI::DialogClose do
  it "wires hide action" do
    el = render_root(described_class.new { "Close" })
    expect(el["data-action"]).to include("click->shadcn--dialog#hide")
  end
end
