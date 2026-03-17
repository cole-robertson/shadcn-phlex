# frozen_string_literal: true

module Layouts
  class DocsLayout < ApplicationView
    COMPONENT_GROUPS = {
      "Getting Started" => [
        { name: "Introduction", path: "/" },
        { name: "Installation", path: "/installation" },
      ],
      "Forms" => %w[Button Input Textarea Label Checkbox Switch Select RadioGroup Slider TextField],
      "Layout" => %w[Card Separator AspectRatio ScrollArea],
      "Data Display" => %w[Table Avatar Badge Kbd Skeleton Spinner Progress Empty],
      "Feedback" => %w[Alert Toast],
      "Overlays" => %w[Dialog AlertDialog Sheet Drawer Popover Tooltip HoverCard DropdownMenu ContextMenu],
      "Navigation" => %w[Tabs Accordion Breadcrumb Pagination],
      "Other" => %w[Collapsible Toggle ToggleGroup Command Combobox ThemeToggle Typography],
    }.freeze

    def initialize(title: nil, description: nil)
      @title = title
      @description = description
    end

    def around_template(&block)
      doctype
      html(lang: "en", class: "scroll-smooth") do
        head do
          meta(charset: "utf-8")
          meta(name: "viewport", content: "width=device-width,initial-scale=1")
          title { [@title, "shadcn-phlex"].compact.join(" — ") }
          link(rel: "stylesheet", href: "/assets/application.css")
          script(src: "/assets/application.js", defer: true)
        end
        body(class: "min-h-screen bg-background text-foreground antialiased", data_controller: "shadcn--dark-mode") do
          render_header
          div(class: "flex") do
            render_sidebar
            main(class: "flex-1 min-w-0 px-6 py-8 md:px-10 lg:px-16 max-w-4xl") do
              if @title
                div(class: "mb-8") do
                  h1(class: "scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl") { @title }
                  if @description
                    p(class: "mt-2 text-lg text-muted-foreground") { @description }
                  end
                end
              end
              yield
            end
          end
        end
      end
    end

    private

    def render_header
      header(class: "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60") do
        div(class: "flex h-14 items-center px-6 md:px-10") do
          a(href: "/", class: "flex items-center gap-2 font-bold text-lg") do
            plain "shadcn-phlex"
          end
          div(class: "flex-1")
          nav(class: "flex items-center gap-4") do
            a(href: "/", class: "text-sm text-muted-foreground hover:text-foreground transition-colors") { "Docs" }
            a(href: "/components/button", class: "text-sm text-muted-foreground hover:text-foreground transition-colors") { "Components" }
            ui_theme_toggle
          end
        end
      end
    end

    def render_sidebar
      aside(class: "hidden md:block w-64 shrink-0 border-r") do
        nav(class: "sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 px-4") do
          COMPONENT_GROUPS.each do |group, items|
            div(class: "mb-6") do
              h4(class: "mb-2 text-sm font-semibold text-foreground") { group }
              ul(class: "space-y-1") do
                items.each do |item|
                  if item.is_a?(Hash)
                    li do
                      a(
                        href: item[:path],
                        class: "block rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      ) { item[:name] }
                    end
                  else
                    li do
                      a(
                        href: "/components/#{item.gsub(/([A-Z])/, '_\1').downcase.sub(/^_/, '')}",
                        class: "block rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      ) { item }
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
  end
end
