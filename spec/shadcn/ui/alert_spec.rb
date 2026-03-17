# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::Alert do
  it "renders with role='alert'" do
    el = render_root(described_class.new { "msg" })
    expect(el["role"]).to eq("alert")
    expect(el["data-slot"]).to eq("alert")
  end

  it "default variant uses text-card-foreground" do
    el = render_root(described_class.new(variant: :default) { "msg" })
    expect(el["class"]).to include("text-card-foreground")
    expect(el["class"]).not_to match(/\btext-foreground\b/)
  end

  it "destructive variant uses text-destructive" do
    el = render_root(described_class.new(variant: :destructive) { "err" })
    expect(el["class"]).to include("text-destructive")
  end

  it "uses grid layout with svg-aware columns" do
    el = render_root(described_class.new { "msg" })
    expect(el["class"]).to include("grid")
    expect(el["class"]).to include("items-start")
  end
end

RSpec.describe Shadcn::UI::AlertTitle do
  it "renders with data-slot='alert-title'" do
    el = render_root(described_class.new { "Warning" })
    expect(el["data-slot"]).to eq("alert-title")
    expect(el["class"]).to include("font-medium")
  end
end

RSpec.describe Shadcn::UI::AlertDescription do
  it "renders with data-slot='alert-description'" do
    el = render_root(described_class.new { "Details" })
    expect(el["data-slot"]).to eq("alert-description")
    expect(el["class"]).to include("text-muted-foreground")
  end
end
