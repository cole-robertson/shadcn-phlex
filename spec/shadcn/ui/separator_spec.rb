# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::Separator do
  it "renders with data-slot='separator'" do
    el = render_root(described_class.new)
    expect(el["data-slot"]).to eq("separator")
  end

  it "uses data-orientation CSS selectors (not Ruby conditionals)" do
    el = render_root(described_class.new(orientation: :horizontal))
    classes = el["class"]
    expect(classes).to include("data-[orientation=horizontal]:h-px")
    expect(classes).to include("data-[orientation=horizontal]:w-full")
  end

  it "sets data-orientation attribute" do
    el = render_root(described_class.new(orientation: :vertical))
    expect(el["data-orientation"]).to eq("vertical")
  end

  it "defaults to role='none' when decorative" do
    el = render_root(described_class.new)
    expect(el["role"]).to eq("none")
  end

  it "sets role='separator' when not decorative" do
    el = render_root(described_class.new(decorative: false))
    expect(el["role"]).to eq("separator")
  end
end
