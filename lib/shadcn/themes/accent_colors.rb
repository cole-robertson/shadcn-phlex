# frozen_string_literal: true

module Shadcn
  module Themes
    # All 17 accent color themes from shadcn v4
    # Each overrides only primary, secondary, chart, and sidebar-primary
    # Merged on top of a base color palette
    ACCENT_COLORS = {
      blue: {
        light: { primary: "oklch(0.546 0.245 262.881)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.944 0.032 255.585)", secondary_foreground: "oklch(0.379 0.146 265.522)" },
        dark: { primary: "oklch(0.623 0.214 259.815)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.268 0.058 264.695)", secondary_foreground: "oklch(0.809 0.105 251.813)" }
      },
      red: {
        light: { primary: "oklch(0.577 0.245 27.325)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.956 0.042 17.717)", secondary_foreground: "oklch(0.444 0.177 26.899)" },
        dark: { primary: "oklch(0.637 0.237 25.331)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.279 0.065 26.935)", secondary_foreground: "oklch(0.795 0.124 19.25)" }
      },
      green: {
        light: { primary: "oklch(0.595 0.18 163.319)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.952 0.043 166.913)", secondary_foreground: "oklch(0.448 0.119 163.331)" },
        dark: { primary: "oklch(0.648 0.2 163.122)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.268 0.058 163.564)", secondary_foreground: "oklch(0.809 0.108 163.599)" }
      },
      orange: {
        light: { primary: "oklch(0.705 0.213 47.604)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.954 0.043 48.561)", secondary_foreground: "oklch(0.533 0.164 48.998)" },
        dark: { primary: "oklch(0.705 0.213 47.604)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.282 0.06 47.917)", secondary_foreground: "oklch(0.822 0.107 47.857)" }
      },
      violet: {
        light: { primary: "oklch(0.541 0.281 293.009)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.943 0.05 294.588)", secondary_foreground: "oklch(0.408 0.208 292.361)" },
        dark: { primary: "oklch(0.624 0.249 292.717)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.265 0.075 293.141)", secondary_foreground: "oklch(0.802 0.128 293.051)" }
      },
      amber: {
        light: { primary: "oklch(0.769 0.188 70.08)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.963 0.043 76.318)", secondary_foreground: "oklch(0.555 0.163 48.998)" },
        dark: { primary: "oklch(0.769 0.188 70.08)", primary_foreground: "oklch(0.296 0.07 45.622)", secondary: "oklch(0.282 0.059 50.058)", secondary_foreground: "oklch(0.822 0.107 56.366)" }
      },
      cyan: {
        light: { primary: "oklch(0.6 0.118 184.714)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.952 0.032 190.9)", secondary_foreground: "oklch(0.448 0.098 184.364)" },
        dark: { primary: "oklch(0.648 0.145 184.525)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.263 0.048 184.525)", secondary_foreground: "oklch(0.797 0.08 184.525)" }
      },
      emerald: {
        light: { primary: "oklch(0.596 0.145 163.225)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.952 0.037 166.913)", secondary_foreground: "oklch(0.448 0.107 163.331)" },
        dark: { primary: "oklch(0.648 0.178 163.122)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.268 0.048 163.564)", secondary_foreground: "oklch(0.809 0.093 163.599)" }
      },
      fuchsia: {
        light: { primary: "oklch(0.591 0.293 322.896)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.952 0.05 325.661)", secondary_foreground: "oklch(0.444 0.222 323.29)" },
        dark: { primary: "oklch(0.667 0.295 322.15)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.274 0.076 322.827)", secondary_foreground: "oklch(0.814 0.151 322.827)" }
      },
      indigo: {
        light: { primary: "oklch(0.508 0.242 274.966)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.943 0.04 272.788)", secondary_foreground: "oklch(0.377 0.178 275.513)" },
        dark: { primary: "oklch(0.585 0.233 277.117)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.264 0.066 275.513)", secondary_foreground: "oklch(0.793 0.118 274.373)" }
      },
      lime: {
        light: { primary: "oklch(0.768 0.233 130.85)", primary_foreground: "oklch(0.296 0.1 130.85)", secondary: "oklch(0.959 0.058 131.684)", secondary_foreground: "oklch(0.487 0.174 131.684)" },
        dark: { primary: "oklch(0.768 0.233 130.85)", primary_foreground: "oklch(0.296 0.1 130.85)", secondary: "oklch(0.276 0.06 131.175)", secondary_foreground: "oklch(0.813 0.116 131.175)" }
      },
      pink: {
        light: { primary: "oklch(0.592 0.249 0.584)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.953 0.04 0.584)", secondary_foreground: "oklch(0.445 0.187 0.584)" },
        dark: { primary: "oklch(0.656 0.241 354.308)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.275 0.065 354.308)", secondary_foreground: "oklch(0.81 0.12 354.308)" }
      },
      purple: {
        light: { primary: "oklch(0.546 0.245 292.881)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.943 0.05 292.588)", secondary_foreground: "oklch(0.408 0.182 292.881)" },
        dark: { primary: "oklch(0.624 0.249 292.717)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.265 0.065 292.717)", secondary_foreground: "oklch(0.802 0.128 292.717)" }
      },
      rose: {
        light: { primary: "oklch(0.585 0.247 17.585)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.955 0.04 17.585)", secondary_foreground: "oklch(0.444 0.183 17.585)" },
        dark: { primary: "oklch(0.645 0.246 16.439)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.278 0.063 16.439)", secondary_foreground: "oklch(0.807 0.122 16.439)" }
      },
      sky: {
        light: { primary: "oklch(0.585 0.187 227.392)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.946 0.036 230.9)", secondary_foreground: "oklch(0.432 0.14 227.392)" },
        dark: { primary: "oklch(0.63 0.178 230.902)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.265 0.054 230.902)", secondary_foreground: "oklch(0.801 0.094 230.902)" }
      },
      teal: {
        light: { primary: "oklch(0.6 0.118 184.714)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.952 0.032 190.9)", secondary_foreground: "oklch(0.448 0.098 184.364)" },
        dark: { primary: "oklch(0.648 0.145 184.525)", primary_foreground: "oklch(0.985 0 0)", secondary: "oklch(0.263 0.048 184.525)", secondary_foreground: "oklch(0.797 0.08 184.525)" }
      },
      yellow: {
        light: { primary: "oklch(0.795 0.184 86.047)", primary_foreground: "oklch(0.296 0.07 45.622)", secondary: "oklch(0.963 0.043 86.318)", secondary_foreground: "oklch(0.555 0.163 68.998)" },
        dark: { primary: "oklch(0.795 0.184 86.047)", primary_foreground: "oklch(0.296 0.07 45.622)", secondary: "oklch(0.282 0.059 86.058)", secondary_foreground: "oklch(0.822 0.107 86.366)" }
      }
    }.freeze

    # Generate CSS for a theme by merging base + accent
    def self.generate_css(base_color: :neutral, accent_color: nil, radius: "0.625rem")
      base = BASE_COLORS[base_color]
      raise ArgumentError, "Unknown base color: #{base_color}" unless base

      light_vars = base[:light].dup
      dark_vars = base[:dark].dup

      if accent_color
        accent = ACCENT_COLORS[accent_color]
        raise ArgumentError, "Unknown accent color: #{accent_color}" unless accent
        light_vars.merge!(accent[:light])
        dark_vars.merge!(accent[:dark])
      end

      css = ":root {\n  --radius: #{radius};\n"
      light_vars.each do |key, value|
        css << "  --#{key.to_s.tr('_', '-')}: #{value};\n"
      end
      css << "}\n\n.dark {\n"
      dark_vars.each do |key, value|
        css << "  --#{key.to_s.tr('_', '-')}: #{value};\n"
      end
      css << "}\n"
      css
    end
  end
end
