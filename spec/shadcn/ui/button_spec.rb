# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::Button do
  it "renders a button element by default" do
    el = render_root(described_class.new { "Click me" })
    expect(el.name).to eq("button")
    expect(el.text).to eq("Click me")
  end

  it "sets data-slot='button'" do
    el = render_root(described_class.new { "ok" })
    expect(el["data-slot"]).to eq("button")
  end

  describe "variants" do
    it "applies default variant classes" do
      el = render_root(described_class.new(variant: :default) { "btn" })
      expect(el["class"]).to include("bg-primary")
      expect(el["class"]).to include("text-primary-foreground")
    end

    it "applies destructive variant classes" do
      el = render_root(described_class.new(variant: :destructive) { "del" })
      expect(el["class"]).to include("bg-destructive")
      expect(el["class"]).to include("text-white")
    end

    it "applies outline variant classes" do
      el = render_root(described_class.new(variant: :outline) { "out" })
      expect(el["class"]).to include("border")
      expect(el["class"]).to include("bg-background")
      expect(el["class"]).to include("shadow-xs")
    end

    it "applies secondary variant classes" do
      el = render_root(described_class.new(variant: :secondary) { "sec" })
      expect(el["class"]).to include("bg-secondary")
    end

    it "applies ghost variant classes" do
      el = render_root(described_class.new(variant: :ghost) { "ghost" })
      classes = el["class"]
      expect(classes).not_to include("bg-primary")
      expect(classes).to include("hover:bg-accent")
    end

    it "applies link variant classes" do
      el = render_root(described_class.new(variant: :link) { "lnk" })
      expect(el["class"]).to include("text-primary")
      expect(el["class"]).to include("underline-offset-4")
    end
  end

  describe "sizes" do
    it "applies default size" do
      el = render_root(described_class.new(size: :default) { "btn" })
      expect(el["class"]).to include("h-9")
    end

    it "applies xs size" do
      el = render_root(described_class.new(size: :xs) { "btn" })
      expect(el["class"]).to include("h-6")
      expect(el["class"]).to include("text-xs")
    end

    it "applies sm size" do
      el = render_root(described_class.new(size: :sm) { "btn" })
      expect(el["class"]).to include("h-8")
    end

    it "applies lg size" do
      el = render_root(described_class.new(size: :lg) { "btn" })
      expect(el["class"]).to include("h-10")
    end

    it "applies icon size" do
      el = render_root(described_class.new(size: :icon) { "i" })
      expect(el["class"]).to include("size-9")
    end
  end

  describe "tag override" do
    it "renders as an anchor when tag: :a" do
      el = render_root(described_class.new(tag: :a, href: "/") { "link" })
      expect(el.name).to eq("a")
      expect(el["href"]).to eq("/")
      expect(el["data-slot"]).to eq("button")
    end
  end

  describe "class merging" do
    it "merges custom classes" do
      el = render_root(described_class.new(class: "w-full mt-4") { "btn" })
      expect(el["class"]).to include("w-full")
      expect(el["class"]).to include("mt-4")
    end
  end

  describe "base classes (shadcn compatibility)" do
    it "includes shrink-0" do
      el = render_root(described_class.new { "btn" })
      expect(el["class"]).to include("shrink-0")
    end

    it "includes outline-none" do
      el = render_root(described_class.new { "btn" })
      expect(el["class"]).to include("outline-none")
    end

    it "does not include cursor-pointer" do
      el = render_root(described_class.new { "btn" })
      expect(el["class"]).not_to include("cursor-pointer")
    end

    it "default variant does not include shadow-xs" do
      el = render_root(described_class.new(variant: :default) { "btn" })
      expect(el["class"]).not_to include("shadow-xs")
    end
  end
end
