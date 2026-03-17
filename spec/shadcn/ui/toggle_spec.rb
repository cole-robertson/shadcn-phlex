# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::Toggle do
  it "renders a button" do
    el = render_root(described_class.new { "B" })
    expect(el.name).to eq("button")
    expect(el["data-slot"]).to eq("toggle")
  end

  it "defaults to unpressed" do
    el = render_root(described_class.new { "B" })
    expect(el["data-state"]).to eq("off")
    expect(el["aria-pressed"]).to be_nil
  end

  it "renders pressed state" do
    el = render_root(described_class.new(pressed: true) { "B" })
    expect(el["data-state"]).to eq("on")
    expect(el.key?("aria-pressed")).to be true
  end

  it "wires Stimulus controller" do
    el = render_root(described_class.new { "B" })
    expect(el["data-controller"]).to eq("shadcn--toggle")
    expect(el["data-action"]).to include("click->shadcn--toggle#toggle")
  end

  describe "variants" do
    it "default variant is bg-transparent" do
      el = render_root(described_class.new(variant: :default) { "B" })
      expect(el["class"]).to include("bg-transparent")
    end

    it "outline variant has border" do
      el = render_root(described_class.new(variant: :outline) { "B" })
      expect(el["class"]).to include("border")
      expect(el["class"]).to include("shadow-xs")
    end
  end
end
