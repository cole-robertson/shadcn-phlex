# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::Badge do
  it "renders a span element" do
    el = render_root(described_class.new { "New" })
    expect(el.name).to eq("span")
    expect(el.text).to eq("New")
  end

  it "sets data-slot='badge'" do
    el = render_root(described_class.new { "x" })
    expect(el["data-slot"]).to eq("badge")
  end

  it "uses rounded-full (not rounded-md)" do
    el = render_root(described_class.new { "x" })
    expect(el["class"]).to include("rounded-full")
    expect(el["class"]).not_to include("rounded-md")
  end

  it "includes overflow-hidden" do
    el = render_root(described_class.new { "x" })
    expect(el["class"]).to include("overflow-hidden")
  end

  describe "variants" do
    it "default variant includes bg-primary" do
      el = render_root(described_class.new(variant: :default) { "x" })
      expect(el["class"]).to include("bg-primary")
    end

    it "outline variant includes border-border" do
      el = render_root(described_class.new(variant: :outline) { "x" })
      expect(el["class"]).to include("border-border")
    end

    it "destructive variant includes bg-destructive" do
      el = render_root(described_class.new(variant: :destructive) { "x" })
      expect(el["class"]).to include("bg-destructive")
    end
  end
end
