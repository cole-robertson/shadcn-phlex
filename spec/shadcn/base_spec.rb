# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::Base do
  # Create a test component to exercise the base class
  let(:test_class) do
    Class.new(described_class) do
      def initialize(classes:)
        @classes = classes
      end

      def view_template
        div(class: cn(*@classes)) { "test" }
      end
    end
  end

  describe "#cn" do
    it "joins multiple class strings" do
      html = test_class.new(classes: ["foo", "bar"]).call
      doc = Nokogiri::HTML::DocumentFragment.parse(html)
      expect(doc.at_css("div")["class"]).to include("foo")
      expect(doc.at_css("div")["class"]).to include("bar")
    end

    it "compacts nil values" do
      html = test_class.new(classes: ["foo", nil, "bar"]).call
      doc = Nokogiri::HTML::DocumentFragment.parse(html)
      classes = doc.at_css("div")["class"]
      expect(classes).to include("foo")
      expect(classes).to include("bar")
    end

    it "merges conflicting Tailwind classes" do
      html = test_class.new(classes: ["px-4", "px-6"]).call
      doc = Nokogiri::HTML::DocumentFragment.parse(html)
      classes = doc.at_css("div")["class"]
      # tailwind_merge should keep only px-6
      expect(classes).to include("px-6")
      expect(classes).not_to include("px-4")
    end
  end
end
