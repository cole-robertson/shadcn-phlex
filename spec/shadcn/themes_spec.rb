# frozen_string_literal: true

require "spec_helper"

RSpec.describe Shadcn::Themes do
  describe ".generate_css" do
    it "generates CSS with :root and .dark blocks" do
      css = described_class.generate_css(base_color: :neutral)
      expect(css).to include(":root {")
      expect(css).to include(".dark {")
    end

    it "includes --radius" do
      css = described_class.generate_css(base_color: :neutral, radius: "0.5rem")
      expect(css).to include("--radius: 0.5rem")
    end

    it "includes all required CSS variables" do
      css = described_class.generate_css(base_color: :neutral)
      %w[background foreground card card-foreground popover popover-foreground
         primary primary-foreground secondary secondary-foreground
         muted muted-foreground accent accent-foreground destructive
         border input ring sidebar sidebar-foreground].each do |var|
        expect(css).to include("--#{var}:"), "Missing --#{var}"
      end
    end

    it "merges accent color overrides" do
      css = described_class.generate_css(base_color: :neutral, accent_color: :blue)
      # Blue accent should override primary
      expect(css).to include("oklch(0.546")  # blue primary light
    end

    it "raises for unknown base color" do
      expect { described_class.generate_css(base_color: :nonexistent) }
        .to raise_error(ArgumentError, /Unknown base color/)
    end

    it "raises for unknown accent color" do
      expect { described_class.generate_css(base_color: :neutral, accent_color: :nonexistent) }
        .to raise_error(ArgumentError, /Unknown accent color/)
    end

    it "generates valid CSS for all base colors" do
      %i[neutral stone zinc mauve olive mist taupe].each do |color|
        css = described_class.generate_css(base_color: color)
        expect(css).to include(":root {"), "#{color} missing :root"
        expect(css).to include(".dark {"), "#{color} missing .dark"
      end
    end

    it "generates CSS for all accent colors" do
      %i[blue red green orange violet amber cyan emerald fuchsia indigo lime pink purple rose sky teal yellow].each do |accent|
        css = described_class.generate_css(base_color: :neutral, accent_color: accent)
        expect(css).to include("--primary:"), "#{accent} missing --primary"
      end
    end

    it "outputs shadcn-compatible format (hyphens not underscores)" do
      css = described_class.generate_css(base_color: :neutral)
      expect(css).to include("--card-foreground:")
      expect(css).not_to include("--card_foreground:")
    end
  end
end
