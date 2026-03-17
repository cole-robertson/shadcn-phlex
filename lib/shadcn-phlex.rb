# frozen_string_literal: true

# Bundler auto-requires based on gem name: shadcn-phlex → shadcn/phlex
# This shim redirects to the actual entry point at lib/shadcn.rb
# so users don't need `require: "shadcn"` in their Gemfile.
require_relative "shadcn"
