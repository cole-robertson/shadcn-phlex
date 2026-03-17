# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::UI::TextField do
  it "renders a field with label and input" do
    doc = parse_component(described_class.new(label: "Email", name: "email"))
    field = doc.at_css('[data-slot="field"]')
    expect(field).not_to be_nil

    label = doc.at_css('[data-slot="label"]')
    expect(label).not_to be_nil
    expect(label.text.strip).to eq("Email")

    input = doc.at_css('[data-slot="input"]')
    expect(input).not_to be_nil
    expect(input["name"]).to eq("email")
  end

  it "generates id from name" do
    doc = parse_component(described_class.new(name: "user[email]"))
    input = doc.at_css('[data-slot="input"]')
    expect(input["id"]).to eq("user_email")
  end

  it "renders description when provided" do
    doc = parse_component(described_class.new(name: "x", description: "Help text"))
    desc = doc.at_css('[data-slot="field-description"]')
    expect(desc).not_to be_nil
    expect(desc.text.strip).to eq("Help text")
  end

  it "renders error instead of description when error present" do
    doc = parse_component(described_class.new(name: "x", description: "Help", error: "is required"))
    desc = doc.at_css('[data-slot="field-description"]')
    expect(desc).to be_nil

    error = doc.at_css('[data-slot="field-error"]')
    expect(error).not_to be_nil
    expect(error.text.strip).to eq("is required")
  end

  it "sets aria-invalid when error present" do
    doc = parse_component(described_class.new(name: "x", error: "bad"))
    input = doc.at_css('[data-slot="input"]')
    expect(input["aria-invalid"]).to eq("true")
  end

  it "renders required asterisk" do
    doc = parse_component(described_class.new(label: "Name", name: "n", required: true))
    label = doc.at_css('[data-slot="label"]')
    expect(label.text).to include("*")
  end

  it "renders without label" do
    doc = parse_component(described_class.new(name: "x"))
    expect(doc.at_css('[data-slot="label"]')).to be_nil
    expect(doc.at_css('[data-slot="input"]')).not_to be_nil
  end

  it "passes through input attributes" do
    doc = parse_component(described_class.new(name: "x", placeholder: "Type...", type: "email"))
    input = doc.at_css('[data-slot="input"]')
    expect(input["placeholder"]).to eq("Type...")
    expect(input["type"]).to eq("email")
  end
end

RSpec.describe Shadcn::UI::TextareaField do
  it "renders a field with label and textarea" do
    doc = parse_component(described_class.new(label: "Bio", name: "bio"))
    field = doc.at_css('[data-slot="field"]')
    expect(field).not_to be_nil

    textarea = doc.at_css('[data-slot="textarea"]')
    expect(textarea).not_to be_nil
    expect(textarea["name"]).to eq("bio")
  end

  it "renders error" do
    doc = parse_component(described_class.new(name: "x", error: "too short"))
    error = doc.at_css('[data-slot="field-error"]')
    expect(error).not_to be_nil
  end
end
