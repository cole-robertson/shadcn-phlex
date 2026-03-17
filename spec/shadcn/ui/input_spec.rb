# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::Input do
  it "renders an input element" do
    el = render_root(described_class.new)
    expect(el.name).to eq("input")
  end

  it "sets data-slot='input'" do
    el = render_root(described_class.new)
    expect(el["data-slot"]).to eq("input")
  end

  it "defaults to type='text'" do
    el = render_root(described_class.new)
    expect(el["type"]).to eq("text")
  end

  it "accepts custom type" do
    el = render_root(described_class.new(type: "email"))
    expect(el["type"]).to eq("email")
  end

  it "applies standard input classes" do
    el = render_root(described_class.new)
    classes = el["class"]
    expect(classes).to include("h-9")
    expect(classes).to include("w-full")
    expect(classes).to include("rounded-md")
    expect(classes).to include("border")
    expect(classes).to include("border-input")
    expect(classes).to include("shadow-xs")
  end

  it "does not include flex" do
    el = render_root(described_class.new)
    # "flex" should not appear as a standalone class (only as part of file:inline-flex)
    classes = el["class"].split(" ")
    expect(classes).not_to include("flex")
  end

  it "passes through additional attributes" do
    el = render_root(described_class.new(placeholder: "Enter email", name: "email"))
    expect(el["placeholder"]).to eq("Enter email")
    expect(el["name"]).to eq("email")
  end
end
