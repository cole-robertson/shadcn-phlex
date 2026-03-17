# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::Card do
  it "renders a div with data-slot='card'" do
    el = render_root(described_class.new { "content" })
    expect(el.name).to eq("div")
    expect(el["data-slot"]).to eq("card")
  end

  it "applies card classes" do
    el = render_root(described_class.new { "x" })
    expect(el["class"]).to include("bg-card")
    expect(el["class"]).to include("rounded-xl")
    expect(el["class"]).to include("border")
    expect(el["class"]).to include("shadow-sm")
  end

  it "merges custom classes" do
    el = render_root(described_class.new(class: "max-w-sm") { "x" })
    expect(el["class"]).to include("max-w-sm")
    expect(el["class"]).to include("bg-card")
  end
end

RSpec.describe Shadcn::UI::CardHeader do
  it "renders with data-slot='card-header'" do
    el = render_root(described_class.new { "header" })
    expect(el["data-slot"]).to eq("card-header")
    expect(el["class"]).to include("px-6")
  end
end

RSpec.describe Shadcn::UI::CardTitle do
  it "renders with data-slot='card-title'" do
    el = render_root(described_class.new { "Title" })
    expect(el["data-slot"]).to eq("card-title")
    expect(el["class"]).to include("font-semibold")
  end
end

RSpec.describe Shadcn::UI::CardDescription do
  it "renders with data-slot='card-description'" do
    el = render_root(described_class.new { "desc" })
    expect(el["data-slot"]).to eq("card-description")
    expect(el["class"]).to include("text-muted-foreground")
  end
end

RSpec.describe Shadcn::UI::CardContent do
  it "renders with data-slot='card-content'" do
    el = render_root(described_class.new { "body" })
    expect(el["data-slot"]).to eq("card-content")
    expect(el["class"]).to include("px-6")
  end
end

RSpec.describe Shadcn::UI::CardFooter do
  it "renders with data-slot='card-footer'" do
    el = render_root(described_class.new { "footer" })
    expect(el["data-slot"]).to eq("card-footer")
    expect(el["class"]).to include("flex")
  end
end
