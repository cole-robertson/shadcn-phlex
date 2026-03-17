# frozen_string_literal: true

require_relative "lib/shadcn/version"

Gem::Specification.new do |spec|
  spec.name = "shadcn-phlex"
  spec.version = Shadcn::VERSION
  spec.authors = ["cole-robertson"]
  spec.summary = "Complete shadcn/ui component library for Phlex Rails"
  spec.description = "All shadcn/ui v4 components ported to Phlex with Stimulus controllers, " \
                     "7 base color themes, 17 accent colors, and Rails generators."
  spec.homepage = "https://github.com/cole-robertson/shadcn-phlex"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 3.1.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = spec.homepage
  spec.metadata["changelog_uri"] = "#{spec.homepage}/commits/master"

  spec.files = Dir[
    "lib/**/*.rb",
    "js/**/*.js",
    "css/**/*.css",
    "skills/**/*",
    "app.css",
    "package.json",
    "README.md",
    "LICENSE"
  ]

  spec.require_paths = ["lib"]

  spec.add_dependency "phlex", "~> 2.1"
  spec.add_dependency "phlex-rails", "~> 2.1"
  spec.add_dependency "class_variants", "~> 1.0"
  spec.add_dependency "tailwind_merge", "~> 1.0"
end
