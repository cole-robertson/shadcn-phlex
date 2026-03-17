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
          stylesheet_tag("application")
          # Blocking script to apply dark mode before first paint — prevents FOUC
          comment { "Blocking dark mode script to prevent FOUC" }
          script do
            raw(Phlex::HTML::SafeValue.new('(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();'))
          end
          script_tag("application")
        end
        body(class: "min-h-screen bg-background text-foreground antialiased", data_controller: "shadcn--dark-mode") do
          # Sonner toast container
          div(data_controller: "sonner", data_sonner_theme_value: "system", data_sonner_rich_colors_value: "true")
          # Mobile nav sheet — must be outside header (backdrop-filter creates containing block for fixed positioning)
          render_mobile_nav
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

    def render_mobile_nav
    end

    def render_header
      # Use bg-background (opaque, no backdrop-blur) so fixed-position Sheet inside works on mobile
      header(class: "sticky top-0 z-40 w-full border-b bg-background md:bg-background/95 md:backdrop-blur md:supports-[backdrop-filter]:bg-background/60") do
        div(class: "flex h-14 items-center px-4 md:px-10") do
          # Mobile menu sheet — inside header but no backdrop-filter on mobile
          div(class: "md:hidden mr-2") do
            ui_sheet do
              ui_sheet_trigger do
                ui_button(variant: :ghost, size: :icon) do
                  svg(xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20",
                      viewbox: "0 0 24 24", fill: "none", stroke: "currentColor",
                      stroke_width: "2", stroke_linecap: "round", stroke_linejoin: "round") do |s|
                    s.line(x1: "4", x2: "20", y1: "6", y2: "6")
                    s.line(x1: "4", x2: "20", y1: "12", y2: "12")
                    s.line(x1: "4", x2: "20", y1: "18", y2: "18")
                  end
                  span(class: "sr-only") { "Menu" }
                end
              end
              ui_sheet_content(side: :left) do
                ui_sheet_header do
                  ui_sheet_title { "shadcn-phlex" }
                end
                nav(class: "overflow-y-auto py-4 -mx-2") do
                  render_nav_links
                end
              end
            end
          end

          a(href: "/", class: "flex items-center gap-2 font-bold text-lg") do
            plain "shadcn-phlex"
          end
          div(class: "flex-1")
          nav(class: "flex items-center gap-4") do
            a(href: "/", class: "hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors") { "Docs" }
            a(href: "/components/button", class: "hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors") { "Components" }
            ui_theme_toggle
          end
        end
      end
    end

    def render_sidebar
      aside(class: "hidden md:block w-64 shrink-0 border-r") do
        nav(class: "sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 px-4") do
          render_nav_links
        end
      end
    end

    def render_nav_links
      COMPONENT_GROUPS.each do |group, items|
        div(class: "mb-6") do
          h4(class: "mb-2 text-sm font-semibold text-foreground") { group }
          ul(class: "flex flex-col gap-1") do
            items.each do |item|
              if item.is_a?(Hash)
                li do
                  a(
                    href: item[:path],
                    class: "block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  ) { item[:name] }
                end
              else
                li do
                  a(
                    href: "/components/#{item.gsub(/([A-Z])/, '_\1').downcase.sub(/^_/, '')}",
                    class: "block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
