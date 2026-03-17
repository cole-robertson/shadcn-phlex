# frozen_string_literal: true

module Shadcn
  class Base < Phlex::HTML
    TAILWIND_MERGER = TailwindMerge::Merger.new

    private

    # Equivalent to shadcn's cn() utility - merges Tailwind classes intelligently
    def cn(*classes)
      merged = classes.flatten.compact.join(" ")
      TAILWIND_MERGER.merge(merged)
    end

    # Merge user-provided attrs with defaults, intelligently merging classes
    def merge_attrs(defaults, overrides)
      result = defaults.merge(overrides) do |key, default_val, override_val|
        if key == :class
          cn(default_val, override_val)
        else
          override_val
        end
      end
      result
    end
  end
end
