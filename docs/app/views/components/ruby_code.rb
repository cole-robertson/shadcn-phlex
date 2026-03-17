# frozen_string_literal: true

module Components
  class RubyCode < Phlex::HTML
    KEYWORDS = %w[class def do end if else elsif unless module include require return yield nil true false self].freeze
    METHODS = /\b(ui_\w+|render|plain|div|span|h1|h2|h3|h4|p|a|label|button|input|form)\b/

    def initialize(code:, filename: nil)
      @code = code.strip
      @filename = filename
    end

    def view_template
      div(class: "rounded-lg border bg-card overflow-hidden") do
        if @filename
          div(class: "border-b px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50") { @filename }
        end
        pre(class: "p-4 text-[13px] font-mono overflow-x-auto leading-relaxed") do
          code { raw(Phlex::HTML::SafeValue.new(highlight(@code))) }
        end
      end
    end

    private

    def highlight(source)
      # Escape HTML first
      escaped = source
        .gsub("&", "&amp;")
        .gsub("<", "&lt;")
        .gsub(">", "&gt;")

      # Use placeholders to avoid double-matching
      tokens = []

      # Strings (double and single quoted) — replace with placeholders
      escaped = escaped.gsub(/"([^"]*)"/) do
        idx = tokens.length
        tokens << %(<span class="hl-str">"#{$1}"</span>)
        "\x00TOKEN#{idx}\x00"
      end
      escaped = escaped.gsub(/'([^']*)'/) do
        idx = tokens.length
        tokens << %(<span class="hl-str">'#{$1}'</span>)
        "\x00TOKEN#{idx}\x00"
      end

      # Comments
      escaped = escaped.gsub(/(#.*)$/) do
        idx = tokens.length
        tokens << %(<span class="hl-comment">#{$1}</span>)
        "\x00TOKEN#{idx}\x00"
      end

      # Instance variables
      escaped = escaped.gsub(/@[\w.]+/) do |m|
        idx = tokens.length
        tokens << %(<span class="hl-ivar">#{m}</span>)
        "\x00TOKEN#{idx}\x00"
      end

      # Symbols
      escaped = escaped.gsub(/:(\w+)/) do
        idx = tokens.length
        tokens << %(<span class="hl-sym">:#{$1}</span>)
        "\x00TOKEN#{idx}\x00"
      end

      # ui_* method calls
      escaped = escaped.gsub(/\b(ui_\w+)\b/) do
        idx = tokens.length
        tokens << %(<span class="hl-method">#{$1}</span>)
        "\x00TOKEN#{idx}\x00"
      end

      # Keywords
      KEYWORDS.each do |kw|
        escaped = escaped.gsub(/\b#{kw}\b/) do
          idx = tokens.length
          tokens << %(<span class="hl-kw">#{kw}</span>)
          "\x00TOKEN#{idx}\x00"
        end
      end

      # Restore tokens
      tokens.each_with_index do |token, idx|
        escaped = escaped.gsub("\x00TOKEN#{idx}\x00", token)
      end

      escaped
    end
  end
end
